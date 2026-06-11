import './About.css';

export default function About() {
  const team = [
    { name: 'Ahmed Hassan', role: 'CEO & Founder', bio: 'Visionary leader with 15 years in tech and services.' },
    { name: 'Fatima Ali', role: 'CTO', bio: 'Full-stack architect passionate about scalable platforms.' },
    { name: 'Omar Yusuf', role: 'Head of Operations', bio: 'Expert in marketplace operations and provider relations.' },
    { name: 'Amina Mohamed', role: 'Head of Customer Success', bio: 'Dedicated to exceptional customer experiences.' },
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>About Farsamo</h1>
          <p>Building Somalia&apos;s most trusted services marketplace</p>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div>
            <h2 className="section-title">Our Story</h2>
            <p>Farsamo was founded with a simple mission: make it easy for Somalis to find reliable, skilled professionals for everyday needs. We saw families struggling to find trustworthy electricians, plumbers, and technicians — and professionals struggling to reach customers.</p>
            <p style={{ marginTop: '1rem' }}>Today, Farsamo connects thousands of customers with verified professionals across Somalia, ensuring quality service delivery with transparency and accountability.</p>
          </div>
          <div className="about-image card" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
            🏗️
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="grid grid-2">
            <div className="card">
              <h3>🎯 Our Mission</h3>
              <p>To empower skilled professionals and provide customers with easy access to quality services, fostering economic growth and community trust.</p>
            </div>
            <div className="card">
              <h3>🔭 Our Vision</h3>
              <p>To become East Africa&apos;s leading services marketplace, setting the standard for trust, quality, and innovation in the gig economy.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="grid grid-4">
            {[
              { icon: '✅', title: 'Verified Professionals', desc: 'Every provider is background-checked and verified' },
              { icon: '💰', title: 'Transparent Pricing', desc: 'Clear pricing with no hidden fees' },
              { icon: '⭐', title: 'Quality Guaranteed', desc: 'Review system ensures high service standards' },
              { icon: '📱', title: 'Easy Booking', desc: 'Book services in minutes from any device' },
            ].map((item) => (
              <div key={item.title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title">Our Team</h2>
          <div className="grid grid-4">
            {team.map((member) => (
              <div key={member.name} className="card team-card">
                <div className="team-avatar">{member.name.charAt(0)}</div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
