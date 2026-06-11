import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

export default function Register() {
  const { registerCustomer, registerProvider } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '',
    profession: '', experience: '', location: '', nationalId: '', profilePhoto: '',
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (role === 'customer') {
        await registerCustomer({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password });
        navigate('/customer');
      } else {
        await registerProvider({ ...form, experience: Number(form.experience) });
        navigate('/provider');
      }
    } catch (err) {
      const msg = err.response?.data?.errors?.[0] || err.response?.data?.message;
      setError(msg || (err.message === 'Network Error' ? 'Cannot reach server. Make sure the backend is running on port 5000.' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card" style={{ maxWidth: '520px' }}>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join Farsamo Platform</p>

        <div className="role-toggle">
          <button type="button" className={role === 'customer' ? 'active' : ''} onClick={() => setRole('customer')}>Customer</button>
          <button type="button" className={role === 'provider' ? 'active' : ''} onClick={() => setRole('provider')}>Provider</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" required value={form.fullName} onChange={update('fullName')} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" required value={form.email} onChange={update('email')} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input className="form-control" required value={form.phone} onChange={update('phone')} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" required minLength={6} value={form.password} onChange={update('password')} />
          </div>

          {role === 'provider' && (
            <>
              <div className="form-group">
                <label>Profession</label>
                <input className="form-control" required value={form.profession} onChange={update('profession')} placeholder="e.g. Electrician" />
              </div>
              <div className="form-group">
                <label>Experience (years)</label>
                <input type="number" className="form-control" required min={0} value={form.experience} onChange={update('experience')} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input className="form-control" required value={form.location} onChange={update('location')} />
              </div>
              <div className="form-group">
                <label>National ID</label>
                <input className="form-control" required value={form.nationalId} onChange={update('nationalId')} />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
