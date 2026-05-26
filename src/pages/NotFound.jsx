import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <main className={`page-enter ${styles.page}`}>
      <div className={styles.inner}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.sub}>La ruta que buscas no existe o fue eliminada.</p>
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
    </main>
  );
}
