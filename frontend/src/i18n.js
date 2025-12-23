import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Landing
      "welcome": "Welcome to Taif Fit AI",
      "tagline": "Your Smart Fitness & Health Platform",
      "getStarted": "Get Started",
      "login": "Login",
      "logout": "Logout",
      "features": "Features",
      "feature1Title": "AI Body Analysis",
      "feature1Desc": "Smart body scan with AI-powered insights",
      "feature2Title": "Custom Workout Plans",
      "feature2Desc": "Personalized training programs",
      "feature3Title": "Nutrition Planning",
      "feature3Desc": "AI-generated meal plans",
      "feature4Title": "Progress Tracking",
      "feature4Desc": "Monitor your fitness journey",
      
      // Auth
      "signInWithGoogle": "Sign in with Google",
      "orContinueWith": "Or continue with",
      "email": "Email",
      "password": "Password",
      "name": "Name",
      "signIn": "Sign In",
      "signUp": "Sign Up",
      "dontHaveAccount": "Don't have an account?",
      "alreadyHaveAccount": "Already have an account?",
      
      // Dashboard
      "dashboard": "Dashboard",
      "bodyAnalysis": "Body Analysis",
      "workoutPlan": "Workout Plan",
      "nutritionPlan": "Nutrition Plan",
      "progress": "Progress",
      "profile": "Profile",
      
      // Body Analysis
      "analyzeBody": "Analyze Your Body",
      "uploadPhoto": "Upload Photo",
      "enterDetails": "Enter Your Details",
      "weight": "Weight (kg)",
      "height": "Height (cm)",
      "age": "Age",
      "gender": "Gender",
      "male": "Male",
      "female": "Female",
      "goal": "Goal",
      "loseWeight": "Lose Weight",
      "buildMuscle": "Build Muscle",
      "maintain": "Maintain Fitness",
      "analyze": "Analyze",
      "analyzing": "Analyzing...",
      
      // Workout
      "generatePlan": "Generate Plan",
      "generating": "Generating...",
      "workoutLocation": "Where will you train?",
      "gym": "Gym",
      "home": "Home",
      "minimal": "Minimal Equipment",
      "days": "Days per week",
      
      // Nutrition
      "dailyCalories": "Daily Calories",
      "protein": "Protein",
      "carbs": "Carbs",
      "fats": "Fats",
      "meals": "Meals",
      "breakfast": "Breakfast",
      "lunch": "Lunch",
      "dinner": "Dinner",
      "snacks": "Snacks",
      
      // Progress
      "logProgress": "Log Progress",
      "currentWeight": "Current Weight",
      "bodyFat": "Body Fat %",
      "notes": "Notes",
      "save": "Save",
      "viewHistory": "View History",
      
      // Common
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "cancel": "Cancel",
      "close": "Close",
      "back": "Back",
      "next": "Next",
      "submit": "Submit",
      
      // New Features
      "challenges": "Challenges",
      "community": "Community",
      "exerciseLibrary": "Exercise Library",
      "mealLibrary": "Meal Library",
      "aiStudio": "AI Studio",
      "leaderboard": "Leaderboard",
      "dailyTips": "Daily Tips & Stats",
      "favorites": "Favorites",
      "stats": "Statistics",
      "coins": "Coins",
      "badges": "Badges",
      "rank": "Rank",
      "totalEarned": "Total Earned",
      "refresh": "Refresh",
      "generateImage": "Generate Image",
      "generateVoice": "Generate Voice",
      "imageGeneration": "Image Generation",
      "voiceAssistant": "Voice Assistant",
      "exerciseName": "Exercise Name",
      "mealName": "Meal Name",
      "voiceType": "Voice Type",
      "textToSpeak": "Text to Speak",
      "imagetype": "Image Type",
      "exercise": "Exercise",
      "meal": "Meal",
      "generating": "Generating..."
    }
  },
  ar: {
    translation: {
      // Landing
      "welcome": "مرحباً بك في طيف فت AI",
      "tagline": "منصتك الذكية للصحة واللياقة",
      "getStarted": "ابدأ الآن",
      "login": "تسجيل الدخول",
      "logout": "تسجيل الخروج",
      "features": "المميزات",
      "feature1Title": "تحليل الجسم بالذكاء الاصطناعي",
      "feature1Desc": "فحص ذكي للجسم مع رؤى دقيقة",
      "feature2Title": "خطط تدريب مخصصة",
      "feature2Desc": "برامج تدريبية شخصية",
      "feature3Title": "التخطيط الغذائي",
      "feature3Desc": "خطط وجبات مولدة بالذكاء الاصطناعي",
      "feature4Title": "تتبع التقدم",
      "feature4Desc": "راقب رحلة لياقتك",
      
      // Auth
      "signInWithGoogle": "تسجيل الدخول بجوجل",
      "orContinueWith": "أو تابع باستخدام",
      "email": "البريد الإلكتروني",
      "password": "كلمة المرور",
      "name": "الاسم",
      "signIn": "تسجيل الدخول",
      "signUp": "إنشاء حساب",
      "dontHaveAccount": "ليس لديك حساب؟",
      "alreadyHaveAccount": "لديك حساب بالفعل؟",
      
      // Dashboard
      "dashboard": "لوحة التحكم",
      "bodyAnalysis": "تحليل الجسم",
      "workoutPlan": "خطة التمرين",
      "nutritionPlan": "النظام الغذائي",
      "progress": "التقدم",
      "profile": "الملف الشخصي",
      
      // Body Analysis
      "analyzeBody": "تحليل جسمك",
      "uploadPhoto": "رفع صورة",
      "enterDetails": "أدخل بياناتك",
      "weight": "الوزن (كجم)",
      "height": "الطول (سم)",
      "age": "العمر",
      "gender": "الجنس",
      "male": "ذكر",
      "female": "أنثى",
      "goal": "الهدف",
      "loseWeight": "خسارة الوزن",
      "buildMuscle": "بناء العضلات",
      "maintain": "المحافظة على اللياقة",
      "analyze": "تحليل",
      "analyzing": "جاري التحليل...",
      
      // Workout
      "generatePlan": "إنشاء خطة",
      "generating": "جاري الإنشاء...",
      "workoutLocation": "أين ستتدرب؟",
      "gym": "صالة رياضية",
      "home": "المنزل",
      "minimal": "أدوات بسيطة",
      "days": "أيام في الأسبوع",
      
      // Nutrition
      "dailyCalories": "السعرات اليومية",
      "protein": "البروتين",
      "carbs": "الكربوهيدرات",
      "fats": "الدهون",
      "meals": "الوجبات",
      "breakfast": "الفطور",
      "lunch": "الغداء",
      "dinner": "العشاء",
      "snacks": "وجبات خفيفة",
      
      // Progress
      "logProgress": "تسجيل التقدم",
      "currentWeight": "الوزن الحالي",
      "bodyFat": "نسبة الدهون %",
      "notes": "ملاحظات",
      "save": "حفظ",
      "viewHistory": "عرض السجل",
      
      // Common
      "loading": "جاري التحميل...",
      "error": "خطأ",
      "success": "نجح",
      "cancel": "إلغاء",
      "close": "إغلاق",
      "back": "رجوع",
      "next": "التالي",
      "submit": "إرسال",
      
      // New Features
      "challenges": "التحديات",
      "community": "المجتمع",
      "exerciseLibrary": "مكتبة التمارين",
      "mealLibrary": "مكتبة الوجبات",
      "aiStudio": "استوديو الذكاء الاصطناعي",
      "leaderboard": "لوحة المتصدرين",
      "dailyTips": "نصائح يومية وإحصائيات",
      "favorites": "المفضلة",
      "stats": "الإحصائيات",
      "coins": "العملات",
      "badges": "الأوسمة",
      "rank": "الترتيب",
      "totalEarned": "المجموع المكتسب",
      "refresh": "تحديث",
      "generateImage": "توليد صورة",
      "generateVoice": "توليد صوت",
      "imageGeneration": "توليد الصور",
      "voiceAssistant": "المساعد الصوتي",
      "exerciseName": "اسم التمرين",
      "mealName": "اسم الوجبة",
      "voiceType": "نوع الصوت",
      "textToSpeak": "النص للنطق",
      "imageType": "نوع الصورة",
      "exercise": "تمرين",
      "meal": "وجبة",
      "generating": "جاري التوليد..."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;