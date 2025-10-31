import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Activity, Target, Utensils, TrendingUp, LogOut } from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const cards = [
    {
      icon: Activity,
      title: t('bodyAnalysis'),
      desc: 'AI-powered body scanning',
      path: '/body-analysis',
      testId: 'body-analysis-card'
    },
    {
      icon: Target,
      title: t('workoutPlan'),
      desc: 'Personalized training programs',
      path: '/workout-plan',
      testId: 'workout-plan-card'
    },
    {
      icon: Utensils,
      title: t('nutritionPlan'),
      desc: 'Custom meal planning',
      path: '/nutrition-plan',
      testId: 'nutrition-plan-card'
    },
    {
      icon: TrendingUp,
      title: t('progress'),
      desc: 'Track your journey',
      path: '/progress',
      testId: 'progress-card'
    }
  ];

  return (
    <div className="page-wrapper" data-testid="dashboard-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">Taif Fit AI</div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span data-testid="user-name" style={{ color: '#94a3b8' }}>{user.name}</span>
            <Button
              onClick={onLogout}
              data-testid="logout-btn"
              variant="ghost"
              size="sm"
              style={{ color: '#ef4444' }}
            >
              <LogOut size={18} style={{ marginRight: '0.5rem' }} />
              {t('logout')}
            </Button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="fade-in">
          <h1
            data-testid="dashboard-title"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '700',
              marginBottom: '0.5rem',
              color: '#e2e8f0'
            }}
          >
            {t('dashboard')}
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: '#94a3b8',
              marginBottom: '3rem'
            }}
          >
            Welcome back, {user.name}!
          </p>

          <div
            data-testid="dashboard-cards"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}
          >
            {cards.map((card, idx) => (
              <div
                key={idx}
                className="glass-card fade-in"
                data-testid={card.testId}
                onClick={() => navigate(card.path)}
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  animationDelay: `${idx * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(14, 165, 233, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    background: 'rgba(14, 165, 233, 0.1)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  <card.icon size={28} color="#0ea5e9" />
                </div>
                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#e2e8f0'
                  }}
                >
                  {card.title}
                </h3>
                <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;