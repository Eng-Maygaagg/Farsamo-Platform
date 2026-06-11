import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then((r) => setStats(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{stats?.totalUsers}</div><div className="stat-label">Total Users</div></div>
        <div className="stat-card"><div className="stat-value">{stats?.customers}</div><div className="stat-label">Customers</div></div>
        <div className="stat-card"><div className="stat-value">{stats?.providers}</div><div className="stat-label">Providers</div></div>
        <div className="stat-card"><div className="stat-value">{stats?.bookings}</div><div className="stat-label">Bookings</div></div>
        <div className="stat-card"><div className="stat-value">${stats?.revenue}</div><div className="stat-label">Revenue</div></div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Bookings by Status</h3>
          <div style={{ marginTop: '1rem' }}>
            {stats?.bookingsByStatus?.map((b) => (
              <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ textTransform: 'capitalize' }}>{b._id?.replace('_', ' ')}</span>
                <strong>{b.count}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Services by Category</h3>
          <div style={{ marginTop: '1rem' }}>
            {stats?.servicesByCategory?.map((s) => (
              <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span>{s._id}</span>
                <strong>{s.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
