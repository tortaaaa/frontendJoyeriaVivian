import React from 'react';
import { useSalesViewModel } from './ViewModel';
import styles from './CmsSales.module.css';

const CmsSales: React.FC = () => {
    const { sales, loading, error, STATUS_OPTIONS, updateSaleStatus } = useSalesViewModel();

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
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale) => (
                            <tr key={sale.sale_code}>
                                <td>{sale.sale_code}</td>
                                <td>{sale.client_name}</td>
                                <td>${sale.total_price}</td>
                                <td>{sale.sale_date}</td>
                                <td>
                                    <select
                                        className={styles[`status-${sale.status}`]}
                                        value={sale.status}
                                        onChange={(e) =>
                                            updateSaleStatus(sale.sale_code, e.target.value as typeof sale.status)
                                        }
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    {/* Aquí puedes poner botones, por ejemplo: */}
                                    {/* <button className={styles.button}>Detalle</button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CmsSales;
