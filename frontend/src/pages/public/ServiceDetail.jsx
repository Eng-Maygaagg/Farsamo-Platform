import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import StarRating from '../../components/common/StarRating';

export default function ServiceDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/services/${id}`)
      .then((r) => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!data) return <div className="section container"><p>Service not found.</p></div>;

  const { service, suggestedProviders } = data;

  return (
    <div className="section">
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            <span className="badge" style={{ background: 'var(--bg-secondary)' }}>{service.categoryId?.name}</span>
            <h1 style={{ margin: '1rem 0' }}>{service.name}</h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{service.description}</p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem' }}>
              <div><strong style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>${service.basePrice}</strong><br /><small>Starting price</small></div>
              <div><strong>{service.estimatedDuration}</strong><br /><small>Duration</small></div>
            </div>
            {service.features?.length > 0 && (
              <ul style={{ marginTop: '1.5rem', paddingLeft: '1.25rem', color: 'var(--text-muted)' }}>
                {service.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            )}
          </div>
          <div className="card">
            <h3>Book This Service</h3>
            <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>Choose a professional below to request a booking.</p>
            <Link to="/providers" className="btn btn-primary" style={{ width: '100%' }}>Find Professionals</Link>
          </div>
        </div>

        {suggestedProviders?.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h2 className="section-title">Suggested Professionals</h2>
            <div className="grid grid-3">
              {suggestedProviders.map((p) => (
                <Link to={`/providers/${p._id}`} key={p._id} className="card" style={{ textDecoration: 'none', color: 'var(--text)' }}>
                  <h3>{p.userId?.fullName}</h3>
                  <p style={{ color: 'var(--primary)' }}>{p.profession}</p>
                  <StarRating rating={p.rating} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{p.location}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
