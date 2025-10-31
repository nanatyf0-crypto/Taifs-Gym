import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, TrendingUp, Plus } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Progress = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    body_fat: '',
    notes: ''
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await axios.get(`${API}/progress-logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Fetch logs error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('session_token');
      await axios.post(
        `${API}/progress-logs`,
        {
          weight: parseFloat(formData.weight),
          body_fat: formData.body_fat ? parseFloat(formData.body_fat) : null,
          notes: formData.notes || null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Progress logged!');
      setFormData({ weight: '', body_fat: '', notes: '' });
      setShowForm(false);
      fetchLogs();
    } catch (error) {
      console.error('Log error:', error);
      toast.error(error.response?.data?.detail || 'Failed to log progress');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" data-testid="progress-page">
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp size={40} color="#0ea5e9" style={{ marginRight: '1rem' }} />
              <h1
                className="gradient-text"
                data-testid="progress-title"
                style={{ fontSize: '2.5rem', fontWeight: '700' }}
              >
                {t('progress')}
              </h1>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              data-testid="add-log-btn"
              className="btn-primary"
            >
              <Plus size={18} style={{ marginRight: '0.5rem' }} />
              {t('logProgress')}
            </Button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} data-testid="progress-form" className="fade-in" style={{ padding: '2rem', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '16px', marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <Label htmlFor="weight">{t('currentWeight')} (kg)</Label>
                  <Input
                    id="weight"
                    data-testid="progress-weight-input"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
                <div>
                  <Label htmlFor="body_fat">{t('bodyFat')} (Optional)</Label>
                  <Input
                    id="body_fat"
                    data-testid="progress-bodyfat-input"
                    type="number"
                    step="0.1"
                    value={formData.body_fat}
                    onChange={(e) => setFormData({ ...formData, body_fat: e.target.value })}
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <Label htmlFor="notes">{t('notes')}</Label>
                <Textarea
                  id="notes"
                  data-testid="progress-notes-input"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  style={{ marginTop: '0.5rem', minHeight: '100px' }}
                  placeholder="How are you feeling? Any challenges?"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button
                  type="submit"
                  data-testid="save-progress-btn"
                  className="btn-primary"
                  style={{ flex: 1 }}
                  disabled={loading}
                >
                  {t('save')}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  data-testid="cancel-progress-btn"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  {t('cancel')}
                </Button>
              </div>
            </form>
          )}

          <div data-testid="progress-logs">
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '1.5rem' }}>
              {t('viewHistory')}
            </h3>
            {logs.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '3rem' }}>No progress logs yet. Start tracking!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {logs.map((log, idx) => (
                  <div
                    key={idx}
                    data-testid={`progress-log-${idx}`}
                    style={{
                      padding: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '12px',
                      borderLeft: '4px solid #0ea5e9'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        {new Date(log.logged_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '0.5rem' }}>
                      <p style={{ color: '#e2e8f0' }}>
                        <strong style={{ color: '#0ea5e9' }}>Weight:</strong> {log.weight} kg
                      </p>
                      {log.body_fat && (
                        <p style={{ color: '#e2e8f0' }}>
                          <strong style={{ color: '#0ea5e9' }}>Body Fat:</strong> {log.body_fat}%
                        </p>
                      )}
                    </div>
                    {log.notes && (
                      <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.75rem', fontStyle: 'italic' }}>
                        {log.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;