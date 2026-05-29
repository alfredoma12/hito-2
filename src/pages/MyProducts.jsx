import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks';
import { productService } from '../services/api';
import styles from './MyProducts.module.css';

// 🚀 Definimos la URL base de tu backend en Render
const BACKEND_URL = 'https://backend-69cg.onrender.com';

const MOCK = [
  { id: 1, title: 'Bicicleta de montaña', price: 120000, status: 'active',   cover_image: null },
  { id: 3, title: 'Silla ergonómica',      price: 85000,  status: 'active',   cover_image: null },
  { id: 5, title: 'Guitarra acústica',     price: 95000,  status: 'inactive', cover_image: null },
];

export default function MyProducts() {
  const [deleted, setDeleted] = useState([]);

  const { data, loading, error, refetch } = useFetch(
    () => productService.getMine().catch(() => ({ data: MOCK })),
    []
  );

  const products = (data ?? MOCK).filter((p) => !deleted.includes(p.id));

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;
    try {
      await productService.remove(id);
      setDeleted((prev) => [...prev, id]);
    } catch {
      alert('No se pudo eliminar.');
    }
  };

  const formatPrice = (n) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n);

  // ✅ Función auxiliar para corregir la ruta de la imagen
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${BACKEND_URL}${url}`;
  };

  return (
    <main className={`page-enter ${styles.page}`}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Mis publicaciones</h1>
            <p className={styles.sub}>{products.length} artículos publicados</p>
          </div>
          <Link to="/publicar" className="btn btn-primary">+ Nueva publicación</Link>
        </div>

        {loading && <div style={{ padding: '60px 0' }}><div className="spinner" /></div>}
        {error    && <div className="alert alert-error">Error al cargar tus publicaciones.</div>}

        {!loading && products.length === 0 && (
          <div className="empty-state">
            <h3>Aún no has publicado nada</h3>
            <p>¡Empieza a vender hoy!</p>
            <Link to="/publicar" className="btn btn-primary" style={{ marginTop: '16px' }}>Crear primera publicación</Link>
          </div>
        )}

        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.row}>
              <div className={styles.imgThumb}>
                {product.cover_image
                  // ✅ CORREGIDO: Ahora pasa a través de getImageUrl para apuntar a Render
                  ? <img src={getImageUrl(product.cover_image)} alt={product.title} />
                  : <span>📦</span>
                }
              </div>

              <div className={styles.info}>
                <p className={styles.productTitle}>{product.title}</p>
                <p className={styles.productPrice}>{formatPrice(product.price)}</p>
              </div>

              <span className={`tag ${product.status === 'active' ? 'tag-green' : 'tag-muted'}`}>
                {product.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>

              <div className={styles.rowActions}>
                <Link to={`/productos/${product.id}`} className="btn btn-ghost btn-sm">Ver</Link>
                <Link to={`/publicar/${product.id}`}  className="btn btn-outline btn-sm">Editar</Link>
                <button className="btn btn-sm" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
                  onClick={() => handleDelete(product.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}