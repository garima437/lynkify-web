
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';

const labelStyle = { color: '#d1d5db', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' };
const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '16px' };
const inputStyle = { width: '100%', padding: '12px 12px 12px 44px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '13px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' };
const socialBtn = { flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid #2a2a2a', background: '#1a1a1a', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' };

const AuthPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/api/auth/login', loginForm);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ name: res.data.name, email: res.data.email }));
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/api/auth/register', registerForm);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ name: res.data.name, email: res.data.email }));
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '64px', height: '64px', background: '#22c55e', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px' }}>🔗</div>
        <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>URL Shortener</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Shorten links. Track clicks. Grow your brand.</p>
      </div>

      <div style={{ background: '#111111', border: '1px solid #1f1f1f', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px' }}>
        <div style={{ display: 'flex', background: '#1a1a1a', borderRadius: '12px', padding: '4px', marginBottom: '28px' }}>
          <button onClick={() => setTab('login')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', background: tab === 'login' ? '#22c55e' : 'transparent', color: tab === 'login' ? 'white' : '#6b7280' }}>Login</button>
          <button onClick={() => setTab('register')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', background: tab === 'register' ? '#22c55e' : 'transparent', color: tab === 'register' ? 'white' : '#6b7280' }}>Register</button>
        </div>

        {tab === 'login' && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle}>✉️</span>
                <input type="email" placeholder="you@example.com" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle}>🔒</span>
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required style={inputStyle} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '16px' }}>{showPassword ? '🙈' : '👁️'}</button>
              </div>
            </div>
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <span style={{ color: '#22c55e', fontSize: '13px', cursor: 'pointer' }}>Forgot password?</span>
            </div>
            <button type="submit" disabled={loading} style={btnStyle}>{loading ? 'Signing in...' : 'Sign In →'}</button>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle}>👤</span>
                <input type="text" placeholder="John Doe" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} required style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle}>✉️</span>
                <input type="email" placeholder="you@example.com" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle}>🔒</span>
                <input type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required style={inputStyle} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '16px' }}>{showPassword ? '🙈' : '👁️'}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={btnStyle}>{loading ? 'Creating...' : 'Create Account →'}</button>
          </form>
        )}

        <div style={{ textAlign: 'center', margin: '24px 0', color: '#4b5563', fontSize: '13px' }}>or connect with</div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="https://www.linkedin.com/in/garima-yadav-537990272" target="_blank" rel="noopener noreferrer" style={socialBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
          <a href="https://github.com/Garima437" target="_blank" rel="noopener noreferrer" style={socialBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #1f1f1f' }}>
          {['Free Forever', 'Analytics', 'Custom Links'].map((f) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '12px' }}>
              <span style={{ color: '#22c55e' }}>✓</span> {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;