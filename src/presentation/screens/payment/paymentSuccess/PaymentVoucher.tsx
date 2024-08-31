// src/presentation/screens/payment/paymentVoucher/PaymentVoucher.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PaymentVoucher.module.css';

const PaymentVoucher: React.FC = () => {
  const location = useLocation();
  const [saleData, setSaleData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Extraer el JSON desde la query string
      const queryParams = new URLSearchParams(location.search);
      const data = queryParams.get('data');

      if (data) {
        const parsedData = JSON.parse(decodeURIComponent(data));
        setSaleData(parsedData);
      } else {
        setError('No se pudo obtener la información de la transacción.');
      }
    } catch (err) {
      console.error('Error al procesar los datos:', err);
      setError('Error al procesar los datos de la transacción.');
    }
  }, [location.search]);

  if (error) return <p>{error}</p>;
  if (!saleData) return <p>Cargando...</p>;

  const { sale_data, products } = saleData;

  return (
    <div className={styles.voucherContainer}>
      <h1>Comprobante de Pago</h1>
      <div className={styles.voucher}>
        <p className={styles.success}><strong>{saleData.status === "success" ? "Transacción Exitosa" : "Transacción Fallida"}</strong></p>
        <p><strong>Código de Venta:</strong> {sale_data.sale_code}</p>
        <p><strong>Fecha de Venta:</strong> {sale_data.sale_date}</p>
        <p><strong>Nombre del Cliente:</strong> {sale_data.client_name}</p>
        <p><strong>RUT:</strong> {sale_data.client_rut}</p>
        <p><strong>Teléfono:</strong> {sale_data.client_phone}</p>
        <p><strong>Email:</strong> {sale_data.client_mail}</p>
        <p><strong>Región:</strong> {sale_data.client_region}</p>
        <p><strong>Ciudad:</strong> {sale_data.client_city}</p>
        <p><strong>Dirección:</strong> {sale_data.address_name}, {sale_data.address_number}</p>
        <p><strong>Información Adicional:</strong> {sale_data.additional_info}</p>
        <p><strong>Método de Pago:</strong> {sale_data.payment_method}</p>
        <p><strong>Total Pagado:</strong> ${sale_data.total_price.toLocaleString()}</p>

        <h2>Productos Comprados:</h2>
        <ul className={styles.productList}>
          {products.map((product: any, index: number) => (
            <li key={index}>
              <strong>{product.name}</strong> - Cantidad: {product.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PaymentVoucher;
