import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      const paths = { admin: '/admin', provider: '/provider', customer: '/customer' };
      navigate(paths[data.user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || (err.message === 'Network Error' ? 'Cannot reach server. Make sure the backend is running on port 5000.' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your Farsamo account</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.85rem' }}>Forgot password?</Link>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-footer">Don&apos;t have an account? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  );
}
