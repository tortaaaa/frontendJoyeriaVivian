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

        <Link to="/cms/sales" className={styles.card}>
          <h2>Gestión de Ventas</h2>
          <p>Administra las ventas.</p>
        </Link>

      </div>
    </div>
  );
};

export default Dashboard;
