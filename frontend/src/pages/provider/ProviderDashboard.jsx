import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';

export default function ProviderDashboard() {
  const { provider } = useAuth();
  const [stats, setStats] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/bookings/stats'),
      api.get('/providers/me/earnings'),
    ]).then(([s, e]) => {
      setStats(s.data.data);
      setEarnings(e.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const getCount = (status) => stats.find((s) => s._id === status)?.count || 0;

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{stats.reduce((a, s) => a + s.count, 0)}</div><div className="stat-label">Total Bookings</div></div>
        <div className="stat-card"><div className="stat-value">{getCount('in_progress') + getCount('accepted')}</div><div className="stat-label">Active Jobs</div></div>
        <div className="stat-card"><div className="stat-value">{getCount('completed')}</div><div className="stat-label">Completed</div></div>
        <div className="stat-card"><div className="stat-value">{provider?.rating || earnings?.rating || 0}</div><div className="stat-label">Rating</div></div>
        <div className="stat-card"><div className="stat-value">${earnings?.totalEarnings || 0}</div><div className="stat-label">Total Earnings</div></div>
      </div>
      {earnings?.monthlyEarnings?.length > 0 && (
        <div className="card">
          <h3>Monthly Earnings</h3>
          <div className="table-wrapper" style={{ marginTop: '1rem' }}>
            <table className="data-table">
              <thead><tr><th>Month</th><th>Jobs</th><th>Revenue</th></tr></thead>
              <tbody>
                {earnings.monthlyEarnings.map((m, i) => (
                  <tr key={i}>
                    <td>{m._id.month}/{m._id.year}</td>
                    <td>{m.jobs}</td>
                    <td>${m.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
