import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
const Analytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await API.get(`/api/urls/${id}/analytics`);
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const getChartData = () => {
    if (!data?.recentClicks) return [];
    const grouped = {};
    data.recentClicks.forEach(click => {
      const date = new Date(click.clickedAt).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return Object.entries(grouped).map(([date, clicks]) => ({ date, clicks }));
  };

  const getDeviceBreakdown = () => {
    if (!data?.recentClicks) return { mobile: 0, desktop: 0 };
    const mobile = data.recentClicks.filter(c => c.userAgent?.includes('Mobile')).length;
    return { mobile, desktop: data.recentClicks.length - mobile };
  };

  const s = {
    page: { minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Inter, sans-serif', color: 'white' },
    nav: { background: '#111', borderBottom: '1px solid #1f1f1f', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '12px' },
    backBtn: { background: 'transparent', border: '1px solid #2a2a2a', color: '#d1d5db', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
    card: { background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '24px', marginBottom: '20px' },
    statVal: { fontSize: '32px', fontWeight: '800', color: '#22c55e' },
    statLabel: { fontSize: '12px', color: '#6b7280', marginTop: '4px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: { textAlign: 'left', color: '#6b7280', padding: '8px 12px', borderBottom: '1px solid #1f1f1f', fontSize: '12px' },
    td: { padding: '10px 12px', borderBottom: '1px solid #1a1a1a', color: '#d1d5db' },
  };

  const devices = getDeviceBreakdown();
  const chartData = getChartData();

  if (loading) return (
    <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#22c55e', fontSize: '16px' }}>Loading analytics...</div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.nav}>
        <button style={s.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
        <span style={{ fontWeight: '700', fontSize: '16px' }}>📊 Analytics</span>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px' }}>

        {/* URL Info */}
        <div style={s.card}>
          <div style={{ color: '#22c55e', fontWeight: '700', fontSize: '16px', marginBottom: '6px' }}>{data?.shortCode}</div>
          <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px', wordBreak: 'break-all' }}>{data?.originalUrl}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div><div style={s.statVal}>{data?.totalClicks || 0}</div><div style={s.statLabel}>Total Clicks</div></div>
            <div><div style={{ ...s.statVal, color: '#f59e0b' }}>{data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : '-'}</div><div style={s.statLabel}>Created</div></div>
            <div><div style={{ ...s.statVal, color: data?.expiresAt ? '#ef4444' : '#22c55e' }}>{data?.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : 'Never'}</div><div style={s.statLabel}>Expires</div></div>
          </div>
        </div>

        {/* Device Breakdown */}
{/* Device Breakdown Pie Chart */}
<div style={s.card}>
  <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '20px' }}>
    Device Breakdown
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
    <ResponsiveContainer width="50%" height={200}>
      <PieChart>
        <Pie
          data={[
            { name: 'Desktop', value: devices.desktop },
            { name: 'Mobile', value: devices.mobile }
          ]}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          dataKey="value"
        >
          <Cell fill="#22c55e" />
          <Cell fill="#3b82f6" />
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            color: 'white'
          }}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: '#d1d5db', fontSize: '13px' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
    <div style={{ flex: 1 }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: '#6b7280', fontSize: '13px' }}>💻 Desktop</span>
          <span style={{ color: '#22c55e', fontWeight: '700' }}>{devices.desktop}</span>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '4px', height: '6px' }}>
          <div style={{
            width: `${data?.recentClicks?.length ? (devices.desktop / data.recentClicks.length) * 100 : 0}%`,
            background: '#22c55e', height: '6px', borderRadius: '4px'
          }} />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: '#6b7280', fontSize: '13px' }}>📱 Mobile</span>
          <span style={{ color: '#3b82f6', fontWeight: '700' }}>{devices.mobile}</span>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '4px', height: '6px' }}>
          <div style={{
            width: `${data?.recentClicks?.length ? (devices.mobile / data.recentClicks.length) * 100 : 0}%`,
            background: '#3b82f6', height: '6px', borderRadius: '4px'
          }} />
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Chart */}
        <div style={s.card}>
          <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '20px' }}>Clicks Over Time</div>
          {chartData.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>No click data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} />
               <YAxis
  tick={{ fill: '#6b7280', fontSize: 11 }}
  domain={[0, 'dataMax + 1']}
  allowDecimals={false}
/>
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: 'white' }} />
                <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill="#22c55e" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Clicks Table */}
        <div style={s.card}>
          <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '20px' }}>Recent Clicks</div>
          {!data?.recentClicks?.length ? (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '32px' }}>No clicks yet</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Time</th>
                    <th style={s.th}>IP Address</th>
                    <th style={s.th}>Device</th>
                    <th style={s.th}>Browser</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentClicks.map((click, i) => {
                    const ua = click.userAgent || '';
                    const isMobile = ua.includes('Mobile');
                    const browser = ua.includes('Chrome') ? '🌐 Chrome' : ua.includes('Firefox') ? '🦊 Firefox' : ua.includes('Safari') ? '🧭 Safari' : '❓ Unknown';
                    return (
                      <tr key={i}>
                        <td style={s.td}>{new Date(click.clickedAt).toLocaleString()}</td>
                        <td style={s.td}>{click.ipAddress}</td>
                        <td style={s.td}>{isMobile ? '📱 Mobile' : '💻 Desktop'}</td>
                        <td style={s.td}>{browser}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
