import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService, categoryService } from '../services/api';
import styles from './Products.module.css';

const MOCK = [
  { id: 1, title: 'Bicicleta de montaña 29"', price: 120000, category: 'Deportes', seller: 'Juan P.', cover_image: null },
  { id: 2, title: 'Laptop HP Core i5',         price: 450000, category: 'Electrónica', seller: 'María G.', cover_image: null },
  { id: 3, title: 'Silla ergonómica',           price: 85000,  category: 'Hogar',       seller: 'Carlos R.', cover_image: null },
  { id: 4, title: 'Zapatillas running',         price: 39990,  category: 'Ropa',        seller: 'Ana M.',    cover_image: null },
  { id: 5, title: 'Guitarra acústica',          price: 95000,  category: 'Música',      seller: 'Luis T.',   cover_image: null },
  { id: 6, title: 'Mesa de comedor',            price: 180000, category: 'Hogar',       seller: 'Sofía L.',  cover_image: null },
  { id: 7, title: 'iPhone 13 128GB',            price: 520000, category: 'Electrónica', seller: 'Pedro V.',  cover_image: null },
  { id: 8, title: 'Chaqueta de cuero',          price: 65000,  category: 'Ropa',        seller: 'Valeria M.', cover_image: null },
];

const MOCK_CATS = [
  { id: 1, name: 'Electrónica' }, { id: 2, name: 'Deportes' },
  { id: 3, name: 'Hogar' },       { id: 4, name: 'Ropa' },
  { id: 5, name: 'Música' },      { id: 6, name: 'Libros' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products,   setProducts]   = useState(MOCK);
  const [categories, setCategories] = useState(MOCK_CATS);
  const [loading,    setLoading]    = useState(false);
  const [total,      setTotal]      = useState(MOCK.length);

  // Filtros tomados desde query params
  const [search,   setSearch]   = useState(searchParams.get('search')   || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy,   setSortBy]   = useState('newest');

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { search, category, sort: sortBy, limit: 12 };
    productService
      .getAll(params)
      .then(({ data }) => {
        if (data?.products) { setProducts(data.products); setTotal(data.total); }
      })
      .catch(() => {}) // usa mock
      .finally(() => setLoading(false));
  }, [search, category, sortBy]);

  useEffect(() => {
    fetchProducts();
    // Sincronizar URL
    const p = {};
    if (search)   p.search   = search;
    if (category) p.category = category;
    setSearchParams(p, { replace: true });
  }, [search, category, sortBy, fetchProducts, setSearchParams]);

  // Carga categorías una sola vez
  useEffect(() => {
    categoryService.getAll()
      .then(({ data }) => { if (data?.length) setCategories(data); })
      .catch(() => {});
  }, []);

  return (
    <main className="page-enter">
      <div className={`container ${styles.layout}`}>

        {/* ── Sidebar de filtros ── */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sideTitle}>Filtros</h2>

          <div className="form-group">
            <label>Buscar</label>
            <input
              type="search"
              placeholder="¿Qué buscas?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ordenar por</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Más reciente</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
            </select>
          </div>

          {(search || category) && (
            <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={() => { setSearch(''); setCategory(''); }}>
              Limpiar filtros ×
            </button>
          )}
        </aside>

        {/* ── Listado ── */}
        <div className={styles.main}>
          <div className={styles.resultsBar}>
            <span className={styles.resultCount}>{total} publicaciones</span>
          </div>

          {loading ? (
            <div style={{ padding: '80px 0' }}><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>Sin resultados</h3>
              <p>Intenta con otros filtros o términos de búsqueda.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
