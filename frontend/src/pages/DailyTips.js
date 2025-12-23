import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Lightbulb, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DailyTips = ({ user }) => {
  const navigate = useNavigate();
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDailyTip();
    fetchStats();
  }, []);

  const fetchDailyTip = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('session_token');
      const response = await axios.get(`${API}/daily-tip`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTip(response.data);
    } catch (error) {
      console.error('Fetch daily tip error:', error);
      toast.error('Failed to load daily tip');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await axios.get(`${API}/user-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const refreshTip = () => {
    fetchDailyTip();
  };

  const statCards = stats ? [
    { label: 'Body Analyses', value: stats.body_analyses, icon: '📊', color: '#0ea5e9' },
    { label: 'Workout Plans', value: stats.workout_plans, icon: '💪', color: '#10b981' },
    { label: 'Nutrition Plans', value: stats.nutrition_plans, icon: '🍽️', color: '#f59e0b' },
    { label: 'Progress Logs', value: stats.progress_logs, icon: '📈', color: '#8b5cf6' },
    { label: 'Community Posts', value: stats.posts, icon: '📝', color: '#ec4899' },
    { label: 'Gym Coins', value: stats.coins, icon: '🪙', color: '#f59e0b' },
    { label: 'Badges Earned', value: stats.badges, icon: '🏆', color: '#eab308' },
    { label: 'Active Challenges', value: stats.active_challenges, icon: '🎯', color: '#06b6d4' }
  ] : [];

  return (
    <div className="page-wrapper" data-testid="daily-tips-page">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">Taif Fit AI</div>
          <Button onClick={() => navigate('/dashboard')} variant="ghost" data-testid="back-btn">
            <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} />
            Dashboard
          </Button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Daily Tip Section */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Lightbulb size={40} color="#f59e0b" style={{ marginRight: '1rem' }} />
                <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '700' }}>Daily Tip</h1>
              </div>
              <Button
                onClick={refreshTip}
                data-testid="refresh-tip-btn"
                className="btn-secondary"
                disabled={loading}
              >
                <RefreshCw size={18} style={{ marginRight: '0.5rem' }} />
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div className="loader" style={{ margin: '0 auto' }}></div>
              </div>
            ) : tip ? (
              <div
                className="glass-card fade-in"
                data-testid="daily-tip"
                style={{
                  padding: '2.5rem',
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(6, 182, 212, 0.05))',
                  border: '2px solid rgba(14, 165, 233, 0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start', gap: '1rem', marginBottom: '1.5rem' }}>
                  <Sparkles size={32} color="#0ea5e9" />
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#0ea5e9', marginBottom: '0.5rem' }}>
                      Tip of the Day
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{tip.date}</p>
                  </div>
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '1.8' }}>
                  {tip.tip}
                </p>
              </div>
            ) : null}
          </div>

          {/* Quick Stats */}
          {stats && (
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '2rem' }}>
                Your Stats
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {statCards.map((stat, idx) => (
                  <div
                    key={idx}
                    className="glass-card fade-in"
                    data-testid={`stat-card-${idx}`}
                    style={{
                      textAlign: 'center',
                      padding: '2rem 1.5rem',
                      transition: 'transform 0.3s',
                      animationDelay: `${idx * 0.05}s`
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                      {stat.label}
                    </p>
                    <p style={{ color: stat.color, fontSize: '2.5rem', fontWeight: '700' }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyTips;