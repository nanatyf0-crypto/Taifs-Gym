import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { User, Target, Activity } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Setup = ({ user, onComplete }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    goal: 'maintain',
    fitness_level: 'beginner'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('session_token');
      
      await axios.put(
        `${API}/user/profile`,
        {
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          age: parseInt(formData.age),
          gender: formData.gender,
          goal: formData.goal,
          fitness_level: formData.fitness_level
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Profile setup complete!');
      if (onComplete) onComplete();
      navigate('/dashboard');
    } catch (error) {
      console.error('Setup error:', error);
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" data-testid="setup-page">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="glass-card" style={{ maxWidth: '700px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Activity size={60} color="#0ea5e9" style={{ margin: '0 auto 1rem' }} />
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              أكمل ملفك الشخصي
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
              أدخل معلوماتك لنساعدك في إنشاء خطط مخصصة
            </p>
          </div>

          <form onSubmit={handleSubmit} data-testid="setup-form">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <Label htmlFor="weight">الوزن (كجم) *</Label>
                <Input
                  id="weight"
                  data-testid="weight-input"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  required
                  className="input-field"
                  style={{ marginTop: '0.5rem' }}
                  placeholder="70"
                />
              </div>

              <div>
                <Label htmlFor="height">الطول (سم) *</Label>
                <Input
                  id="height"
                  data-testid="height-input"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  required
                  className="input-field"
                  style={{ marginTop: '0.5rem' }}
                  placeholder="175"
                />
              </div>

              <div>
                <Label htmlFor="age">العمر *</Label>
                <Input
                  id="age"
                  data-testid="age-input"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                  className="input-field"
                  style={{ marginTop: '0.5rem' }}
                  placeholder="25"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <Label>الجنس *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger data-testid="gender-select" style={{ marginTop: '0.5rem' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>الهدف *</Label>
                <Select value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                  <SelectTrigger data-testid="goal-select" style={{ marginTop: '0.5rem' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">خسارة الوزن</SelectItem>
                    <SelectItem value="build_muscle">بناء العضلات</SelectItem>
                    <SelectItem value="maintain">المحافظة على اللياقة</SelectItem>
                    <SelectItem value="increase_strength">زيادة القوة</SelectItem>
                    <SelectItem value="improve_endurance">تحسين التحمل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>مستوى اللياقة *</Label>
                <Select value={formData.fitness_level} onValueChange={(value) => setFormData({ ...formData, fitness_level: value })}>
                  <SelectTrigger data-testid="fitness-level-select" style={{ marginTop: '0.5rem' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">مبتدئ</SelectItem>
                    <SelectItem value="intermediate">متوسط</SelectItem>
                    <SelectItem value="advanced">متقدم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div style={{ background: 'rgba(14, 165, 233, 0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                💡 <strong style={{ color: '#0ea5e9' }}>لماذا نحتاج هذه المعلومات؟</strong><br/>
                سنستخدم هذه البيانات تلقائياً لإنشاء خطط تمرين وتغذية مخصصة لك. لن تحتاج لإدخالها مرة أخرى!
              </p>
            </div>

            <Button
              type="submit"
              data-testid="setup-submit-btn"
              className="btn-primary"
              style={{ width: '100%', fontSize: '1.1rem', padding: '16px' }}
              disabled={loading}
            >
              {loading ? 'جاري الحفظ...' : 'ابدأ رحلتك الآن'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setup;