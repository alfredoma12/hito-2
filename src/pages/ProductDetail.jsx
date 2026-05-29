import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFetch } from '../hooks';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './ProductDetail.module.css';

// 🚀 Definimos la URL base de tu backend en Render
const BACKEND_URL = 'https://backend-69cg.onrender.com';

const MOCK_DETAIL = {
  id: 1,
  title: 'Bicicleta de montaña 29"',
  description: 'Bicicleta en excelente estado, rodado 29, 21 velocidades Shimano. Poco uso, frenos de disco hidráulico. Ideal para senderos y terreno mixto.',
  price: 120000,
  stock: 1,
  status: 'active',
  images: [],
  category: { id: 2, name: 'Deportes' },
  seller: { id: 2, name: 'Juan Pérez', created_at: '2023-06-01T00:00:00Z' },
  created_at: '2024-01-20T10:00:00Z',
};

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const { data: product, loading, error } = useFetch(
    () => productService.getById(id).catch(() => ({ data: MOCK_DETAIL })),
    [id]
  );

  const prod = product || MOCK_DETAIL;

  const formatPrice = (n) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n);

  const formatDate = (s) =>
    new Date(s).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleAddToCart = () => {
    addItem(prod);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // ✅ Función auxiliar para asegurar que la imagen apunte a Render
  const getImageUrl = () => {
    // Primero revisamos si hay algo en el arreglo de imágenes
    let imgPath = prod.images?.[0] || prod.cover_image;
    
    if (!imgPath) return null;
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
      return imgPath;
    }
    return `${BACKEND_URL}${imgPath}`;
  };

  const imageSrc = getImageUrl();

  if (loading) return <div style={{ padding: '80px 0' }}><div className="spinner" /></div>;
  if (error)   return <div className="container" style={{ padding: '64px 0' }}><p>Error al cargar el producto.</p></div>;

  return (
    <main className="page-enter">
      <div className={`container ${styles.layout}`}>

        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link to="/">Inicio</Link> /
          <Link to="/productos">Productos</Link> /
          <span>{prod.title}</span>
        </nav>

        <div className={styles.gallery}>
          {/* ✅ CORREGIDO: Ahora usa imageSrc apuntando directamente a Render */}
          {imageSrc ? (
            <img src={imageSrc} alt={prod.title} className={styles.mainImg} />
          ) : (
            <div className={styles.imgPlaceholder}>
              <span>📦</span>
            </div>
          )}
        </div>

        <div className={styles.info}>
          {prod.category && (
            <span className="tag tag-muted">{prod.category.name}</span>
          )}
          <h1 className={styles.title}>{prod.title}</h1>
          <p className={styles.price}>{formatPrice(prod.price)}</p>

          <p className={styles.description}>{prod.description}</p>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span>Stock</span>
              <strong>{prod.stock} {prod.stock === 1 ? 'unidad' : 'unidades'}</strong>
            </div>
            <div className={styles.metaItem}>
              <span>Publicado</span>
              <strong>{formatDate(prod.created_at)}</strong>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={`btn btn-primary ${styles.cartBtn}`}
              onClick={handleAddToCart}
              disabled={added}
            >
              {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
            </button>
            {!isAuthenticated && (
              <p className={styles.loginHint}>
                <Link to="/login">Inicia sesión</Link> para comprar o contactar al vendedor.
              </p>
            )}
          </div>

          <div className={styles.sellerCard}>
            <div className={styles.sellerAvatar}>{prod.seller?.name?.[0] ?? 'V'}</div>
            <div>
              <p className={styles.sellerName}>{prod.seller?.name}</p>
              <p className={styles.sellerSince}>Miembro desde {formatDate(prod.seller?.created_at || prod.created_at)}</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}