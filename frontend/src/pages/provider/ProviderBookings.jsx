import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

export default function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/bookings').then((r) => setBookings(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <Loading />;
  if (bookings.length === 0) return <EmptyState title="No bookings" message="New booking requests will appear here." />;

  return (
    <div className="table-wrapper card" style={{ padding: 0 }}>
      <table className="data-table">
        <thead><tr><th>ID</th><th>Customer</th><th>Service</th><th>Date</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.bookingId}</td>
              <td>{b.customerId?.fullName}</td>
              <td>{b.serviceId?.name}</td>
              <td>{new Date(b.date).toLocaleDateString()}</td>
              <td>${b.price}</td>
              <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
              <td className="action-btns">
                {['submitted', 'pending'].includes(b.status) && (
                  <>
                    <button className="btn btn-success btn-sm" onClick={() => updateStatus(b._id, 'accepted')}>Accept</button>
                    <button className="btn btn-danger btn-sm" onClick={() => updateStatus(b._id, 'rejected')}>Reject</button>
                  </>
                )}
                {b.status === 'accepted' && (
                  <button className="btn btn-primary btn-sm" onClick={() => updateStatus(b._id, 'in_progress')}>Start</button>
                )}
                {b.status === 'in_progress' && (
                  <button className="btn btn-success btn-sm" onClick={() => updateStatus(b._id, 'completed')}>Complete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
