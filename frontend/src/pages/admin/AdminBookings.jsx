import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/admin/bookings', { params: status ? { status } : {} })
      .then((r) => setBookings(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['', 'submitted', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'].map((s) => (
          <button key={s || 'all'} className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setStatus(s)}>{s || 'All'}</button>
        ))}
      </div>
      {loading ? <Loading /> : (
        <div className="table-wrapper card" style={{ padding: 0 }}>
          <table className="data-table">
            <thead><tr><th>ID</th><th>Customer</th><th>Provider</th><th>Service</th><th>Date</th><th>Price</th><th>Status</th></tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.bookingId}</td>
                  <td>{b.customerId?.fullName}</td>
                  <td>{b.providerId?.userId?.fullName}</td>
                  <td>{b.serviceId?.name}</td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>${b.price}</td>
                  <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
