import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, userService } from '../services/api';

// ── Creación del contexto ──
const AuthContext = createContext(null);

// ── Provider ──
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // cargando sesión guardada
  const [error,   setError]   = useState(null);

  // Al montar: rehydratar sesión desde localStorage
  useEffect(() => {
    const token    = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try { setUser(JSON.parse(userData)); }
      catch { localStorage.clear(); }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    const { data } = await authService.login({ email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (formData) => {
    setError(null);
    const { data } = await authService.register(formData);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await userService.getProfile();
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshProfile,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook de consumo ──
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

export default AuthContext;
