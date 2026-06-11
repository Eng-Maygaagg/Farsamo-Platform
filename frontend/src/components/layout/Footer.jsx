import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>⚡ Farsamo</h3>
            <p>Connecting skilled professionals with customers who need quality services across Somalia.</p>
          </div>
          <div>
            <h4>Platform</h4>
            <Link to="/services">Services</Link>
            <Link to="/providers">Professionals</Link>
            <Link to="/track-booking">Track Booking</Link>
            <Link to="/register">Become a Provider</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <p>📧 contact@farsamo.com</p>
            <p>📞 +252 65 000 0000</p>
            <p>📍 Hargeisa, Somaliland</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Farsamo Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
