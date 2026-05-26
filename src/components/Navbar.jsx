import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
     
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span>Hito<strong>2</strong></span>
        </Link>

       
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <NavLink to="/"          className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>Inicio</NavLink>
          <NavLink to="/productos" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>Productos</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/publicar"     className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>Publicar</NavLink>
              <NavLink to="/mis-productos" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>Mis publicaciones</NavLink>
            </>
          )}
        </nav>

        <div className={styles.actions}>
          {/* Cart */}
          <Link to="/carrito" className={styles.cartBtn} aria-label="Carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
          </Link>

          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <Link to="/perfil" className={styles.avatar} title="Mi perfil">
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Salir</button>
            </div>
          ) : (
            <div className={styles.authBtns}>
              <Link to="/login"    className="btn btn-ghost btn-sm">Ingresar</Link>
              <Link to="/registro" className="btn btn-primary btn-sm">Registrarse</Link>
            </div>
          )}

          <button
            className={styles.burger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menú"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
