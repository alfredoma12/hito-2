import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { useForm } from '../hooks';
import styles from './Profile.module.css';

const validate = (v) => {
  const e = {};
  if (!v.name)  e.name  = 'El nombre es requerido';
  if (!v.email) e.email = 'El email es requerido';
  return e;
};

export default function Profile() {
  const { user, refreshProfile } = useAuth();

  const onSubmit = useCallback(async (values) => {
    await userService.updateProfile({ name: values.name, phone: values.phone });
    await refreshProfile();
  }, [refreshProfile]);

  const { values, handleChange, handleSubmit, errors, loading, apiError, success } = useForm(
    { name: user?.name || '', email: user?.email || '', phone: user?.phone || '' },
    validate,
    onSubmit
  );

  return (
    <main className={`page-enter ${styles.page}`}>
      <div className="container">
        <div className={styles.layout}>

          {/* Sidebar perfil */}
          <aside className={styles.sidebar}>
            <div className={styles.avatarBig}>{user?.name?.[0]?.toUpperCase() ?? 'U'}</div>
            <h2 className={styles.username}>{user?.name}</h2>
            <p className={styles.userEmail}>{user?.email}</p>
            <div className={styles.statsBadge}>
              <span className="tag tag-green">Vendedor activo</span>
            </div>
          </aside>

          {/* Formulario */}
          <div className={styles.formArea}>
            <h1 className={styles.formTitle}>Mi perfil</h1>
            <p className={styles.formSub}>Actualiza tu información personal</p>

            {apiError && <div className="alert alert-error">{apiError}</div>}
            {success  && <div className="alert alert-success">Perfil actualizado correctamente ✓</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Nombre completo</label>
                <input type="text" name="name" value={values.name} onChange={handleChange} />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={values.email} onChange={handleChange} disabled />
                <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>El email no se puede cambiar</span>
              </div>

              <div className="form-group">
                <label>Teléfono (opcional)</label>
                <input type="tel" name="phone" placeholder="+56 9 xxxx xxxx" value={values.phone} onChange={handleChange} />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
