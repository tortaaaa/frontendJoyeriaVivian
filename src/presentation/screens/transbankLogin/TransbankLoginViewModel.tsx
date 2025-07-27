import { useState } from 'react';
import { TransbankLoginUseCase } from '../../../domain/useCases/transbankLogin/TransbankLoginUseCase';

// Simple escape to avoid SQLi attempts (no backend SQL but extra paranoia)
const escapeInput = (str: string) =>
  str.replace(/['"\\;]/g, '');

const useTransbankLoginViewModel = () => {
  const [username, setUsernameRaw] = useState('');
  const [password, setPasswordRaw] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Limpiar entradas para evitar inyección, aunque el backend está protegido
  const setUsername = (val: string) => setUsernameRaw(escapeInput(val));
  const setPassword = (val: string) => setPasswordRaw(escapeInput(val));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    // Validación extra: solo caracteres alfanuméricos (puedes quitarlo si quieres más flexible)
    if (!/^[\w.@+-]+$/.test(username)) {
      setError('El usuario contiene caracteres no permitidos.');
      return;
    }

    setLoading(true);

    try {
      const response = await TransbankLoginUseCase.login({ username, password });
      // Guarda el JWT (puedes usar context, localStorage, etc.)
      localStorage.setItem('transbank_token', response.access);
      // Redirige o recarga según lo que quieras mostrar después
      window.location.href = '/'; // Cambia por la ruta protegida para transbank si quieres
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrectos.');
      } else {
        setError('Error inesperado. Intente de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  };
};

export default useTransbankLoginViewModel;
