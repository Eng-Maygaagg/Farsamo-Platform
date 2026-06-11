import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const dashboardPath = user?.role === 'admin' ? '/admin' : user?.role === 'provider' ? '/provider' : '/customer';

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⚡</span>
          <span>Farsamo</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>
          <span /><span /><span />
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/services" onClick={() => setMenuOpen(false)}>Services</NavLink>
          <NavLink to="/providers" onClick={() => setMenuOpen(false)}>Professionals</NavLink>
          <NavLink to="/track-booking" onClick={() => setMenuOpen(false)}>Track Booking</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>

          <button className="theme-toggle btn btn-ghost btn-sm" onClick={toggleTheme} aria-label="Toggle dark mode">
            {darkMode ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="navbar-auth">
              <Link to={dashboardPath} className="btn btn-ghost btn-sm">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
