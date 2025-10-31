import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BodyAnalysis = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    goal: 'lose_weight',
    image_base64: null
  });
  const [result, setResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_base64: reader.result.split(',')[1] });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('session_token');
      const response = await axios.post(
        `${API}/body-analyses`,
        {
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          age: parseInt(formData.age),
          gender: formData.gender,
          goal: formData.goal,
          image_base64: formData.image_base64
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setResult(response.data);
      toast.success('Analysis completed!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.response?.data?.detail || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" data-testid="body-analysis-page">
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
        <div className="glass-card fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1
            className="gradient-text"
            data-testid="analysis-title"
            style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem' }}
          >
            {t('analyzeBody')}
          </h1>

          {!result ? (
            <form onSubmit={handleSubmit} data-testid="analysis-form">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <Label htmlFor="weight">{t('weight')}</Label>
                  <Input
                    id="weight"
                    data-testid="weight-input"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
                <div>
                  <Label htmlFor="height">{t('height')}</Label>
                  <Input
                    id="height"
                    data-testid="height-input"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    required
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
                <div>
                  <Label htmlFor="age">{t('age')}</Label>
                  <Input
                    id="age"
                    data-testid="age-input"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <Label>{t('gender')}</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger data-testid="gender-select" style={{ marginTop: '0.5rem' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t('male')}</SelectItem>
                      <SelectItem value="female">{t('female')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('goal')}</Label>
                  <Select value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                    <SelectTrigger data-testid="goal-select" style={{ marginTop: '0.5rem' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose_weight">{t('loseWeight')}</SelectItem>
                      <SelectItem value="build_muscle">{t('buildMuscle')}</SelectItem>
                      <SelectItem value="maintain">{t('maintain')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <Label htmlFor="photo">{t('uploadPhoto')} (Optional)</Label>
                <div style={{ marginTop: '0.5rem' }}>
                  <Input
                    id="photo"
                    data-testid="photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById('photo').click()}
                    className="btn-secondary"
                    data-testid="upload-photo-btn"
                  >
                    <Upload size={18} style={{ marginRight: '0.5rem' }} />
                    {t('uploadPhoto')}
                  </Button>
                  {formData.image_base64 && (
                    <span style={{ marginLeft: '1rem', color: '#10b981' }}>✓ Image uploaded</span>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                data-testid="analyze-btn"
                className="btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? t('analyzing') : t('analyze')}
              </Button>
            </form>
          ) : (
            <div data-testid="analysis-result" className="fade-in">
              <div style={{ padding: '2rem', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '16px', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#0ea5e9' }}>Analysis Results</h3>
                {result.body_type && (
                  <p style={{ marginBottom: '0.5rem', color: '#e2e8f0' }}>
                    <strong>Body Type:</strong> {result.body_type}
                  </p>
                )}
                {result.body_fat_percentage && (
                  <p style={{ marginBottom: '0.5rem', color: '#e2e8f0' }}>
                    <strong>Body Fat:</strong> {result.body_fat_percentage}%
                  </p>
                )}
                {result.analysis_data?.recommendations && (
                  <div style={{ marginTop: '1rem' }}>
                    <strong style={{ color: '#e2e8f0' }}>Recommendations:</strong>
                    <p style={{ color: '#94a3b8', marginTop: '0.5rem', lineHeight: '1.6' }}>
                      {result.analysis_data.recommendations}
                    </p>
                  </div>
                )}
              </div>
              <Button
                onClick={() => setResult(null)}
                data-testid="new-analysis-btn"
                className="btn-secondary"
                style={{ width: '100%' }}
              >
                New Analysis
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BodyAnalysis;