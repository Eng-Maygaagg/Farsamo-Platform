import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import StarRating from '../../components/common/StarRating';
import Loading from '../../components/common/Loading';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/services/popular'),
      api.get('/providers/top'),
      api.get('/admin/stats/public'),
    ]).then(([svc, prov, st]) => {
      setServices(svc.data.data);
      setProviders(prov.data.data);
      setStats(st.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?search=${encodeURIComponent(search)}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-content">
          <h1>Find Trusted Professionals <span>Near You</span></h1>
          <p>Connect with skilled electricians, plumbers, carpenters, and more. Book services in minutes.</p>
          <form onSubmit={handleSearch} className="hero-search" role="search">
            <input
              type="search"
              placeholder="What service do you need?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              aria-label="Search services"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/providers" className="btn btn-outline btn-lg">Browse Professionals</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Get quality service in four simple steps</p>
          <div className="steps-grid">
            {[
              { step: '1', title: 'Search Service', desc: 'Find the service you need from our wide catalog' },
              { step: '2', title: 'Choose Professional', desc: 'Compare ratings, experience, and pricing' },
              { step: '3', title: 'Book Service', desc: 'Schedule at your preferred date and time' },
              { step: '4', title: 'Get Work Done', desc: 'Professional completes the job to your satisfaction' },
            ].map((item) => (
              <div key={item.step} className="step-card card">
                <div className="step-number">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title">Popular Services</h2>
          <p className="section-subtitle">Most requested services on our platform</p>
          <div className="grid grid-3">
            {services.map((svc) => (
              <Link to={`/services/${svc._id}`} key={svc._id} className="service-card card">
                <div className="service-icon">{svc.categoryId?.icon || '🔧'}</div>
                <h3>{svc.name}</h3>
                <p>{svc.description}</p>
                <span className="service-price">From ${svc.basePrice}</span>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/services" className="btn btn-outline">View All Services</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Top Professionals</h2>
          <p className="section-subtitle">Highly rated experts ready to help</p>
          <div className="grid grid-3">
            {providers.map((p) => (
              <Link to={`/providers/${p._id}`} key={p._id} className="provider-card card">
                <div className="provider-avatar">
                  {p.userId?.fullName?.charAt(0) || 'P'}
                </div>
                <h3>{p.userId?.fullName}</h3>
                <p className="provider-profession">{p.profession}</p>
                <StarRating rating={p.rating} />
                <p className="provider-meta">{p.experience} yrs exp · {p.location}</p>
                <span className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>View Profile</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="grid grid-3">
            {[
              { name: 'Mohamed A.', text: 'Found an excellent plumber within minutes. Professional and affordable!', rating: 5 },
              { name: 'Sahra H.', text: 'The electrician was punctual and fixed everything perfectly. Highly recommend Farsamo.', rating: 5 },
              { name: 'Abdi K.', text: 'Great platform for finding reliable service providers. Booking was seamless.', rating: 4 },
            ].map((t) => (
              <div key={t.name} className="testimonial-card card">
                <StarRating rating={t.rating} />
                <p>&ldquo;{t.text}&rdquo;</p>
                <strong>— {t.name}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container stats-grid">
          <div><span className="stat-num">{stats.totalCustomers || '500+'}</span><span>Customers</span></div>
          <div><span className="stat-num">{stats.totalProviders || '100+'}</span><span>Providers</span></div>
          <div><span className="stat-num">{stats.totalServices || '50+'}</span><span>Services</span></div>
          <div><span className="stat-num">{stats.completedJobs || '1000+'}</span><span>Completed Jobs</span></div>
        </div>
      </section>
    </div>
  );
}
