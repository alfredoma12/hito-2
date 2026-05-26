import { useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks';
import styles from './Auth.module.css';

const validate = (v) => {
  const e = {};
  if (!v.email)    e.email    = 'El email es requerido';
  if (!v.password) e.password = 'La contraseña es requerida';
  return e;
};

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const from = location.state?.from?.pathname || '/';

  const onSubmit = useCallback(async (values) => {
    await login(values.email, values.password);
    navigate(from, { replace: true });
  }, [login, navigate, from]);

  const { values, handleChange, handleSubmit, errors, loading, apiError } = useForm(
    { email: '', password: '' },
    validate,
    onSubmit
  );

  return (
    <main className={`page-enter ${styles.page}`}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link to="/" className={styles.logoLink}>Hito 2</Link>
          <h1 className={styles.title}>Bienvenido de vuelta</h1>
          <p className={styles.sub}>Ingresa con tu cuenta para continuar</p>
        </div>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email" name="email" placeholder="tu@email.com"
              value={values.email} onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password" name="password" placeholder="••••••••"
              value={values.password} onChange={handleChange}
              autoComplete="current-password"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className={styles.switchText}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className={styles.switchLink}>Regístrate gratis</Link>
        </p>
      </div>
    </main>
  );
}
