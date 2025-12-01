import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { ArrowLeft, Trophy, Target, Award } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Challenges = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const [challengesRes, coinsRes] = await Promise.all([
        axios.get(`${API}/challenges`),
        axios.get(`${API}/gym-coins`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setChallenges(challengesRes.data);
      setCoins(coinsRes.data.balance || 0);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinChallenge = async (challengeId) => {
    try {
      const token = localStorage.getItem('session_token');
      await axios.post(
        `${API}/challenges/${challengeId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Joined challenge!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to join');
    }
  };

  const getDifficultyColor = (difficulty) => {
    return difficulty === 'easy' ? '#10b981' : difficulty === 'medium' ? '#f59e0b' : '#ef4444';
  };

  if (loading) {
    return <div className="loading-screen"><div className="loader"></div></div>;
  }

  return (
    <div className="page-wrapper" data-testid="challenges-page">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">Taif Fit AI</div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '12px' }}>
              <Award size={20} color="#f59e0b" style={{ marginRight: '0.5rem' }} />
              <span data-testid="coins-balance" style={{ color: '#f59e0b', fontWeight: '600' }}>{coins} Coins</span>
            </div>
            <Button onClick={() => navigate('/dashboard')} variant="ghost" data-testid="back-btn">
              <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} />
              Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <Trophy size={40} color="#0ea5e9" style={{ marginRight: '1rem' }} />
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '700' }}>Challenges</h1>
          </div>

          {challenges.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
              <Target size={60} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>No challenges available yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
              {challenges.map((challenge, idx) => (
                <div
                  key={idx}
                  className="glass-card fade-in"
                  data-testid={`challenge-card-${idx}`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#e2e8f0' }}>{challenge.name}</h3>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        backgroundColor: `${getDifficultyColor(challenge.difficulty)}20`,
                        color: getDifficultyColor(challenge.difficulty)
                      }}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>

                  <p style={{ color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.6' }}>{challenge.description}</p>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                    <span>Type: {challenge.type}</span>
                    <span>•</span>
                    <span style={{ color: '#f59e0b', fontWeight: '600' }}>+{challenge.reward_coins} coins</span>
                  </div>

                  <Button
                    onClick={() => joinChallenge(challenge.id)}
                    data-testid={`join-challenge-btn-${idx}`}
                    className="btn-primary"
                    style={{ width: '100%' }}
                  >
                    Join Challenge
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Challenges;