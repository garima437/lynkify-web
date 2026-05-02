
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

const cardStyle = { background: '#111111', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '20px' };
const btnGreen = { padding: '10px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' };
const btnOutline = { padding: '8px 14px', background: 'transparent', color: '#d1d5db', border: '1px solid #2a2a2a', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' };
const btnRed = { padding: '8px 14px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' };
const inputStyle = { width: '100%', padding: '11px 14px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };

const Dashboard = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showQR, setShowQR] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ originalUrl: '', customAlias: '', expiryDays: '' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { fetchUrls(); }, []);

  const fetchUrls = async () => {
    try {
      const res = await API.get('/api/urls');
      setUrls(res.data);
    } catch (err) {
      toast.error('Failed to load URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = { originalUrl: form.originalUrl, customAlias: form.customAlias || null, expiryDays: form.expiryDays ? parseInt(form.expiryDays) : null };
      const res = await API.post('/api/urls', payload);
      setUrls([res.data, ...urls]);
      setForm({ originalUrl: '', customAlias: '', expiryDays: '' });
      setShowModal(false);
      toast.success('URL shortened!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create URL');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this URL?')) return;
    try {
      await API.delete(`/api/urls/${id}`);
      setUrls(urls.filter(u => u.id !== id));
      toast.success('Deleted!');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied!');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <div style={{ background: '#111111', borderBottom: '1px solid #1f1f1f', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: '#22c55e', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔗</div>
          <span style={{ color: 'white', fontWeight: '800', fontSize: '18px' }}>URL Shortener</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>👋 {user.name}</span>
          <button onClick={handleLogout} style={{ ...btnOutline }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total URLs', value: urls.length, icon: '🔗' },
            { label: 'Total Clicks', value: urls.reduce((s, u) => s + (u.clickCount || 0), 0), icon: '👆' },
            { label: 'Active Links', value: urls.filter(u => !u.expiresAt || new Date(u.expiresAt) > new Date()).length, icon: '✅' },
          ].map((stat) => (
            <div key={stat.label} style={cardStyle}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ color: '#22c55e', fontSize: '32px', fontWeight: '800' }}>{stat.value}</div>
              <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800' }}>My URLs</h2>
          <button onClick={() => setShowModal(true)} style={btnGreen}>+ Shorten URL</button>
        </div>

        {/* URL List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading...</div>
        ) : urls.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔗</div>
            <p>No URLs yet. Create your first short link!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {urls.map((url) => (
              <div key={url.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#22c55e', fontWeight: '700', fontSize: '15px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url.shortUrl}</p>
                    <p style={{ color: '#6b7280', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url.originalUrl}</p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>👆 {url.clickCount} clicks</span>
                      {url.expiresAt && <span style={{ color: '#6b7280', fontSize: '12px' }}>⏰ {new Date(url.expiresAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => handleCopy(url.shortUrl)} style={btnOutline}>📋 Copy</button>
                    <button onClick={() => setShowQR(showQR === url.id ? null : url.id)} style={btnOutline}>📱 QR</button>
                    <button onClick={() => navigate(`/analytics/${url.id}`)} style={btnOutline}>📊 Analytics</button>
                    <button onClick={() => handleDelete(url.id)} style={btnRed}>🗑️</button>
                  </div>
                </div>
                {showQR === url.id && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', padding: '16px', background: 'white', borderRadius: '12px' }}>
                    <QRCodeSVG value={url.shortUrl} size={150} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ background: '#111111', border: '1px solid #1f1f1f', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '460px' }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>🔗 Shorten a URL</h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#d1d5db', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Original URL *</label>
                <input type="url" placeholder="https://example.com/very-long-url" value={form.originalUrl} onChange={(e) => setForm({ ...form, originalUrl: e.target.value })} required style={inputStyle} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#d1d5db', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Custom Alias (optional)</label>
                <input type="text" placeholder="e.g. my-link" value={form.customAlias} onChange={(e) => setForm({ ...form, customAlias: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: '#d1d5db', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Expiry Days (optional)</label>
                <input type="number" placeholder="e.g. 30" value={form.expiryDays} onChange={(e) => setForm({ ...form, expiryDays: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ ...btnOutline, flex: 1, padding: '12px' }}>Cancel</button>
                <button type="submit" disabled={creating} style={{ ...btnGreen, flex: 1, padding: '12px' }}>{creating ? 'Creating...' : 'Shorten URL'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;