import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './Cart.module.css';

export default function Cart() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const fmt = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n);

  if (items.length === 0) {
    return (
      <main className="page-enter">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: '80px' }}>
            <h3>Tu carrito está vacío</h3>
            <p>Agrega productos desde la galería para comenzar.</p>
            <Link to="/productos" className="btn btn-primary" style={{ marginTop: '20px' }}>Ver productos</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-enter">
      <div className={`container ${styles.layout}`}>

        <div className={styles.itemsList}>
          <div className={styles.listHeader}>
            <h1 className={styles.title}>Carrito</h1>
            <button className="btn btn-ghost btn-sm" onClick={clearCart}>Vaciar carrito</button>
          </div>

          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemImg}>
                {item.cover_image ? <img src={item.cover_image} alt={item.title} /> : <span>📦</span>}
              </div>
              <div className={styles.itemInfo}>
                <Link to={`/productos/${item.id}`} className={styles.itemTitle}>{item.title}</Link>
                <p className={styles.itemPrice}>{fmt(item.price)}</p>
              </div>
              <div className={styles.qtyControl}>
                <button onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
              </div>
              <p className={styles.itemTotal}>{fmt(item.price * item.quantity)}</p>
              <button className={styles.removeBtn} onClick={() => removeItem(item.id)} title="Eliminar">✕</button>
            </div>
          ))}
        </div>

        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Resumen</h2>
          <div className={styles.summaryRow}><span>Subtotal</span><strong>{fmt(total)}</strong></div>
          <div className={styles.summaryRow}><span>Envío</span><strong>A coordinar</strong></div>
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}><span>Total</span><strong>{fmt(total)}</strong></div>

          {isAuthenticated ? (
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Confirmar pedido
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', textAlign: 'center' }}>
                Ingresar para comprar
              </Link>
              <p style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', marginTop: '8px' }}>
                O <Link to="/registro" style={{ color: 'var(--accent)' }}>crea tu cuenta gratis</Link>
              </p>
            </>
          )}
        </aside>

      </div>
    </main>
  );
}
