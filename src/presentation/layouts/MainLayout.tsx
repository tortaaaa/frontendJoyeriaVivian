import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './MainLayout.module.css';

const MainLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Navbar />

      <main className={styles.content}>
        {/* Contenido principal de la página */}
        {children}

      </main>

      <Footer />
    </div>
  );
};


export default MainLayout;
