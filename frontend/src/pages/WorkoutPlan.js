import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { ArrowLeft, Dumbbell } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WorkoutPlan = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: 'gym',
    days_per_week: 3
  });
  const [plan, setPlan] = useState(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('session_token');
      const response = await axios.post(
        `${API}/workout-plans`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPlan(response.data);
      toast.success('Workout plan generated!');
    } catch (error) {
      console.error('Plan generation error:', error);
      toast.error(error.response?.data?.detail || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" data-testid="workout-plan-page">
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
            <Dumbbell size={40} color="#0ea5e9" style={{ marginRight: '1rem' }} />
            <h1
              className="gradient-text"
              data-testid="workout-title"
              style={{ fontSize: '2.5rem', fontWeight: '700' }}
            >
              {t('workoutPlan')}
            </h1>
          </div>

          {!plan ? (
            <div data-testid="workout-form">
              <div style={{ marginBottom: '1.5rem' }}>
                <Label>{t('workoutLocation')}</Label>
                <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                  <SelectTrigger data-testid="location-select" style={{ marginTop: '0.5rem' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gym">{t('gym')}</SelectItem>
                    <SelectItem value="home">{t('home')}</SelectItem>
                    <SelectItem value="minimal">{t('minimal')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <Label>{t('days')} ({formData.days_per_week})</Label>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={formData.days_per_week}
                  onChange={(e) => setFormData({ ...formData, days_per_week: parseInt(e.target.value) })}
                  data-testid="days-slider"
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    accentColor: '#0ea5e9'
                  }}
                />
              </div>

              <Button
                onClick={handleGenerate}
                data-testid="generate-plan-btn"
                className="btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? t('generating') : t('generatePlan')}
              </Button>
            </div>
          ) : (
            <div data-testid="workout-result" className="fade-in">
              <div style={{ padding: '2rem', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '16px', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1.5rem', color: '#0ea5e9' }}>
                  {plan.plan_name}
                </h3>
                <div style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                  <p><strong style={{ color: '#e2e8f0' }}>Location:</strong> {plan.location}</p>
                  <p><strong style={{ color: '#e2e8f0' }}>Days per week:</strong> {plan.days_per_week}</p>
                </div>

                {plan.exercises && plan.exercises.length > 0 && (
                  <div style={{ marginTop: '2rem' }}>
                    {plan.exercises.map((day, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '1.5rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '12px',
                          marginBottom: '1rem'
                        }}
                      >
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0ea5e9', marginBottom: '1rem' }}>
                          Day {day.day} - {day.muscle_group}
                        </h4>
                        {day.exercises && day.exercises.map((ex, exIdx) => (
                          <div key={exIdx} style={{ marginBottom: '0.75rem', paddingLeft: '1rem' }}>
                            <p style={{ color: '#e2e8f0' }}>
                              <strong>{ex.name}</strong> - {ex.sets} sets × {ex.reps} reps
                            </p>
                            {ex.notes && (
                              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>{ex.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setPlan(null)}
                data-testid="new-plan-btn"
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

export default WorkoutPlan;