import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { ArrowLeft, User, Camera, Save } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Profile = ({ user: initialUser, onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [formData, setFormData] = useState({
    name: initialUser.name || '',
    picture: initialUser.picture || '',
    weight: initialUser.weight || '',
    height: initialUser.height || '',
    age: initialUser.age || '',
    gender: initialUser.gender || 'male',
    goal: initialUser.goal || 'maintain',
    fitness_level: initialUser.fitness_level || 'beginner',
    dietary_preferences: initialUser.dietary_preferences || [],
    language_preference: initialUser.language_preference || 'ar'
  });

  const dietaryOptions = [
    { value: 'vegan', label: 'نباتي' },
    { value: 'vegetarian', label: 'نباتي (يتناول منتجات الألبان)' },
    { value: 'low_carb', label: 'قليل الكربوهيدرات' },
    { value: 'high_protein', label: 'عالي البروتين' },
    { value: 'keto', label: 'كيتو' },
    { value: 'halal', label: 'حلال' },
    { value: 'gluten_free', label: 'خالي من الغلوتين' },
    { value: 'dairy_free', label: 'خالي من الألبان' }
  ];

  const toggleDietaryPreference = (value) => {
    setFormData(prev => {
      const current = prev.dietary_preferences || [];
      if (current.includes(value)) {
        return { ...prev, dietary_preferences: current.filter(v => v !== value) };
      } else {
        return { ...prev, dietary_preferences: [...current, value] };
      }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, picture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('session_token');
      
      const updateData = {
        name: formData.name,
        picture: formData.picture,
        language_preference: formData.language_preference
      };

      if (formData.weight) updateData.weight = parseFloat(formData.weight);
      if (formData.height) updateData.height = parseFloat(formData.height);
      if (formData.age) updateData.age = parseInt(formData.age);
      if (formData.gender) updateData.gender = formData.gender;
      if (formData.goal) updateData.goal = formData.goal;
      if (formData.fitness_level) updateData.fitness_level = formData.fitness_level;
      if (formData.dietary_preferences) updateData.dietary_preferences = formData.dietary_preferences;
      
      const response = await axios.put(
        `${API}/user/profile`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUser(response.data);
      toast.success('تم حفظ التغييرات بنجاح!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('فشل حفظ التغييرات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" data-testid="profile-page">
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
            <User size={40} color="#0ea5e9" style={{ marginRight: '1rem' }} />
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '700' }}>الملف الشخصي</h1>
          </div>

          <form onSubmit={handleSubmit} data-testid="profile-form">
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '1.5rem' }}>
                المعلومات الأساسية
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative' }}>
                  {formData.picture ? (
                    <img
                      src={formData.picture}
                      alt="Profile"
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '4px solid rgba(14, 165, 233, 0.3)'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        color: 'white',
                        fontWeight: '700'
                      }}
                    >
                      {formData.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="profile-picture"
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById('profile-picture').click()}
                    className="btn-secondary"
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Camera size={20} />
                  </Button>
                </div>

                <div style={{ flex: 1 }}>
                  <Label htmlFor="name">الاسم</Label>
                  <Input
                    id="name"
                    data-testid="name-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
              </div>

              <div>
                <Label>اللغة المفضلة</Label>
                <Select value={formData.language_preference} onValueChange={(value) => setFormData({ ...formData, language_preference: value })}>
                  <SelectTrigger data-testid="language-select" style={{ marginTop: '0.5rem' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="glass-card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '1.5rem' }}>
                البيانات الصحية
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <Label htmlFor="weight">الوزن (كجم)</Label>
                  <Input
                    id="weight"
                    data-testid="weight-input"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>

                <div>
                  <Label htmlFor="height">الطول (سم)</Label>
                  <Input
                    id="height"
                    data-testid="height-input"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>

                <div>
                  <Label htmlFor="age">العمر</Label>
                  <Input
                    id="age"
                    data-testid="age-input"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <Label>الجنس</Label>
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
                  <Label>الهدف</Label>
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
                  <Label>مستوى اللياقة</Label>
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
            </div>

            <div className="glass-card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '1.5rem' }}>
                التفضيلات الغذائية
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {dietaryOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => toggleDietaryPreference(option.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: formData.dietary_preferences?.includes(option.value) ? 'rgba(14, 165, 233, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: formData.dietary_preferences?.includes(option.value) ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Checkbox
                      checked={formData.dietary_preferences?.includes(option.value)}
                      onCheckedChange={() => toggleDietaryPreference(option.value)}
                    />
                    <span style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>{option.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              data-testid="save-profile-btn"
              className="btn-primary"
              style={{ width: '100%', fontSize: '1.1rem', padding: '16px' }}
              disabled={loading}
            >
              <Save size={20} style={{ marginRight: '0.5rem' }} />
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;