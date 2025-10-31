import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Activity, Target, Utensils, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';

const Landing = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  const features = [
    {
      icon: Activity,
      title: t('feature1Title'),
      desc: t('feature1Desc')
    },
    {
      icon: Target,
      title: t('feature2Title'),
      desc: t('feature2Desc')
    },
    {
      icon: Utensils,
      title: t('feature3Title'),
      desc: t('feature3Desc')
    },
    {
      icon: TrendingUp,
      title: t('feature4Title'),
      desc: t('feature4Desc')
    }
  ];

  return (
    <div className="page-wrapper" data-testid="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo" data-testid="logo">Taif Fit AI</div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button
              variant="ghost"
              onClick={toggleLanguage}
              data-testid="language-toggle-btn"
              style={{ color: '#e2e8f0' }}
            >
              {i18n.language === 'ar' ? 'EN' : 'العربية'}
            </Button>
            <Button
              onClick={() => navigate('/auth')}
              data-testid="login-btn"
              className="btn-secondary"
            >
              {t('login')}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container" style={{ paddingTop: '4rem' }}>
        <div className="fade-in" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <h1
            className="gradient-text"
            data-testid="hero-title"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}
          >
            {t('welcome')}
          </h1>
          <p
            data-testid="hero-tagline"
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
              color: '#94a3b8',
              marginBottom: '3rem',
              lineHeight: '1.6'
            }}
          >
            {t('tagline')}
          </p>
          <Button
            onClick={() => navigate('/auth')}
            data-testid="get-started-btn"
            className="btn-primary"
            style={{ fontSize: '18px', padding: '16px 48px' }}
          >
            {t('getStarted')}
          </Button>
        </div>

        {/* Features Grid */}
        <div
          data-testid="features-section"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginTop: '6rem',
            marginBottom: '4rem'
          }}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-card fade-in"
              data-testid={`feature-card-${idx}`}
              style={{
                textAlign: 'center',
                transition: 'transform 0.3s',
                cursor: 'default',
                animationDelay: `${idx * 0.1}s`
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 1.5rem',
                  background: 'rgba(14, 165, 233, 0.1)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <feature.icon size={32} color="#0ea5e9" />
              </div>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  color: '#e2e8f0'
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;