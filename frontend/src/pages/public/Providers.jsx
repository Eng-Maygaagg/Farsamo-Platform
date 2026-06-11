import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import StarRating from '../../components/common/StarRating';

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ service: '', location: '', rating: '', minPrice: '', maxPrice: '' });

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api.get('/providers', { params })
      .then((r) => setProviders(r.data.data))
      .catch(() => setProviders([]))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Find Professionals</h1>
        <p className="section-subtitle">Browse verified service providers</p>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            <input className="form-control" placeholder="Service type" value={filters.service} onChange={(e) => setFilters({ ...filters, service: e.target.value })} />
            <input className="form-control" placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
            <select className="form-control" value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: e.target.value })}>
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
            <input className="form-control" type="number" placeholder="Min price" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
            <input className="form-control" type="number" placeholder="Max price" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
          </div>
        </div>

        {loading ? <Loading /> : providers.length === 0 ? (
          <EmptyState icon="👷" title="No professionals found" message="Try adjusting your filters." />
        ) : (
          <div className="grid grid-3">
            {providers.map((p) => (
              <Link to={`/providers/${p._id}`} key={p._id} className="card" style={{ textDecoration: 'none', color: 'var(--text)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem' }}>
                    {p.userId?.fullName?.charAt(0)}
                  </div>
                  <div>
                    <h3>{p.userId?.fullName}</h3>
                    <p style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{p.profession}</p>
                  </div>
                </div>
                <StarRating rating={p.rating} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.75rem 0' }}>
                  {p.experience} yrs · {p.location} · {p.reviewCount} reviews
                </p>
                <span className={`badge ${p.isAvailable ? 'badge-completed' : 'badge-pending'}`}>
                  {p.isAvailable ? 'Available' : 'Busy'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
