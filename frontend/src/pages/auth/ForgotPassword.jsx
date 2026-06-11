import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch {
      setMessage('If email exists, reset link has been sent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1>Forgot Password</h1>
        <p className="auth-subtitle">Enter your email to receive a reset link</p>
        {message && <div className="alert alert-success">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="auth-footer"><Link to="/login">Back to Sign In</Link></p>
      </div>
    </div>
  );
}
