import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';
import StarRating from '../../components/common/StarRating';
import EmptyState from '../../components/common/EmptyState';

export default function ProviderReviews() {
  const { provider } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!provider?._id) return;
    api.get('/reviews', { params: { providerId: provider._id } })
      .then((r) => setReviews(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [provider]);

  if (loading) return <Loading />;
  if (reviews.length === 0) return <EmptyState title="No reviews yet" message="Reviews from customers will appear here." />;

  return (
    <div className="grid grid-2">
      {reviews.map((r) => (
        <div key={r._id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{r.customerId?.fullName}</strong>
            <StarRating rating={r.rating} />
          </div>
          <p style={{ margin: '0.75rem 0', color: 'var(--text-muted)' }}>{r.comment}</p>
          <small style={{ color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}
