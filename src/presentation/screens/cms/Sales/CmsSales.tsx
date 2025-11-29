import React from 'react';
import { useSalesViewModel } from './ViewModel';
import styles from './CmsSales.module.css';

const formatCLP = (n: number) =>
  n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-CL');
};

const CmsSales: React.FC = () => {
  const {
    sales,
    loading,
    error,
    UI_STATUS_OPTIONS,
    updateSaleStatusUI,
    productSummaryBySale,
  } = useSalesViewModel();

  if (loading) return <div className={styles.info}>Cargando ventas...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>Ventas realizadas</h2>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => {
              const uiStatus = sale.uiStatus; // calculado en el ViewModel
              const products = productSummaryBySale[sale.sale_code] ?? '—';
              return (
                <tr key={sale.sale_code}>
                  <td>{sale.sale_code}</td>
                  <td>{sale.client_name}</td>
                  <td>{formatCLP(sale.total_price)}</td>
                  <td>{formatDate(sale.sale_date)}</td>
                  <td>{products}</td>
                  <td>
                    <select
                      className={styles[`status-${uiStatus}`]}
                      value={uiStatus}
                      onChange={(e) => updateSaleStatusUI(sale.sale_code, e.target.value as typeof uiStatus)}
                    >
                      {UI_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CmsSales;
