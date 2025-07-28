import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard CMS</h1>

      <div className={styles.cardContainer}>
        <Link to="/cms/products" className={styles.card}>
          <h2>Gestión de Productos</h2>
          <p>Crear, editar, activar/desactivar productos.</p>
        </Link>

        <Link to="/cms/images" className={styles.card}>
          <h2>Gestión de Imágenes</h2>
          <p>Sube y administra imágenes de productos.</p>
        </Link>

        <Link to="/cms/sales" className={styles.card}>
          <h2>Gestión de Ventas</h2>
          <p>Revisa y actualiza estados de ventas realizadas.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
