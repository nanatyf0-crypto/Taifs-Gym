"""
Sample Data Seeder for Taif Fit AI
Populates database with exercises and meals
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "taif_fit_db"

async def seed_data():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("🌱 Seeding database...")
    
    # Sample Exercises
    exercises = [
        {
            "id": "ex1",
            "name": "Push-ups",
            "category": "bodyweight",
            "muscle_group": "chest",
            "difficulty": "beginner",
            "equipment": "none",
            "instructions": "Start in plank position. Lower body until chest nearly touches floor. Push back up.",
            "calories_burned": 7,
            "is_premium": False
        },
        {
            "id": "ex2",
            "name": "Pull-ups",
            "category": "bodyweight",
            "muscle_group": "back",
            "difficulty": "intermediate",
            "equipment": "pull-up bar",
            "instructions": "Hang from bar with palms facing away. Pull yourself up until chin is over bar.",
            "calories_burned": 10,
            "is_premium": False
        },
        {
            "id": "ex3",
            "name": "Squats",
            "category": "bodyweight",
            "muscle_group": "legs",
            "difficulty": "beginner",
            "equipment": "none",
            "instructions": "Stand with feet shoulder-width apart. Lower hips back and down. Push through heels to stand.",
            "calories_burned": 8,
            "is_premium": False
        },
        {
            "id": "ex4",
            "name": "Bench Press",
            "category": "weights",
            "muscle_group": "chest",
            "difficulty": "intermediate",
            "equipment": "barbell",
            "instructions": "Lie on bench. Lower bar to chest. Press up until arms are fully extended.",
            "calories_burned": 12,
            "is_premium": False
        },
        {
            "id": "ex5",
            "name": "Deadlift",
            "category": "weights",
            "muscle_group": "back",
            "difficulty": "advanced",
            "equipment": "barbell",
            "instructions": "Stand with feet hip-width. Grip bar. Lift by extending hips and knees. Keep back straight.",
            "calories_burned": 15,
            "is_premium": True
        },
        {
            "id": "ex6",
            "name": "Burpees",
            "category": "cardio",
            "muscle_group": "full body",
            "difficulty": "intermediate",
            "equipment": "none",
            "instructions": "Start standing. Drop to squat. Kick feet back to plank. Do push-up. Jump feet to hands. Jump up.",
            "calories_burned": 12,
            "is_premium": False
        },
        {
            "id": "ex7",
            "name": "Plank",
            "category": "bodyweight",
            "muscle_group": "core",
            "difficulty": "beginner",
            "equipment": "none",
            "instructions": "Hold push-up position on forearms. Keep body straight. Engage core.",
            "calories_burned": 5,
            "is_premium": False
        },
        {
            "id": "ex8",
            "name": "Lunges",
            "category": "bodyweight",
            "muscle_group": "legs",
            "difficulty": "beginner",
            "equipment": "none",
            "instructions": "Step forward with one leg. Lower hips until both knees are bent at 90 degrees. Push back to start.",
            "calories_burned": 7,
            "is_premium": False
        },
        {
            "id": "ex9",
            "name": "Mountain Climbers",
            "category": "cardio",
            "muscle_group": "core",
            "difficulty": "intermediate",
            "equipment": "none",
            "instructions": "Start in plank. Bring one knee to chest. Quickly switch legs. Repeat rapidly.",
            "calories_burned": 10,
            "is_premium": False
        },
        {
            "id": "ex10",
            "name": "Dumbbell Curls",
            "category": "weights",
            "muscle_group": "arms",
            "difficulty": "beginner",
            "equipment": "dumbbells",
            "instructions": "Stand with dumbbells at sides. Curl weights up to shoulders. Lower slowly.",
            "calories_burned": 6,
            "is_premium": False
        }
    ]
    
    # Sample Meals
    meals = [
        {
            "id": "meal1",
            "name": "Grilled Chicken Salad",
            "meal_type": "lunch",
            "calories": 350,
            "protein": 35,
            "carbs": 20,
            "fats": 12,
            "ingredients": ["Chicken breast", "Mixed greens", "Cherry tomatoes", "Olive oil", "Lemon"],
            "instructions": "Grill chicken. Toss greens with tomatoes. Top with chicken. Drizzle with olive oil and lemon.",
            "prep_time": 20,
            "is_budget_friendly": True,
            "is_child_friendly": True,
            "is_premium": False,
            "dietary_tags": ["high-protein", "low-carb"]
        },
        {
            "id": "meal2",
            "name": "Oatmeal with Berries",
            "meal_type": "breakfast",
            "calories": 280,
            "protein": 10,
            "carbs": 45,
            "fats": 6,
            "ingredients": ["Oats", "Almond milk", "Mixed berries", "Honey", "Almonds"],
            "instructions": "Cook oats in almond milk. Top with berries, honey, and almonds.",
            "prep_time": 10,
            "is_budget_friendly": True,
            "is_child_friendly": True,
            "is_premium": False,
            "dietary_tags": ["vegan", "high-fiber"]
        },
        {
            "id": "meal3",
            "name": "Salmon with Quinoa",
            "meal_type": "dinner",
            "calories": 450,
            "protein": 40,
            "carbs": 35,
            "fats": 18,
            "ingredients": ["Salmon fillet", "Quinoa", "Broccoli", "Garlic", "Olive oil"],
            "instructions": "Bake salmon. Cook quinoa. Steam broccoli. Combine and serve.",
            "prep_time": 30,
            "is_budget_friendly": False,
            "is_child_friendly": True,
            "is_premium": True,
            "dietary_tags": ["high-protein", "omega-3"]
        },
        {
            "id": "meal4",
            "name": "Protein Smoothie",
            "meal_type": "snack",
            "calories": 220,
            "protein": 25,
            "carbs": 20,
            "fats": 5,
            "ingredients": ["Protein powder", "Banana", "Spinach", "Almond milk", "Peanut butter"],
            "instructions": "Blend all ingredients until smooth.",
            "prep_time": 5,
            "is_budget_friendly": True,
            "is_child_friendly": True,
            "is_premium": False,
            "dietary_tags": ["high-protein", "quick"]
        },
        {
            "id": "meal5",
            "name": "Greek Yogurt Bowl",
            "meal_type": "breakfast",
            "calories": 300,
            "protein": 20,
            "carbs": 30,
            "fats": 8,
            "ingredients": ["Greek yogurt", "Granola", "Blueberries", "Honey", "Chia seeds"],
            "instructions": "Layer yogurt with granola and berries. Drizzle with honey. Sprinkle chia seeds.",
            "prep_time": 5,
            "is_budget_friendly": True,
            "is_child_friendly": True,
            "is_premium": False,
            "dietary_tags": ["high-protein", "probiotic"]
        },
        {
            "id": "meal6",
            "name": "Turkey Wrap",
            "meal_type": "lunch",
            "calories": 380,
            "protein": 30,
            "carbs": 40,
            "fats": 10,
            "ingredients": ["Whole wheat tortilla", "Turkey slices", "Lettuce", "Tomato", "Hummus"],
            "instructions": "Spread hummus on tortilla. Add turkey and veggies. Roll tightly.",
            "prep_time": 10,
            "is_budget_friendly": True,
            "is_child_friendly": True,
            "is_premium": False,
            "dietary_tags": ["high-protein", "quick"]
        },
        {
            "id": "meal7",
            "name": "Pre-Workout Energy Bar",
            "meal_type": "pre_workout",
            "calories": 200,
            "protein": 8,
            "carbs": 30,
            "fats": 6,
            "ingredients": ["Oats", "Dates", "Almond butter", "Dark chocolate chips", "Coconut"],
            "instructions": "Blend dates. Mix with oats and almond butter. Form into bars. Chill.",
            "prep_time": 15,
            "is_budget_friendly": True,
            "is_child_friendly": True,
            "is_premium": False,
            "dietary_tags": ["energy", "natural"]
        },
        {
            "id": "meal8",
            "name": "Post-Workout Shake",
            "meal_type": "post_workout",
            "calories": 250,
            "protein": 30,
            "carbs": 25,
            "fats": 4,
            "ingredients": ["Whey protein", "Banana", "Oats", "Milk", "Cinnamon"],
            "instructions": "Blend all ingredients with ice until smooth.",
            "prep_time": 5,
            "is_budget_friendly": True,
            "is_child_friendly": True,
            "is_premium": False,
            "dietary_tags": ["high-protein", "recovery"]
        },
        {
            "id": "meal9",
            "name": "Beef Stir-Fry",
            "meal_type": "dinner",
            "calories": 480,
            "protein": 38,
            "carbs": 35,
            "fats": 20,
            "ingredients": ["Beef strips", "Mixed vegetables", "Brown rice", "Soy sauce", "Ginger"],
            "instructions": "Stir-fry beef. Add vegetables. Season with soy sauce and ginger. Serve over rice.",
            "prep_time": 25,
            "is_budget_friendly": False,
            "is_child_friendly": True,
            "is_premium": True,
            "dietary_tags": ["high-protein", "balanced"]
        },
        {
            "id": "meal10",
            "name": "Veggie Burger",
            "meal_type": "lunch",
            "calories": 320,
            "protein": 15,
            "carbs": 42,
            "fats": 10,
            "ingredients": ["Black bean patty", "Whole wheat bun", "Lettuce", "Tomato", "Avocado"],
            "instructions": "Cook patty. Toast bun. Assemble burger with veggies and avocado.",
            "prep_time": 15,
            "is_budget_friendly": True,
            "is_child_friendly": True,
            "is_premium": False,
            "dietary_tags": ["vegan", "fiber-rich"]
        }
    ]
    
    # Sample Challenges
    challenges = [
        {
            "id": "ch1",
            "name": "30-Day Push-up Challenge",
            "description": "Complete 1000 push-ups in 30 days",
            "type": "fitness",
            "difficulty": "medium",
            "reward_coins": 100,
            "start_date": "2025-01-01T00:00:00Z",
            "end_date": "2025-01-31T23:59:59Z",
            "participants": [],
            "is_global": True,
            "created_at": "2024-12-01T00:00:00Z"
        },
        {
            "id": "ch2",
            "name": "Healthy Eating Week",
            "description": "Log 7 days of balanced meals",
            "type": "nutrition",
            "difficulty": "easy",
            "reward_coins": 50,
            "start_date": "2025-01-01T00:00:00Z",
            "end_date": "2025-01-07T23:59:59Z",
            "participants": [],
            "is_global": True,
            "created_at": "2024-12-01T00:00:00Z"
        },
        {
            "id": "ch3",
            "name": "10K Steps Daily",
            "description": "Walk 10,000 steps every day for a week",
            "type": "fitness",
            "difficulty": "easy",
            "reward_coins": 75,
            "start_date": "2025-01-01T00:00:00Z",
            "end_date": "2025-01-07T23:59:59Z",
            "participants": [],
            "is_global": True,
            "created_at": "2024-12-01T00:00:00Z"
        }
    ]
    
    # Sample Badges
    badges = [
        {
            "id": "badge1",
            "name": "First Workout",
            "description": "Complete your first workout",
            "icon": "🏋️",
            "requirement": "Complete 1 workout",
            "created_at": "2024-12-01T00:00:00Z"
        },
        {
            "id": "badge2",
            "name": "Week Warrior",
            "description": "Train 7 days in a row",
            "icon": "🔥",
            "requirement": "7-day streak",
            "created_at": "2024-12-01T00:00:00Z"
        },
        {
            "id": "badge3",
            "name": "Nutrition Master",
            "description": "Log meals for 30 days",
            "icon": "🍽️",
            "requirement": "30 days of meal logging",
            "created_at": "2024-12-01T00:00:00Z"
        }
    ]
    
    # Clear existing data
    await db.exercises.delete_many({})
    await db.meals.delete_many({})
    await db.challenges.delete_many({})
    await db.badges.delete_many({})
    
    # Insert data
    await db.exercises.insert_many(exercises)
    await db.meals.insert_many(meals)
    await db.challenges.insert_many(challenges)
    await db.badges.insert_many(badges)
    
    print(f"✅ Inserted {len(exercises)} exercises")
    print(f"✅ Inserted {len(meals)} meals")
    print(f"✅ Inserted {len(challenges)} challenges")
    print(f"✅ Inserted {len(badges)} badges")
    print("🎉 Database seeding complete!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
