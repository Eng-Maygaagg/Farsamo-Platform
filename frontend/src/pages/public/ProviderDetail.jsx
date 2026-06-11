import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';
import StarRating from '../../components/common/StarRating';

export default function ProviderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [booking, setBooking] = useState({ serviceId: '', date: '', time: '', location: '', notes: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/providers/${id}`)
      .then((r) => setProvider(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'customer') {
      setError('Only customer accounts can request bookings.');
      return;
    }
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings', { ...booking, providerId: id });
      setSuccess(`Booking created! ID: ${data.data.bookingId}`);
      setShowBooking(false);
      setBooking({ serviceId: '', date: '', time: '', location: '', notes: '' });
    } catch (err) {
      const details = err.response?.data?.errors?.join(', ');
      setError(details || err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const openBookingForm = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    setSuccess('');
    setShowBooking(true);
  };

  if (loading) return <Loading />;
  if (!provider) return <div className="section container"><p>Provider not found.</p></div>;

  return (
    <div className="section">
      <div className="container">
        {success && <div className="alert alert-success">{success}</div>}
        <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700, margin: '0 auto 1rem' }}>
              {provider.userId?.fullName?.charAt(0)}
            </div>
            <h2>{provider.userId?.fullName}</h2>
            <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{provider.profession}</p>
            <StarRating rating={provider.rating} />
            <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0' }}>{provider.reviewCount} reviews · {provider.totalJobs} jobs</p>
            <p>📍 {provider.location}</p>
            <p>🕐 {provider.experience} years experience</p>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={openBookingForm}>
              Request Booking
            </button>
          </div>
          <div>
            <h3>About</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, margin: '1rem 0' }}>{provider.bio || 'Professional service provider.'}</p>
            <h3 style={{ marginTop: '2rem' }}>Services & Pricing</h3>
            <div className="grid" style={{ marginTop: '1rem' }}>
              {provider.services?.map((svc) => {
                const price = provider.pricing?.find((p) => {
                  const serviceId = p.serviceId?._id || p.serviceId;
                  return serviceId?.toString() === svc._id?.toString();
                });
                return (
                  <div key={svc._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{svc.name}</span>
                    <strong style={{ color: 'var(--primary)' }}>${price?.price || svc.basePrice}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {showBooking && (
          <div className="card" style={{ marginTop: '2rem', maxWidth: '600px' }}>
            <h3>Request Booking</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleBook}>
              <div className="form-group">
                <label>Service</label>
                <select className="form-control" required value={booking.serviceId} onChange={(e) => setBooking({ ...booking, serviceId: e.target.value })}>
                  <option value="">Select service</option>
                  {provider.services?.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="form-control" required value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input type="time" className="form-control" required value={booking.time} onChange={(e) => setBooking({ ...booking, time: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input className="form-control" required value={booking.location} onChange={(e) => setBooking({ ...booking, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea className="form-control" value={booking.notes} onChange={(e) => setBooking({ ...booking, notes: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowBooking(false)} disabled={submitting}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
