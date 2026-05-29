import { Routes, Route } from 'react-router-dom';

import { AuthProvider }  from './context/AuthContext';
import { CartProvider }  from './context/CartContext';

import Navbar      from './components/Navbar';
import Footer      from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import Home          from './pages/Home';
import Products      from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Cart          from './pages/Cart';
import NotFound      from './pages/NotFound';

import Profile      from './pages/Profile';
import ProductForm  from './pages/ProductForm';
import MyProducts   from './pages/MyProducts';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />

        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/productos"  element={<Products />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/registro"   element={<Register />} />
          <Route path="/carrito"    element={<Cart />} />

          <Route path="/perfil" element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />
          <Route path="/publicar" element={
            <PrivateRoute><ProductForm /></PrivateRoute>
          } />
          <Route path="/publicar/:id" element={
            <PrivateRoute><ProductForm /></PrivateRoute>
          } />
          <Route path="/mis-productos" element={
            <PrivateRoute><MyProducts /></PrivateRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}