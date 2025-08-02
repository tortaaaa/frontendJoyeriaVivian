import React from 'react';
import styles from './CmsLayout.module.css';
import { useNavigate } from 'react-router-dom';

const CmsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('cms_token'); // Limpia token
    navigate('/cms/login', { replace: true }); // Redirige al login
  };

  return (
    <div className={styles.cmsRoot}>
      {/* Navbar superior */}
      <header className={styles.navbar}>
        <div className={styles.navTitle}>CMS Joyería Vivian</div>
        <button
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar izquierdo */}
        <aside className={styles.sidebar}>
          <nav>
            <ul>
              <li><a href="/cms/dashboard">Dashboard</a></li>
              <li><a href="/cms/products">Productos</a></li>
              <li><a href="/cms/sales">Ventas</a></li>
              {/* Puedes añadir más links aquí */}
            </ul>
          </nav>
        </aside>

        {/* Contenido dinámico */}
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>© 2024 CMS Joyería Vivian — Todos los derechos reservados</span>
      </footer>
    </div>
  );
};

export default CmsLayout;
