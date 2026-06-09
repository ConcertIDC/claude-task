import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/activities', label: 'Activity Tracker' },
  { to: '/money', label: 'Money Calculator' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initial = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">DT</div>
        <div className="brand-text">Daily Tracker</div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              'nav-item' + (isActive ? ' active' : '')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{initial}</div>
          <div className="user-info">
            <div className="user-name">{user.name || 'User'}</div>
            <div className="user-email">{user.email}</div>
          </div>
        </div>
        <button className="logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </aside>
  );
}
