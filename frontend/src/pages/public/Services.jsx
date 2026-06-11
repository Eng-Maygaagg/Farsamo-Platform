import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    api.get('/services/categories').then((r) => setCategories(r.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    api.get('/services', { params })
      .then((r) => setServices(r.data.data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [search, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ ...(search && { search }), ...(category && { category }) });
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Our Services</h1>
        <p className="section-subtitle">Browse and book professional services</p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '250px' }}>
            <input
              type="search"
              className="form-control"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          <select className="form-control" style={{ maxWidth: '200px' }} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? <Loading /> : services.length === 0 ? (
          <EmptyState icon="🔍" title="No services found" message="Try adjusting your search or filters." />
        ) : (
          <div className="grid grid-3">
            {services.map((svc) => (
              <Link to={`/services/${svc._id}`} key={svc._id} className="card" style={{ textDecoration: 'none', color: 'var(--text)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{svc.categoryId?.icon || '🔧'}</div>
                <span className="badge" style={{ background: 'var(--bg-secondary)', marginBottom: '0.5rem' }}>{svc.categoryId?.name}</span>
                <h3>{svc.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0' }}>{svc.description}</p>
                <strong style={{ color: 'var(--primary)' }}>From ${svc.basePrice}</strong>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
