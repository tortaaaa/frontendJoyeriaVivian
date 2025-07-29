import React from 'react';
import styles from './TransbankLogin.module.css';
import useTransbankLoginViewModel from '././TransbankLoginViewModel';

const TransbankLogin: React.FC = () => {
  const {
    username, setUsername,
    password, setPassword,
    loading, error, handleSubmit
  } = useTransbankLoginViewModel();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Login Transbank Testers</h2>
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
          <p>Solo para pruebas autorizadas por Transbank.</p>
        </div>
      </div>
    </div>
  );
};

export default TransbankLogin;
