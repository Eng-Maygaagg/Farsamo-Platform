import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './DashboardLayout.css';

export default function DashboardLayout({ navItems, title }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <span className="brand-icon">⚡</span>
          <div>
            <strong>Farsamo</strong>
            <small>{title}</small>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.end} className={({ isActive }) => isActive ? 'active' : ''}>
              <span aria-hidden="true">{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="btn btn-ghost btn-sm" style={{ width: '100%' }}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '0.5rem' }}>
            Logout
          </button>
        </div>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>{title}</h1>
          <div className="user-info">
            <span>{user?.fullName}</span>
            <span className="role-badge">{user?.role}</span>
          </div>
        </header>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
