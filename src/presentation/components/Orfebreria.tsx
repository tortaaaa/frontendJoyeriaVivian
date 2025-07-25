
import React from 'react';
import styles from './Orfebreria.module.css';

const Orfebreria: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Servicios de Orfebrería</h1>
        <p className={styles.text}>
          Se realizan hechuras y fabricación de joyas en oro, engastes de piedras y reparaciones.
        </p>
        <p className={styles.text}>
          <strong>Se ofrecen servicios de orfebrería a joyerías.</strong>
        </p>
      </div>
    </div>
  );
};

export default Orfebreria;