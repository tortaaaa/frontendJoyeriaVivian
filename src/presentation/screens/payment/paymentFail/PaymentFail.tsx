// src/presentation/screens/payment/paymentFail/PaymentFail.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentFail: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const message = queryParams.get('message');

  return (
    <div>
      <h1>Pago Fallido</h1>
      <p>{message || 'La transacción no pudo ser completada. Por favor, intente nuevamente.'}</p>
    </div>
  );
};

export default PaymentFail;
