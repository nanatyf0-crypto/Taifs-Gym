import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, Apple } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NutritionPlan = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [calories, setCalories] = useState(2000);
  const [plan, setPlan] = useState(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('session_token');
      const response = await axios.post(
        `${API}/nutrition-plans`,
        { target_calories: parseInt(calories) },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPlan(response.data);
      toast.success('Nutrition plan generated!');
    } catch (error) {
      console.error('Plan generation error:', error);
      toast.error(error.response?.data?.detail || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" data-testid="nutrition-plan-page">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">Taif Fit AI</div>
          <Button onClick={() => navigate('/dashboard')} variant="ghost" data-testid="back-to-dashboard-btn">
            <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} />
            {t('dashboard')}
          </Button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="glass-card fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <Apple size={40} color="#0ea5e9" style={{ marginRight: '1rem' }} />
            <h1
              className="gradient-text"
              data-testid="nutrition-title"
              style={{ fontSize: '2.5rem', fontWeight: '700' }}
            >
              {t('nutritionPlan')}
            </h1>
          </div>

          {!plan ? (
            <div data-testid="nutrition-form">
              <div style={{ marginBottom: '2rem' }}>
                <Label htmlFor="calories">{t('dailyCalories')} ({calories} kcal)</Label>
                <Input
                  id="calories"
                  data-testid="calories-input"
                  type="range"
                  min="1200"
                  max="4000"
                  step="100"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    accentColor: '#0ea5e9'
                  }}
                />
              </div>

              <Button
                onClick={handleGenerate}
                data-testid="generate-nutrition-btn"
                className="btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? t('generating') : t('generatePlan')}
              </Button>
            </div>
          ) : (
            <div data-testid="nutrition-result" className="fade-in">
              <div style={{ padding: '2rem', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '16px', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1.5rem', color: '#0ea5e9' }}>
                  {plan.plan_name}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{t('dailyCalories')}</p>
                    <p style={{ color: '#0ea5e9', fontSize: '1.5rem', fontWeight: '600' }}>{plan.daily_calories}</p>
                  </div>
                  <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{t('protein')}</p>
                    <p style={{ color: '#0ea5e9', fontSize: '1.5rem', fontWeight: '600' }}>{plan.protein}g</p>
                  </div>
                  <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{t('carbs')}</p>
                    <p style={{ color: '#0ea5e9', fontSize: '1.5rem', fontWeight: '600' }}>{plan.carbs}g</p>
                  </div>
                  <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{t('fats')}</p>
                    <p style={{ color: '#0ea5e9', fontSize: '1.5rem', fontWeight: '600' }}>{plan.fats}g</p>
                  </div>
                </div>

                {plan.meals && plan.meals.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '1rem' }}>
                      {t('meals')}
                    </h4>
                    {plan.meals.map((meal, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '1.5rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '12px',
                          marginBottom: '1rem'
                        }}
                      >
                        <h5 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0ea5e9', marginBottom: '0.75rem', textTransform: 'capitalize' }}>
                          {meal.meal_type}
                        </h5>
                        {meal.foods && (
                          <ul style={{ color: '#e2e8f0', paddingLeft: '1.5rem', marginBottom: '0.75rem' }}>
                            {meal.foods.map((food, foodIdx) => (
                              <li key={foodIdx} style={{ marginBottom: '0.25rem' }}>{food}</li>
                            ))}
                          </ul>
                        )}
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                          {meal.calories} kcal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setPlan(null)}
                data-testid="new-nutrition-plan-btn"
                className="btn-secondary"
                style={{ width: '100%' }}
              >
                Generate New Plan
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionPlan;