import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Leaderboard = ({ user }) => {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API}/leaderboard?limit=20`);
      setLeaders(response.data);
    } catch (error) {
      console.error('Fetch leaderboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    if (rank === 0) return <Trophy size={28} color="#f59e0b" />;
    if (rank === 1) return <Medal size={24} color="#94a3b8" />;
    if (rank === 2) return <Award size={24} color="#cd7f32" />;
    return <span style={{ fontSize: '1.2rem', fontWeight: '600', color: '#64748b' }}>#{rank + 1}</span>;
  };

  const getRankColor = (rank) => {
    if (rank === 0) return 'linear-gradient(135deg, #f59e0b, #d97706)';
    if (rank === 1) return 'linear-gradient(135deg, #94a3b8, #64748b)';
    if (rank === 2) return 'linear-gradient(135deg, #cd7f32, #a0522d)';
    return 'rgba(255, 255, 255, 0.03)';
  };

  if (loading) {
    return <div className="loading-screen"><div className="loader"></div></div>;
  }

  return (
    <div className="page-wrapper" data-testid="leaderboard-page">
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
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <Trophy size={40} color="#f59e0b" style={{ marginRight: '1rem' }} />
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '700' }}>Leaderboard</h1>
          </div>

          {leaders.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
              <Trophy size={60} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>No leaderboard data yet. Start earning coins!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leaders.map((leader, idx) => (
                <div
                  key={idx}
                  className="glass-card fade-in"
                  data-testid={`leader-${idx}`}
                  style={{
                    background: getRankColor(idx),
                    border: idx < 3 ? '2px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                    animationDelay: `${idx * 0.05}s`,
                    transition: 'transform 0.3s',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ width: '50px', textAlign: 'center' }}>
                        {getMedalIcon(idx)}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {leader.user_picture ? (
                          <img
                            src={leader.user_picture}
                            alt={leader.user_name}
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid rgba(14, 165, 233, 0.3)'
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '1.2rem'
                            }}
                          >
                            {leader.user_name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        
                        <div>
                          <p style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '1.1rem' }}>
                            {leader.user_name || 'User'}
                          </p>
                          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                            Total Earned: {leader.total_earned || 0} coins
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Award size={20} color="#f59e0b" />
                        <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '1.5rem' }}>
                          {leader.balance}
                        </span>
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Coins</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;