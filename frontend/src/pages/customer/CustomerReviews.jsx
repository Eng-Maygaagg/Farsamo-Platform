import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import StarRating from '../../components/common/StarRating';
import EmptyState from '../../components/common/EmptyState';

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reviews').then((r) => setReviews(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (reviews.length === 0) return <EmptyState title="No reviews yet" message="Complete a booking to leave a review." />;

  return (
    <div className="grid grid-2">
      {reviews.map((r) => (
        <div key={r._id} className="card">
          <StarRating rating={r.rating} />
          <p style={{ margin: '0.75rem 0', color: 'var(--text-muted)' }}>{r.comment}</p>
          <small style={{ color: 'var(--text-muted)' }}>{r.serviceId?.name} · {new Date(r.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}
