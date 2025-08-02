import React, { useEffect } from 'react';
import styles from './CmsLogin.module.css';
import useCmsLoginViewModel from './ViewModel';
import { useNavigate } from 'react-router-dom';

// Función para validar si el JWT está expirado
function isJwtExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp está en segundos, Date.now() en milisegundos
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    // Si no puede decodificar, lo considera inválido/expirado
    return true;
  }
}

const CmsLogin: React.FC = () => {
  const {
    username, setUsername,
    password, setPassword,
    loading, error, handleSubmit
  } = useCmsLoginViewModel();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('cms_token');
    if (token && !isJwtExpired(token)) {
      // Token válido, redirige a dashboard
      navigate('/cms/dashboard', { replace: true });
    } else if (token && isJwtExpired(token)) {
      // Token vencido, limpiar localStorage
      localStorage.removeItem('cms_token');
    }
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Acceso CMS</h2>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <input
            className={styles.input}
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="off"
            name="username"
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="off"
            name="password"
          />
          <button
            className={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          {error && <div className={styles.error}>{error}</div>}
        </form>
        <div className={styles.info}>
          <p>Acceso restringido para personal autorizado.</p>
        </div>
      </div>
    </div>
  );
};

export default CmsLogin;
