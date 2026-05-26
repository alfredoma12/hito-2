import axios from 'axios';

// Base URL apunta al backend definido en el contrato del Hito 1
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: inyecta el JWT en cada request si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: manejo global de 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* ══════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════ */
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
};

/* ══════════════════════════════════════════════
   USERS
══════════════════════════════════════════════ */
export const userService = {
  getProfile:    ()     => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

/* ══════════════════════════════════════════════
   PRODUCTS
══════════════════════════════════════════════ */
export const productService = {
  getAll:    (params) => api.get('/products', { params }),
  getById:   (id)     => api.get(`/products/${id}`),
  create:    (data)   => api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update:    (id, data) => api.put(`/products/${id}`, data),
  remove:    (id)       => api.delete(`/products/${id}`),
  getMine:   ()         => api.get('/products/mine'),
};

/* ══════════════════════════════════════════════
   CATEGORIES
══════════════════════════════════════════════ */
export const categoryService = {
  getAll: () => api.get('/categories'),
};

export default api;
