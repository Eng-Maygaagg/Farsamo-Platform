import { useState } from 'react';
import api from '../../services/api';
import BookingTimeline from '../../components/booking/BookingTimeline';
import './TrackBooking.css';

export default function TrackBooking() {
  const [bookingId, setBookingId] = useState('');
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setBooking(null);
    setLoading(true);
    try {
      const { data } = await api.get(`/bookings/track/${bookingId.trim()}`);
      setBooking(data.data);
    } catch {
      setError('Booking not found. Please check your booking ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '700px' }}>
        <h1 className="section-title" style={{ textAlign: 'center' }}>Track Your Booking</h1>
        <p className="section-subtitle" style={{ textAlign: 'center' }}>Enter your booking ID to see real-time status</p>

        <form onSubmit={handleTrack} className="card" style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label htmlFor="bookingId">Booking ID</label>
            <input
              id="bookingId"
              className="form-control"
              placeholder="e.g. FAR-XXXXX-XXXX"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Searching...' : 'Track Booking'}
          </button>
        </form>

        {error && <div className="alert alert-error">{error}</div>}

        {booking && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2>{booking.bookingId}</h2>
                <p style={{ color: 'var(--text-muted)' }}>{booking.serviceId?.name}</p>
              </div>
              <span className={`badge badge-${booking.status}`}>{booking.status.replace('_', ' ')}</span>
            </div>

            <BookingTimeline status={booking.status} statusHistory={booking.statusHistory} />

            <div className="booking-details-grid">
              <div><strong>Date</strong><p>{new Date(booking.date).toLocaleDateString()}</p></div>
              <div><strong>Time</strong><p>{booking.time}</p></div>
              <div><strong>Location</strong><p>{booking.location}</p></div>
              <div><strong>Price</strong><p>${booking.price}</p></div>
              <div><strong>Provider</strong><p>{booking.providerId?.userId?.fullName || 'N/A'}</p></div>
              {booking.notes && <div><strong>Notes</strong><p>{booking.notes}</p></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
