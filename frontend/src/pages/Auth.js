import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Auth = ({ setUser }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', name: '' });

  useEffect(() => {
    // Check for session_id in URL hash
    const hash = window.location.hash;
    if (hash.includes('session_id=')) {
      const sessionId = hash.split('session_id=')[1].split('&')[0];
      handleGoogleCallback(sessionId);
      // Clean URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleGoogleCallback = async (sessionId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/auth/session`, {
        headers: { 'X-Session-ID': sessionId }
      });
      
      localStorage.setItem('session_token', response.data.session_token);
      setUser(response.data.user);
      toast.success(t('success'));
      navigate('/dashboard');
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API}/auth/login`, loginData);
      localStorage.setItem('session_token', response.data.session_token);
      setUser(response.data.user);
      toast.success(t('success'));
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API}/auth/register`, registerData);
      localStorage.setItem('session_token', response.data.session_token);
      setUser(response.data.user);
      toast.success(t('success'));
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const redirectUrl = `${window.location.origin}/auth`;
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  if (loading) {
    return (
      <div className="loading-screen" data-testid="auth-loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" data-testid="auth-page">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="glass-card" style={{ maxWidth: '480px', width: '100%' }}>
          <h1
            className="gradient-text"
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '2rem'
            }}
          >
            Taif Fit AI
          </h1>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="login-tab">{t('signIn')}</TabsTrigger>
              <TabsTrigger value="register" data-testid="register-tab">{t('signUp')}</TabsTrigger>
            </TabsList>

            <TabsContent value="login" data-testid="login-form">
              <form onSubmit={handleLogin} style={{ marginTop: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <Label htmlFor="login-email">{t('email')}</Label>
                  <Input
                    id="login-email"
                    data-testid="login-email-input"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <Label htmlFor="login-password">{t('password')}</Label>
                  <Input
                    id="login-password"
                    data-testid="login-password-input"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
                <Button
                  type="submit"
                  data-testid="login-submit-btn"
                  className="btn-primary"
                  style={{ width: '100%', marginBottom: '1rem' }}
                  disabled={loading}
                >
                  {t('signIn')}
                </Button>
              </form>

              <div style={{ margin: '1.5rem 0', textAlign: 'center', color: '#94a3b8' }}>
                {t('orContinueWith')}
              </div>

              <Button
                onClick={handleGoogleLogin}
                data-testid="google-login-btn"
                className="btn-secondary"
                style={{ width: '100%' }}
              >
                {t('signInWithGoogle')}
              </Button>
            </TabsContent>

            <TabsContent value="register" data-testid="register-form">
              <form onSubmit={handleRegister} style={{ marginTop: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <Label htmlFor="register-name">{t('name')}</Label>
                  <Input
                    id="register-name"
                    data-testid="register-name-input"
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <Label htmlFor="register-email">{t('email')}</Label>
                  <Input
                    id="register-email"
                    data-testid="register-email-input"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <Label htmlFor="register-password">{t('password')}</Label>
                  <Input
                    id="register-password"
                    data-testid="register-password-input"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    className="input-field"
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
                <Button
                  type="submit"
                  data-testid="register-submit-btn"
                  className="btn-primary"
                  style={{ width: '100%', marginBottom: '1rem' }}
                  disabled={loading}
                >
                  {t('signUp')}
                </Button>
              </form>

              <div style={{ margin: '1.5rem 0', textAlign: 'center', color: '#94a3b8' }}>
                {t('orContinueWith')}
              </div>

              <Button
                onClick={handleGoogleLogin}
                data-testid="google-register-btn"
                className="btn-secondary"
                style={{ width: '100%' }}
              >
                {t('signInWithGoogle')}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;