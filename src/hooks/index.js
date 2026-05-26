import { useState, useEffect, useCallback } from 'react';

/* ══════════════════════════════════════════════
   useFetch — petición genérica con loading/error
   Uso: const { data, loading, error, refetch } = useFetch(fn, deps)
══════════════════════════════════════════════ */
export function useFetch(fetchFn, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { execute(); }, [execute]);

  return { data, loading, error, refetch: execute };
}

/* ══════════════════════════════════════════════
   useForm — manejo de formularios controlados
   Uso: const { values, handleChange, handleSubmit, errors, loading } = useForm(...)
══════════════════════════════════════════════ */
export function useForm(initialValues, validate, onSubmit) {
  const [values,  setValues]  = useState(initialValues);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    // Limpiar error del campo al editar
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess(false);

    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit(values);
      setSuccess(true);
    } catch (err) {
      setApiError(err.response?.data?.error || err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  }, [values, validate, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setApiError('');
    setSuccess(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { values, handleChange, handleSubmit, errors, loading, success, apiError, setValues, reset };
}

/* ══════════════════════════════════════════════
   useLocalStorage — sincroniza estado con localStorage
══════════════════════════════════════════════ */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = typeof value === 'function' ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) { console.error(err); }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
