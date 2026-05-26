import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total    = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}

export default CartContext;
