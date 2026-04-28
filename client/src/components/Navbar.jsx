import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fileUrl } from '../utils/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">C</span>
          <span>Creator Growth OS</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>Feed</NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/ai">AI Assistant</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-right">
          <Link to={`/profile/${user._id}`} className="avatar-link">
            {user.avatar
              ? <img src={fileUrl(user.avatar)} alt="" className="avatar" />
              : <span className="avatar avatar-fallback">{user.name?.[0]?.toUpperCase()}</span>}
            <span className="hide-sm">{user.name}</span>
          </Link>
          <button className="btn ghost" onClick={logout}>Logout</button>
        </div>
      </div>
    </header>
  );
}
