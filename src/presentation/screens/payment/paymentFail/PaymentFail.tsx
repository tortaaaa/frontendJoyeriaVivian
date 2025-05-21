import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentFail.module.css';

const PaymentFail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const status = query.get('status');
  const message = query.get('message');

  const getMessage = () => {
    if (status === 'canceled') {
      return 'La transacción fue cancelada por el usuario. Si deseas intentarlo de nuevo, por favor realiza el pago nuevamente.';
    }
    if (status === 'rejected') {
      return `La transacción fue rechazada. Motivo: ${message || 'Desconocido'}. Por favor, inténtelo de nuevo o utilice otro método de pago.`;
    }
    return 'Hubo un error durante el proceso de pago. Por favor, inténtelo de nuevo.';
  };

  const handleRetry = () => {
    navigate('/cart'); // Redirigir al carrito para reintentar
  };

  return (
    <div className={styles.container}>
      <h2>Pago Fallido</h2>
      <p>{getMessage()}</p>
      <button onClick={handleRetry} className={styles.retryButton}>
        Volver al Carrito
      </button>
    </div>
  );
};

export default PaymentFail;
