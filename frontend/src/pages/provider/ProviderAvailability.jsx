import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function ProviderAvailability() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/providers/me/profile').then((r) => {
      setAvailability(r.data.data.availability?.length ? r.data.data.availability : DAYS.map((day) => ({ day, slots: [{ start: '09:00', end: '17:00', isAvailable: true }] })));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleDay = (dayIndex) => {
    const updated = [...availability];
    const slot = updated[dayIndex].slots[0];
    slot.isAvailable = !slot.isAvailable;
    setAvailability(updated);
  };

  const save = async () => {
    try {
      await api.put('/providers/me/availability', { availability });
      setMessage('Availability saved!');
    } catch {
      setMessage('Failed to save');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="card">
      <h3>Availability Calendar</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Set your weekly availability schedule</p>
      {message && <div className="alert alert-success">{message}</div>}
      <div className="grid grid-2">
        {availability.map((day, i) => (
          <div key={day.day} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ textTransform: 'capitalize' }}>{day.day}</strong>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {day.slots[0]?.start} - {day.slots[0]?.end}
              </p>
            </div>
            <button
              className={`btn btn-sm ${day.slots[0]?.isAvailable ? 'btn-success' : 'btn-ghost'}`}
              onClick={() => toggleDay(i)}
            >
              {day.slots[0]?.isAvailable ? 'Available' : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={save}>Save Availability</button>
    </div>
  );
}
