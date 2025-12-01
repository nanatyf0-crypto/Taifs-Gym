from fastapi import FastAPI, APIRouter, HTTPException, Header, Response, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import hashlib
import base64
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
import aiohttp

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'taif_fit_db')]

# LLM Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ========== MODELS ==========

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    picture: Optional[str] = None
    language_preference: str = "ar"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str = Field(default_factory=lambda: str(uuid.uuid4()))
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BodyAnalysis(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    weight: float
    height: float
    age: int
    gender: str
    goal: str
    body_type: Optional[str] = None
    body_fat_percentage: Optional[float] = None
    image_url: Optional[str] = None
    analysis_data: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WorkoutPlan(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    plan_name: str
    location: str
    days_per_week: int
    exercises: List[Dict[str, Any]]
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NutritionPlan(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    plan_name: str
    daily_calories: int
    protein: int
    carbs: int
    fats: int
    meals: List[Dict[str, Any]]
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProgressLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    weight: float
    body_fat: Optional[float] = None
    photos: Optional[List[str]] = None
    notes: Optional[str] = None
    logged_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ========== INPUT MODELS ==========

class RegisterInput(BaseModel):
    email: str
    password: str
    name: str

class LoginInput(BaseModel):
    email: str
    password: str

class BodyAnalysisInput(BaseModel):
    weight: float
    height: float
    age: int
    gender: str
    goal: str
    image_base64: Optional[str] = None

class WorkoutPlanInput(BaseModel):
    location: str
    days_per_week: int

class NutritionPlanInput(BaseModel):
    target_calories: int

class ProgressLogInput(BaseModel):
    weight: float
    body_fat: Optional[float] = None
    notes: Optional[str] = None

# ========== HELPER FUNCTIONS ==========

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

async def get_current_user(authorization: Optional[str] = None, request: Request = None) -> Optional[User]:
    token = None
    
    # Try cookie first
    if request:
        token = request.cookies.get('session_token')
    
    # Fallback to Authorization header
    if not token and authorization:
        if authorization.startswith('Bearer '):
            token = authorization[7:]
        else:
            token = authorization
    
    if not token:
        return None
    
    session = await db.user_sessions.find_one({
        "session_token": token,
        "expires_at": {"$gt": datetime.now(timezone.utc).isoformat()}
    })
    
    if not session:
        return None
    
    user_doc = await db.users.find_one({"id": session["user_id"]})
    if not user_doc:
        return None
    
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    return User(**user_doc)

# ========== AUTH ENDPOINTS ==========

@api_router.post("/auth/register")
async def register(input: RegisterInput):
    existing = await db.users.find_one({"email": input.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=input.email,
        name=input.name
    )
    
    user_doc = user.model_dump()
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    user_doc['password_hash'] = hash_password(input.password)
    
    await db.users.insert_one(user_doc)
    
    session = UserSession(
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7)
    )
    
    session_doc = session.model_dump()
    session_doc['created_at'] = session_doc['created_at'].isoformat()
    session_doc['expires_at'] = session_doc['expires_at'].isoformat()
    
    await db.user_sessions.insert_one(session_doc)
    
    return {
        "user": user,
        "session_token": session.session_token
    }

@api_router.post("/auth/login")
async def login(input: LoginInput):
    user_doc = await db.users.find_one({"email": input.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user_doc.get('password_hash') != hash_password(input.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user = User(**{k: v for k, v in user_doc.items() if k != 'password_hash'})
    
    session = UserSession(
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7)
    )
    
    session_doc = session.model_dump()
    session_doc['created_at'] = session_doc['created_at'].isoformat()
    session_doc['expires_at'] = session_doc['expires_at'].isoformat()
    
    await db.user_sessions.insert_one(session_doc)
    
    return {
        "user": user,
        "session_token": session.session_token
    }

@api_router.get("/auth/session")
async def get_session_data(x_session_id: str = Header(...)):
    async with aiohttp.ClientSession() as session:
        async with session.get(
            'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data',
            headers={'X-Session-ID': x_session_id}
        ) as resp:
            if resp.status != 200:
                raise HTTPException(status_code=401, detail="Invalid session")
            
            data = await resp.json()
            
            existing_user = await db.users.find_one({"email": data['email']})
            
            if existing_user:
                if isinstance(existing_user.get('created_at'), str):
                    existing_user['created_at'] = datetime.fromisoformat(existing_user['created_at'])
                user = User(**existing_user)
            else:
                user = User(
                    email=data['email'],
                    name=data['name'],
                    picture=data.get('picture')
                )
                user_doc = user.model_dump()
                user_doc['created_at'] = user_doc['created_at'].isoformat()
                await db.users.insert_one(user_doc)
            
            session_obj = UserSession(
                user_id=user.id,
                session_token=data['session_token'],
                expires_at=datetime.now(timezone.utc) + timedelta(days=7)
            )
            
            session_doc = session_obj.model_dump()
            session_doc['created_at'] = session_doc['created_at'].isoformat()
            session_doc['expires_at'] = session_doc['expires_at'].isoformat()
            
            await db.user_sessions.insert_one(session_doc)
            
            return {
                "user": user,
                "session_token": data['session_token']
            }

@api_router.get("/auth/me")
async def get_me(
    authorization: Optional[str] = Header(None),
    request: Request = None
):
    user = await get_current_user(authorization, request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user

@api_router.post("/auth/logout")
async def logout(
    response: Response,
    authorization: Optional[str] = Header(None),
    request: Request = None
):
    token = None
    if request:
        token = request.cookies.get('session_token')
    if not token and authorization:
        token = authorization[7:] if authorization.startswith('Bearer ') else authorization
    
    if token:
        await db.user_sessions.delete_many({"session_token": token})
    
    response.delete_cookie('session_token')
    return {"message": "Logged out"}

# ========== BODY ANALYSIS ENDPOINTS ==========

@api_router.post("/body-analyses", response_model=BodyAnalysis)
async def create_body_analysis(
    input: BodyAnalysisInput,
    authorization: Optional[str] = Header(None),
    request: Request = None
):
    user = await get_current_user(authorization, request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # AI Analysis using OpenAI Vision
    analysis_text = ""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"body_analysis_{user.id}_{uuid.uuid4()}",
            system_message="You are a fitness expert. Analyze body metrics and provide insights."
        ).with_model("openai", "gpt-4o")
        
        prompt = f"""Analyze this body profile:
Weight: {input.weight}kg
Height: {input.height}cm
Age: {input.age}
Gender: {input.gender}
Goal: {input.goal}

Provide:
1. Estimated body type (ectomorph/mesomorph/endomorph)
2. Estimated body fat percentage
3. Key recommendations
4. Areas to focus on

Respond in JSON format: {{"body_type": "...", "body_fat_percentage": 0, "recommendations": "...", "focus_areas": "..."}}
"""
        
        messages = [UserMessage(text=prompt)]
        
        if input.image_base64:
            image_content = ImageContent(image_base64=input.image_base64)
            messages[0].file_contents = [image_content]
        
        response = await chat.send_message(messages[0])
        analysis_text = response
        
        # Parse AI response
        import json
        try:
            analysis_data = json.loads(response.replace('```json', '').replace('```', '').strip())
        except:
            analysis_data = {"raw_response": response}
        
    except Exception as e:
        logging.error(f"AI Analysis error: {e}")
        analysis_data = {"error": str(e)}
    
    body_analysis = BodyAnalysis(
        user_id=user.id,
        weight=input.weight,
        height=input.height,
        age=input.age,
        gender=input.gender,
        goal=input.goal,
        body_type=analysis_data.get('body_type'),
        body_fat_percentage=analysis_data.get('body_fat_percentage'),
        analysis_data=analysis_data
    )
    
    doc = body_analysis.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.body_analyses.insert_one(doc)
    
    return body_analysis

@api_router.get("/body-analyses", response_model=List[BodyAnalysis])
async def get_body_analyses(
    authorization: Optional[str] = Header(None),
    request: Request = None
):
    user = await get_current_user(authorization, request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    analyses = await db.body_analyses.find(
        {"user_id": user.id}, {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    for analysis in analyses:
        if isinstance(analysis.get('created_at'), str):
            analysis['created_at'] = datetime.fromisoformat(analysis['created_at'])
    
    return analyses

# ========== WORKOUT PLAN ENDPOINTS ==========

@api_router.post("/workout-plans", response_model=WorkoutPlan)
async def create_workout_plan(
    input: WorkoutPlanInput,
    authorization: Optional[str] = Header(None),
    request: Request = None
):
    user = await get_current_user(authorization, request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Get latest body analysis
    latest_analysis = await db.body_analyses.find_one(
        {"user_id": user.id},
        {"_id": 0},
        sort=[("created_at", -1)]
    )
    
    # Generate workout plan with AI
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"workout_plan_{user.id}_{uuid.uuid4()}",
            system_message="You are a professional fitness trainer. Create detailed workout plans."
        ).with_model("openai", "gpt-4o")
        
        context = ""
        if latest_analysis:
            context = f"User profile: Weight {latest_analysis['weight']}kg, Height {latest_analysis['height']}cm, Age {latest_analysis['age']}, Goal: {latest_analysis['goal']}"
        
        prompt = f"""{context}
Create a {input.days_per_week}-day workout plan for {input.location} training.

Provide a detailed plan in JSON format:
{{
  "plan_name": "...",
  "exercises": [
    {{
      "day": 1,
      "muscle_group": "...",
      "exercises": [
        {{"name": "...", "sets": 0, "reps": "...", "rest": "...", "notes": "..."}}
      ]
    }}
  ]
}}
"""
        
        response = await chat.send_message(UserMessage(text=prompt))
        
        import json
        try:
            plan_data = json.loads(response.replace('```json', '').replace('```', '').strip())
        except:
            plan_data = {"plan_name": "Custom Plan", "exercises": []}
        
    except Exception as e:
        logging.error(f"Workout plan generation error: {e}")
        plan_data = {"plan_name": "Basic Plan", "exercises": []}
    
    workout_plan = WorkoutPlan(
        user_id=user.id,
        plan_name=plan_data.get('plan_name', 'Custom Plan'),
        location=input.location,
        days_per_week=input.days_per_week,
        exercises=plan_data.get('exercises', [])
    )
    
    # Deactivate old plans
    await db.workout_plans.update_many(
        {"user_id": user.id},
        {"$set": {"active": False}}
    )
    
    doc = workout_plan.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.workout_plans.insert_one(doc)
    
    return workout_plan

@api_router.get("/workout-plans", response_model=List[WorkoutPlan])
async def get_workout_plans(
    authorization: Optional[str] = Header(None),
    request: Request = None
):
    user = await get_current_user(authorization, request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    plans = await db.workout_plans.find(
        {"user_id": user.id}, {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    for plan in plans:
        if isinstance(plan.get('created_at'), str):
            plan['created_at'] = datetime.fromisoformat(plan['created_at'])
    
    return plans

# ========== NUTRITION PLAN ENDPOINTS ==========

@api_router.post("/nutrition-plans", response_model=NutritionPlan)
async def create_nutrition_plan(
    input: NutritionPlanInput,
    authorization: Optional[str] = Header(None),
    request: Request = None
):
    user = await get_current_user(authorization, request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Get latest body analysis
    latest_analysis = await db.body_analyses.find_one(
        {"user_id": user.id},
        {"_id": 0},
        sort=[("created_at", -1)]
    )
    
    # Generate nutrition plan with AI
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"nutrition_plan_{user.id}_{uuid.uuid4()}",
            system_message="You are a certified nutritionist. Create balanced meal plans."
        ).with_model("openai", "gpt-4o")
        
        context = ""
        if latest_analysis:
            context = f"User: {latest_analysis['weight']}kg, {latest_analysis['height']}cm, Age {latest_analysis['age']}, Goal: {latest_analysis['goal']}"
        
        prompt = f"""{context}
Create a nutrition plan with {input.target_calories} calories.

Provide in JSON format:
{{
  "plan_name": "...",
  "daily_calories": {input.target_calories},
  "protein": 0,
  "carbs": 0,
  "fats": 0,
  "meals": [
    {{
      "meal_type": "breakfast",
      "foods": ["..."],
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fats": 0
    }}
  ]
}}
"""
        
        response = await chat.send_message(UserMessage(text=prompt))
        
        import json
        try:
            plan_data = json.loads(response.replace('```json', '').replace('```', '').strip())
        except:
            plan_data = {
                "plan_name": "Basic Plan",
                "daily_calories": input.target_calories,
                "protein": 150, "carbs": 200, "fats": 60,
                "meals": []
            }
        
    except Exception as e:
        logging.error(f"Nutrition plan generation error: {e}")
        plan_data = {
            "plan_name": "Basic Plan",
            "daily_calories": input.target_calories,
            "protein": 150, "carbs": 200, "fats": 60,
            "meals": []
        }
    
    nutrition_plan = NutritionPlan(
        user_id=user.id,
        plan_name=plan_data.get('plan_name', 'Custom Plan'),
        daily_calories=plan_data.get('daily_calories', input.target_calories),
        protein=plan_data.get('protein', 150),
        carbs=plan_data.get('carbs', 200),
        fats=plan_data.get('fats', 60),
        meals=plan_data.get('meals', [])
    )
    
    # Deactivate old plans
    await db.nutrition_plans.update_many(
        {"user_id": user.id},
        {"$set": {"active": False}}
    )
    
    doc = nutrition_plan.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.nutrition_plans.insert_one(doc)
    
    return nutrition_plan

@api_router.get("/nutrition-plans", response_model=List[NutritionPlan])
async def get_nutrition_plans(
    authorization: Optional[str] = Header(None),
    request: Request = None
):
    user = await get_current_user(authorization, request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    plans = await db.nutrition_plans.find(
        {"user_id": user.id}, {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    for plan in plans:
        if isinstance(plan.get('created_at'), str):
            plan['created_at'] = datetime.fromisoformat(plan['created_at'])
    
    return plans

# ========== PROGRESS ENDPOINTS ==========

@api_router.post("/progress-logs", response_model=ProgressLog)
async def create_progress_log(
    input: ProgressLogInput,
    authorization: Optional[str] = Header(None),
    request: Request = None
):
    user = await get_current_user(authorization, request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    progress_log = ProgressLog(
        user_id=user.id,
        weight=input.weight,
        body_fat=input.body_fat,
        notes=input.notes
    )
    
    doc = progress_log.model_dump()
    doc['logged_at'] = doc['logged_at'].isoformat()
    
    await db.progress_logs.insert_one(doc)
    
    return progress_log

@api_router.get("/progress-logs", response_model=List[ProgressLog])
async def get_progress_logs(
    authorization: Optional[str] = Header(None),
    request: Request = None
):
    user = await get_current_user(authorization, request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    logs = await db.progress_logs.find(
        {"user_id": user.id}, {"_id": 0}
    ).sort("logged_at", -1).to_list(100)
    
    for log in logs:
        if isinstance(log.get('logged_at'), str):
            log['logged_at'] = datetime.fromisoformat(log['logged_at'])
    
    return logs

# ========== ROOT ==========

@api_router.get("/")
async def root():
    return {"message": "Taif Fit AI API"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
