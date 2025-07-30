// src/presentation/screens/payment/paymentFail/PaymentFail.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentFail.module.css';

const PaymentFail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const status = queryParams.get('status');
  const message = queryParams.get('message');

  let displayMessage = 'Lamentablemente, no pudimos procesar tu pago. Intenta nuevamente más tarde.';

  if (status === 'canceled') {
    displayMessage = 'Has cancelado el pago. Si fue un error, puedes intentarlo nuevamente.';
  } else if (status === 'rejected') {
    displayMessage = `Transacción rechazada${message ? `: ${message}` : '.'}`;
  }

  return (
    <div className={styles.voucherContainer}>
      <div className={styles.voucher}>
        <p className={styles.success} style={{ color: 'red' }}>
          <strong>Transacción Fallida</strong>
        </p>
        <p>{displayMessage}</p>
        <button onClick={() => navigate('/')} className={styles.button}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default PaymentFail;
