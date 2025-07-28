// src/presentation/layouts/CmsLayout.tsx
import React from 'react';
import styles from './CmsLayout.module.css';

const CmsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.cmsRoot}>
      {/* Navbar superior */}
      <header className={styles.navbar}>
        <div className={styles.navTitle}>CMS Joyería Vivian</div>
        {/* Aquí puedes poner usuario, botón logout, etc. */}
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar izquierdo */}
        <aside className={styles.sidebar}>
          <nav>
            <ul>
              <li><a href="/cms/dashboard">Dashboard</a></li>
              <li><a href="/cms/products">Productos</a></li>
              <li><a href="/cms/images">Imágenes</a></li>
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
