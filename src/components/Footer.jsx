import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>Hito<strong>2</strong></span>
          <p>Tu marketplace de confianza para comprar y vender en comunidad.</p>
        </div>
        <nav className={styles.links}>
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/registro">Registrarse</Link>
          <Link to="/login">Ingresar</Link>
        </nav>
        <p className={styles.copy}>© {new Date().getFullYear()} Hito2</p>
      </div>
    </footer>
  );
}
