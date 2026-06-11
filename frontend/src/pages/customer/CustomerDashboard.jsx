import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/common/Loading';

export default function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/dashboard').then((r) => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{data?.activeBookings || 0}</div><div className="stat-label">Active Bookings</div></div>
        <div className="stat-card"><div className="stat-value">{data?.completedJobs || 0}</div><div className="stat-label">Completed Jobs</div></div>
        <div className="stat-card"><div className="stat-value">{data?.reviews || 0}</div><div className="stat-label">Reviews Given</div></div>
      </div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Recent Bookings</h3>
          <Link to="/customer/bookings" className="btn btn-outline btn-sm">View All</Link>
        </div>
        {data?.recentBookings?.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>ID</th><th>Service</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {data.recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td><Link to={`/customer/bookings/${b._id}`}>{b.bookingId}</Link></td>
                    <td>{b.serviceId?.name}</td>
                    <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                    <td>{new Date(b.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p style={{ color: 'var(--text-muted)' }}>No bookings yet. <Link to="/providers">Find a professional</Link></p>}
      </div>
    </div>
  );
}
