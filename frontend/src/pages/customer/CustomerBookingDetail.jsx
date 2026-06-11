import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import BookingTimeline from '../../components/booking/BookingTimeline';

export default function CustomerBookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/bookings/${id}`).then((r) => setBooking(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { bookingId: booking._id, ...review });
      setMessage('Review submitted!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <Loading />;
  if (!booking) return <p>Booking not found</p>;

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{booking.bookingId}</h2>
          <span className={`badge badge-${booking.status}`}>{booking.status}</span>
        </div>
        <BookingTimeline status={booking.status} statusHistory={booking.statusHistory} />
        <div className="grid grid-4" style={{ marginTop: '1rem' }}>
          <div><strong>Service</strong><p>{booking.serviceId?.name}</p></div>
          <div><strong>Provider</strong><p>{booking.providerId?.userId?.fullName}</p></div>
          <div><strong>Date & Time</strong><p>{new Date(booking.date).toLocaleDateString()} at {booking.time}</p></div>
          <div><strong>Price</strong><p>${booking.price}</p></div>
        </div>
      </div>

      {booking.status === 'completed' && (
        <div className="card">
          <h3>Leave a Review</h3>
          {message && <div className="alert alert-success">{message}</div>}
          <form onSubmit={submitReview}>
            <div className="form-group">
              <label>Rating</label>
              <select className="form-control" value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea className="form-control" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        </div>
      )}
    </div>
  );
}
