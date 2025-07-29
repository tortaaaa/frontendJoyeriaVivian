import { useState } from 'react';
import { CmsLoginUseCase } from '../../../../domain/useCases/Cms/CmsLoginUseCase';

const useCmsLoginViewModel = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);

    try {
      const response = await CmsLoginUseCase.login({ username, password });
      localStorage.setItem('cms_token', response.access);
      // Redirigir al dashboard del CMS
      window.location.href = '/cms/dashboard'; 
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

export default useCmsLoginViewModel;
