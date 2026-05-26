import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks';
import styles from './Auth.module.css';

const validate = (v) => {
  const e = {};
  if (!v.name)     e.name     = 'El nombre es requerido';
  if (!v.email)    e.email    = 'El email es requerido';
  else if (!/\S+@\S+\.\S+/.test(v.email)) e.email = 'Email no válido';
  if (!v.password) e.password = 'La contraseña es requerida';
  else if (v.password.length < 6) e.password = 'Mínimo 6 caracteres';
  if (v.password !== v.confirm) e.confirm = 'Las contraseñas no coinciden';
  return e;
};

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const onSubmit = useCallback(async (values) => {
    await register({ name: values.name, email: values.email, password: values.password });
    navigate('/login', { state: { message: '¡Cuenta creada! Ingresa para continuar.' } });
  }, [register, navigate]);

  const { values, handleChange, handleSubmit, errors, loading, apiError, success } = useForm(
    { name: '', email: '', password: '', confirm: '' },
    validate,
    onSubmit
  );

  return (
    <main className={`page-enter ${styles.page}`}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link to="/" className={styles.logoLink}>◈ Hito2</Link>
          <h1 className={styles.title}>Crea tu cuenta</h1>
          <p className={styles.sub}>Es gratis y solo toma un minuto</p>
        </div>

        {apiError && <div className="alert alert-error">{apiError}</div>}
        {success  && <div className="alert alert-success">¡Cuenta creada exitosamente!</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Nombre completo</label>
            <input type="text" name="name" placeholder="María González"
              value={values.name} onChange={handleChange} />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="tu@email.com"
              value={values.email} onChange={handleChange} autoComplete="email" />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" name="password" placeholder="Mínimo 6 caracteres"
              value={values.password} onChange={handleChange} />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input type="password" name="confirm" placeholder="Repite tu contraseña"
              value={values.confirm} onChange={handleChange} />
            {errors.confirm && <span className="form-error">{errors.confirm}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className={styles.switchText}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.switchLink}>Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}
