import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../../components/common/Loading';

export default function ProviderProfile() {
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/providers/me/profile'),
      api.get('/services'),
    ]).then(([p, s]) => {
      setProfile(p.data.data);
      setServices(s.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.put('/providers/me/profile', profile);
      setMessage('Profile updated!');
    } catch {
      setMessage('Update failed');
    }
  };

  if (loading) return <Loading />;

  return (
    <form onSubmit={save} className="card">
      <h3>Profile Management</h3>
      {message && <div className="alert alert-success">{message}</div>}
      <div className="form-group">
        <label>Bio</label>
        <textarea className="form-control" value={profile.bio || ''} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Experience (years)</label>
        <input type="number" className="form-control" value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: Number(e.target.value) })} />
      </div>
      <div className="form-group">
        <label>Location</label>
        <input className="form-control" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Services</label>
        <select
          className="form-control"
          multiple
          value={profile.services?.map((s) => s._id || s) || []}
          onChange={(e) => setProfile({ ...profile, services: Array.from(e.target.selectedOptions, (o) => o.value) })}
          style={{ minHeight: '120px' }}
        >
          {services.map((s) => <option key={s._id} value={s._id}>{s.name} (${s.basePrice})</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>
          <input type="checkbox" checked={profile.isAvailable} onChange={(e) => setProfile({ ...profile, isAvailable: e.target.checked })} />
          {' '}Available for bookings
        </label>
      </div>
      <button type="submit" className="btn btn-primary">Save Profile</button>
    </form>
  );
}
