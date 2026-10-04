import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const DARK_KEY = 'shopsphere_dark';

function getInitialDark() {
  const saved = localStorage.getItem(DARK_KEY);
  if (saved !== null) return saved === 'true';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [dark, setDark] = useState(getInitialDark);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : '';
    localStorage.setItem(DARK_KEY, dark);
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Shop<span>Sphere</span>
      </Link>
      <nav className="nav-links">
        <NavLink to="/">Shop</NavLink>
        <NavLink to="/cart">Cart ({totalItems})</NavLink>
        {user && <NavLink to="/orders">My Orders</NavLink>}
        {isAdmin && <NavLink to="/admin/products">Admin</NavLink>}
        {user ? (
          <>
            <span className="muted">Hi, {user.name.split(' ')[0]}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <NavLink to="/login" className="btn">Login</NavLink>
        )}
        <button
          className="dark-mode-btn"
          onClick={() => setDark((d) => !d)}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  );
}
