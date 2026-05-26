import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService, categoryService } from '../services/api';
import { useForm } from '../hooks';
import styles from './ProductForm.module.css';

const validate = (v) => {
  const e = {};
  if (!v.title)       e.title       = 'El título es requerido';
  if (!v.price)       e.price       = 'El precio es requerido';
  else if (isNaN(v.price) || +v.price <= 0) e.price = 'Precio inválido';
  if (!v.category_id) e.category_id = 'Selecciona una categoría';
  return e;
};

const MOCK_CATS = [
  { id: 1, name: 'Electrónica' }, { id: 2, name: 'Deportes' },
  { id: 3, name: 'Hogar' },       { id: 4, name: 'Ropa' },
  { id: 5, name: 'Música' },      { id: 6, name: 'Libros' },
];

export default function ProductForm() {
  const navigate = useNavigate();
  const { id }   = useParams(); // si existe, es edición
  const isEdit   = Boolean(id);

  const [categories, setCategories] = useState(MOCK_CATS);
  const [preview, setPreview]        = useState(null);

  const onSubmit = useCallback(async (values) => {
    const fd = new FormData();
    fd.append('title',       values.title);
    fd.append('description', values.description);
    fd.append('price',       values.price);
    fd.append('stock',       values.stock || 1);
    fd.append('category_id', values.category_id);
    if (values.image) fd.append('images', values.image);

    if (isEdit) {
      await productService.update(id, fd);
    } else {
      await productService.create(fd);
    }
    navigate('/mis-productos');
  }, [id, isEdit, navigate]);

  const { values, handleChange, handleSubmit, errors, loading, apiError, success, setValues } = useForm(
    { title: '', description: '', price: '', stock: '1', category_id: '', image: null },
    validate,
    onSubmit
  );

  // Cargar categorías
  useEffect(() => {
    categoryService.getAll()
      .then(({ data }) => { if (data?.length) setCategories(data); })
      .catch(() => {});
  }, []);

  // Si es edición, cargar datos del producto
  useEffect(() => {
    if (!isEdit) return;
    productService.getById(id)
      .then(({ data }) => {
        setValues({
          title:       data.title,
          description: data.description || '',
          price:       data.price,
          stock:       data.stock,
          category_id: data.category?.id || '',
          image:       null,
        });
      })
      .catch(() => {});
  }, [id, isEdit, setValues]);

  const handleImageChange = (e) => {
    handleChange(e);
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <main className={`page-enter ${styles.page}`}>
      <div className="container">
        <div className={styles.card}>
          <h1 className={styles.title}>
            {isEdit ? 'Editar publicación' : 'Nueva publicación'}
          </h1>
          <p className={styles.sub}>
            {isEdit ? 'Modifica los detalles de tu publicación.' : 'Completa el formulario para publicar tu artículo.'}
          </p>

          {apiError && <div className="alert alert-error">{apiError}</div>}
          {success  && <div className="alert alert-success">Publicación guardada ✓</div>}

          <form onSubmit={handleSubmit} noValidate className={styles.form} encType="multipart/form-data">

            {/* Imagen */}
            <div className={styles.imageArea}>
              <label htmlFor="image" className={styles.imageLabel}>
                {preview
                  ? <img src={preview} alt="preview" className={styles.preview} />
                  : <div className={styles.imagePlaceholder}><span>📷</span><span>Subir imagen</span></div>
                }
              </label>
              <input id="image" type="file" name="image" accept="image/*" onChange={handleImageChange} className={styles.fileInput} />
            </div>

            {/* Campos */}
            <div className={styles.fields}>
              <div className="form-group">
                <label>Título *</label>
                <input type="text" name="title" placeholder="Ej: Bicicleta de montaña 29''"
                  value={values.title} onChange={handleChange} />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea name="description" rows="4" placeholder="Describe tu artículo..."
                  value={values.description} onChange={handleChange}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Precio (CLP) *</label>
                  <input type="number" name="price" placeholder="0"
                    value={values.price} onChange={handleChange} min="0" />
                  {errors.price && <span className="form-error">{errors.price}</span>}
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label>Stock *</label>
                  <input type="number" name="stock" placeholder="1"
                    value={values.stock} onChange={handleChange} min="1" />
                </div>
              </div>

              <div className="form-group">
                <label>Categoría *</label>
                <select name="category_id" value={values.category_id} onChange={handleChange}>
                  <option value="">Selecciona una categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.category_id && <span className="form-error">{errors.category_id}</span>}
              </div>

              <div className={styles.btns}>
                <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Publicar'}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
