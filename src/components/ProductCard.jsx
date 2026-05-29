import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './ProductCard.module.css';

// 🚀 Definimos la URL base de tu backend en Render
const BACKEND_URL = 'https://backend-69cg.onrender.com';

export default function ProductCard({ product, showAddCart = true }) {
  const { addItem } = useCart();

  const formatPrice = (n) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n);

  // ✅ CORRECCIÓN: Si la imagen es una ruta relativa (empieza con /uploads), le pegamos la URL de Render
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url; // Si ya viene completa (ej: una URL externa), la dejamos igual
    }
    return `${BACKEND_URL}${url}`; // Si viene como /uploads/..., le sumamos el dominio de Render
  };

  return (
    <article className={`card ${styles.card}`}>
      <Link to={`/productos/${product.id}`} className={styles.imgWrap}>
        {product.cover_image ? (
          // ✅ Usamos la función correctora aquí
          <img src={getImageUrl(product.cover_image)} alt={product.title} className={styles.img} />
        ) : (
          <div className={styles.imgPlaceholder}>
            <span>📦</span>
          </div>
        )}
        {product.category && (
          <span className={`tag tag-muted ${styles.catTag}`}>{product.category}</span>
        )}
      </Link>

      <div className={styles.body}>
        <Link to={`/productos/${product.id}`}>
          <h3 className={styles.title}>{product.title}</h3>
        </Link>

        {product.seller && (
          <p className={styles.seller}>
            <span className={styles.sellerDot}></span>
            {product.seller}
          </p>
        )}

        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {showAddCart && (
            <button
              className={`btn btn-primary btn-sm ${styles.addBtn}`}
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              title="Agregar al carrito"
            >
              +
            </button>
          )}
        </div>
      </div>
    </article>
  );
}