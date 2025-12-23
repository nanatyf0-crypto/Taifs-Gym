import { useEffect, useState } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './i18n';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import BodyAnalysis from './pages/BodyAnalysis';
import WorkoutPlan from './pages/WorkoutPlan';
import NutritionPlan from './pages/NutritionPlan';
import Progress from './pages/Progress';
import Challenges from './pages/Challenges';
import Community from './pages/Community';
import ExerciseLibrary from './pages/ExerciseLibrary';
import MealLibrary from './pages/MealLibrary';
import AIStudio from './pages/AIStudio';
import { Toaster } from './components/ui/sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('session_token');
      if (token) {
        const response = await axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        if (response.data.language_preference) {
          i18n.changeLanguage(response.data.language_preference);
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
      localStorage.removeItem('session_token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('session_token');
      await axios.post(`${API}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('session_token');
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen" data-testid="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="App" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth setUser={setUser} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
          <Route path="/body-analysis" element={user ? <BodyAnalysis user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
          <Route path="/workout-plan" element={user ? <WorkoutPlan user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
          <Route path="/nutrition-plan" element={user ? <NutritionPlan user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
          <Route path="/progress" element={user ? <Progress user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
          <Route path="/challenges" element={user ? <Challenges user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
          <Route path="/community" element={user ? <Community user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
          <Route path="/exercise-library" element={user ? <ExerciseLibrary user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
          <Route path="/meal-library" element={user ? <MealLibrary user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
          <Route path="/ai-studio" element={user ? <AIStudio user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;