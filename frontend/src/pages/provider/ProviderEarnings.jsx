import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';

export default function ProviderEarnings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/providers/me/earnings').then((r) => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const maxEarning = Math.max(...(data?.monthlyEarnings?.map((m) => m.total) || [1]));

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">${data?.totalEarnings || 0}</div><div className="stat-label">Total Earnings</div></div>
        <div className="stat-card"><div className="stat-value">{data?.totalJobs || 0}</div><div className="stat-label">Completed Jobs</div></div>
        <div className="stat-card"><div className="stat-value">{data?.rating || 0}</div><div className="stat-label">Average Rating</div></div>
      </div>
      <div className="card">
        <h3>Revenue Chart</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '200px', marginTop: '1.5rem' }}>
          {(data?.monthlyEarnings || []).reverse().map((m, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                height: `${(m.total / maxEarning) * 160}px`,
                background: 'var(--primary)',
                borderRadius: '4px 4px 0 0',
                minHeight: '4px',
                transition: 'height 0.3s',
              }} />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{m._id.month}/{m._id.year}</small>
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>${m.total}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
