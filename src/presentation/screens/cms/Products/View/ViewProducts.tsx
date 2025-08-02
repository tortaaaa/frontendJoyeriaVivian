import React, { useState } from 'react';
import styles from './ViewProducts.module.css';
import { useViewModel } from './ViewModel';
import { Link } from 'react-router-dom';
import BulkUploadModal from '../../../../components/BulkUploadModal';
import { ProductCrud } from '../../../../../domain/useCases/product/ProductCrud';

const ViewProducts: React.FC = () => {
  const { products, loading, error, toggleActivation } = useViewModel();

  const [showBulkModal, setShowBulkModal] = useState(false);

  const mapExcelRowToProduct = (row: any) => ({
    product_code: row.codigo_producto?.toString() ?? "",
    name: row.nombre ?? "",
    category: row.categoria ?? "",
    price: Number(row.precio) || 0,
    stock: Number(row.stock) || 0,
    description: row.descripcion ?? "",
    weight: Math.round((Number(row.peso) || 0) * 100) / 100,
    material: row.material ?? "",
    gemstone_type: row.tipo_piedra ?? "",
    gemstone_size: Number(row.tamanio_piedra) || 0,
    is_wedding: row.es_matrimonio === "TRUE" || row.es_matrimonio === true,
    is_men: row.es_hombre === "TRUE" || row.es_hombre === true,
    activated: row.activated === "TRUE" || row.activated === true,
    images: [],
  });

  const handleBulkFileLoaded = async (rows: any[]) => {
    try {
      const productsMapped = rows.map(mapExcelRowToProduct);
      const result = await ProductCrud.bulkUpload(productsMapped);

      alert(
        `Carga completada: ${result.created} creados, ${result.failed} fallidos` +
        (result.errors && result.errors.length ? `\nErrores:\n${JSON.stringify(result.errors, null, 2)}` : "")
      );
      window.location.reload();
    } catch (e) {
      alert("Error en la carga masiva. " + e);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Lista de Productos</h2>
      <div className={styles.headerBar}>
        <button
          className={styles.buttonPrimary}
          style={{ marginRight: '10px' }}
          onClick={() => setShowBulkModal(true)}
        >
          Carga Masiva (.xlsx)
        </button>
        <Link to="/cms/products/create" className={styles.buttonPrimary}>
          + Crear Producto
        </Link>
      </div>

      {/* Modal para carga masiva */}
      <BulkUploadModal
        show={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onFileLoaded={handleBulkFileLoaded}
      />

      {/* Manejo de estados */}
      {loading && (
        <div className={styles.info}>Cargando productos...</div>
      )}

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      <div className={styles.tableContainer}>
        {!loading && !error && products.length === 0 && (
          <div className={styles.info}>No hay productos registrados aún.</div>
        )}

        {!loading && !error && products.length > 0 && (
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
                      className={styles.buttonEdit}
                    >
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
        )}
      </div>
    </div>
  );
};

export default ViewProducts;
