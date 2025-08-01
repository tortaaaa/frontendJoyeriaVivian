import React from 'react';
import styles from './ViewProducts.module.css';
import { useViewModel } from './ViewModel';
import { Link } from 'react-router-dom';

const ViewProducts: React.FC = () => {
  const { products, loading, error, toggleActivation } = useViewModel();

  if (loading) return <div className={styles.info}>Cargando productos...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>Lista de Productos</h2>
      <div className={styles.headerBar}>
        <Link to="/cms/products/create" className={styles.buttonPrimary}>+ Crear Producto</Link>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.product_code}>
                <td>{p.product_code}</td>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>
                  <span className={p.activated ? styles.active : styles.inactive}>
                    {p.activated ? "Sí" : "No"}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/cms/products/edit/${p.product_code}`}
                    className={styles.buttonEdit}>
                    Editar
                  </Link>
                  <button
                    onClick={() => toggleActivation(p.product_code)}
                    className={styles.buttonToggle}
                  >
                    {p.activated ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewProducts;
