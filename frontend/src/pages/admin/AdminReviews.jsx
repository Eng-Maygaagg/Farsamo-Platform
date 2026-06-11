import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import StarRating from '../../components/common/StarRating';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/reviews', { params: { status: 'pending' } })
      .then((r) => setReviews(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const moderate = async (id, status) => {
    await api.patch(`/reviews/${id}/moderate`, { status });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/reviews/${id}`);
    load();
  };

  if (loading) return <Loading />;

  return (
    <div className="grid grid-2">
      {reviews.map((r) => (
        <div key={r._id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{r.customerId?.fullName}</strong>
            <StarRating rating={r.rating} />
          </div>
          <p style={{ margin: '0.75rem 0', color: 'var(--text-muted)' }}>{r.comment}</p>
          <div className="action-btns">
            <button className="btn btn-success btn-sm" onClick={() => moderate(r._id, 'approved')}>Approve</button>
            <button className="btn btn-ghost btn-sm" onClick={() => moderate(r._id, 'rejected')}>Reject</button>
            <button className="btn btn-danger btn-sm" onClick={() => remove(r._id)}>Delete</button>
          </div>
        </div>
      ))}
      {reviews.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No pending reviews to moderate.</p>}
    </div>
  );
}
