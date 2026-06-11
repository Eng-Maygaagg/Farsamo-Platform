import { useState } from 'react';
import api from '../../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({});
    try {
      await api.post('/contact', form);
      setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to send message.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Contact Us</h1>
        <p className="section-subtitle">We&apos;d love to hear from you</p>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3>📞 Phone</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>+252 65 000 0000</p>
            </div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3>📧 Email</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>contact@farsamo.com</p>
            </div>
            <div className="card">
              <h3>📍 Address</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>31May, Hargeisa, Somaliland</p>
            </div>
            <div className="card" style={{ marginTop: '1.5rem', padding: 0, overflow: 'hidden' }}>
              <iframe
                title="Farsamo Office Location"
                src="https://maps.google.com/maps?q=Hargeisa,Somaliland&output=embed"
                width="100%"
                height="250"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card">
            {status.message && <div className={`alert alert-${status.type}`}>{status.message}</div>}
            <div className="form-group">
              <label>Name</label>
              <input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input className="form-control" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="form-control" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
