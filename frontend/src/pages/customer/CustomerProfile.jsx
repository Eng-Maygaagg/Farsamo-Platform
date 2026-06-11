import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function CustomerProfile() {
  const { user, loadUser } = useAuth();
  const [form, setForm] = useState({ fullName: user?.fullName || '', phone: user?.phone || '' });
  const [message, setMessage] = useState('');
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', form);
      await loadUser();
      setMessage('Profile updated!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/update-password', passwordForm);
      setMessage('Password updated!');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Password update failed');
    }
  };

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      <form onSubmit={updateProfile} className="card">
        <h3>Profile Settings</h3>
        {message && <div className="alert alert-success">{message}</div>}
        <div className="form-group">
          <label>Full Name</label>
          <input className="form-control" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="form-control" value={user?.email} disabled />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
      <form onSubmit={updatePassword} className="card">
        <h3>Change Password</h3>
        <div className="form-group">
          <label>Current Password</label>
          <input type="password" className="form-control" required value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input type="password" className="form-control" required minLength={6} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary">Update Password</button>
      </form>
    </div>
  );
}
