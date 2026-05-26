import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService, categoryService } from '../services/api';
import styles from './Home.module.css';

const MOCK_PRODUCTS = [
  { id: 1, title: 'Bicicleta de montaña 29"', price: 120000, category: 'Deportes', seller: 'Juan P.', cover_image: null },
  { id: 2, title: 'Laptop HP Core i5 8GB RAM', price: 450000, category: 'Electrónica', seller: 'María G.', cover_image: null },
  { id: 3, title: 'Silla ergonómica de oficina', price: 85000, category: 'Hogar', seller: 'Carlos R.', cover_image: null },
  { id: 4, title: 'Zapatillas running talla 42', price: 39990, category: 'Ropa', seller: 'Ana M.', cover_image: null },
  { id: 5, title: 'Guitarra acústica + estuche', price: 95000, category: 'Música', seller: 'Luis T.', cover_image: null },
  { id: 6, title: 'Mesa de comedor 6 personas', price: 180000, category: 'Hogar', seller: 'Sofía L.', cover_image: null },
];

const MOCK_CATEGORIES = [
  { id: 1, name: 'Electrónica', icon: '💻' },
  { id: 2, name: 'Deportes',    icon: '🚴' },
  { id: 3, name: 'Hogar',       icon: '🏠' },
  { id: 4, name: 'Ropa',        icon: '👕' },
  { id: 5, name: 'Música',      icon: '🎸' },
  { id: 6, name: 'Libros',      icon: '📚' },
];

export default function Home() {
  const [products,   setProducts]   = useState(MOCK_PRODUCTS);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [loading,    setLoading]    = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productService.getAll({ limit: 6 }),
      categoryService.getAll(),
    ])
      .then(([prodRes, catRes]) => {
        if (prodRes.data?.products?.length) setProducts(prodRes.data.products);
        if (catRes.data?.length)            setCategories(catRes.data);
      })
      .catch(() => { /* usa mock data */ })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-enter">

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <span className="tag tag-accent">Marketplace</span>
            <h1 className={styles.heroTitle}>
              Compra y vende<br />
              <em>lo que necesitas</em>
            </h1>
            <p className={styles.heroSub}>
              Miles de productos publicados por personas de tu comunidad.
              Encuentra lo que buscas o empieza a vender hoy.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/productos"   className="btn btn-primary">Ver productos</Link>
              <Link to="/registro"    className="btn btn-outline">Publicar gratis</Link>
            </div>
          </div>
          
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Explorar categorías</h2>
          <div className={styles.catsGrid}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/productos?category=${cat.id}`}
                className={styles.catCard}
              >
                <span className={styles.catIcon}>{cat.icon}</span>
                <span className={styles.catName}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Publicaciones recientes</h2>
            <Link to="/productos" className="btn btn-ghost btn-sm">Ver todas →</Link>
          </div>

          {loading ? (
            <div style={{ padding: '48px 0' }}><div className="spinner" /></div>
          ) : (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className="container">
          <h2>¿Tienes algo que vender?</h2>
          <p>Publica en segundos y llega a cientos de compradores.</p>
          <Link to="/publicar" className="btn btn-primary">Crear publicación gratis</Link>
        </div>
      </section>

    </main>
  );
}
