import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

export default function AdminVerifications() {
  const [verifications, setVerifications] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/admin/verifications', { params: { status: filter || undefined } })
      .then((r) => setVerifications(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const verify = async (id, status) => {
    const rejectionReason = status === 'rejected' ? prompt('Rejection reason:') : '';
    await api.patch(`/admin/verifications/${id}`, { status, rejectionReason });
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['pending', 'approved', 'rejected', ''].map((s) => (
          <button key={s || 'all'} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(s)}>
            {s || 'All'}
          </button>
        ))}
      </div>
      {loading ? <Loading /> : verifications.length === 0 ? (
        <EmptyState title="No verifications" />
      ) : (
        <div className="grid grid-2">
          {verifications.map((v) => (
            <div key={v._id} className="card">
              <h3>{v.providerId?.userId?.fullName}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{v.providerId?.profession} · {v.providerId?.location}</p>
              <p>National ID: {v.nationalIdDocument}</p>
              <span className={`badge badge-${v.status}`}>{v.status}</span>
              {v.status === 'pending' && (
                <div className="action-btns" style={{ marginTop: '1rem' }}>
                  <button className="btn btn-success btn-sm" onClick={() => verify(v._id, 'approved')}>Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => verify(v._id, 'rejected')}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
