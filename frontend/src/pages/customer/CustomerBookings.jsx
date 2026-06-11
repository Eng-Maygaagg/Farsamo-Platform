import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = filter ? { status: filter } : {};
    api.get('/bookings', { params }).then((r) => setBookings(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['', 'submitted', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map((s) => (
          <button key={s || 'all'} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(s)}>
            {s ? s.replace('_', ' ') : 'All'}
          </button>
        ))}
      </div>
      {loading ? <Loading /> : bookings.length === 0 ? (
        <EmptyState title="No bookings" message="Start by booking a service." />
      ) : (
        <div className="table-wrapper card" style={{ padding: 0 }}>
          <table className="data-table">
            <thead><tr><th>Booking ID</th><th>Service</th><th>Provider</th><th>Date</th><th>Price</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.bookingId}</td>
                  <td>{b.serviceId?.name}</td>
                  <td>{b.providerId?.userId?.fullName}</td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>${b.price}</td>
                  <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                  <td><Link to={`/customer/bookings/${b._id}`} className="btn btn-ghost btn-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
