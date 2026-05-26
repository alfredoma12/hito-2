import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './ProductCard.module.css';

/**
 * ProductCard — componente reutilizable para mostrar un producto.
 * Props:
 *  - product: { id, title, price, cover_image, category, seller }
 *  - showAddCart?: boolean (default true)
 */
export default function ProductCard({ product, showAddCart = true }) {
  const { addItem } = useCart();

  const formatPrice = (n) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n);

  return (
    <article className={`card ${styles.card}`}>
      <Link to={`/productos/${product.id}`} className={styles.imgWrap}>
        {product.cover_image ? (
          <img src={product.cover_image} alt={product.title} className={styles.img} />
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
