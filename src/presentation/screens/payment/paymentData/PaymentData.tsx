import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './PaymentData.module.css';
import { FaArrowRight } from 'react-icons/fa';
import { PaymentUseCase } from '../../../../domain/useCases/payment/PaymentUseCase';
import { PaymentRepositoryImpl } from '../../../../data/repositories/PaymentRepository';
import usePaymentViewModel from './ViewModel';
import RedirectModal from '../../../components/RedirectModal';

const paymentRepository = new PaymentRepositoryImpl();
const paymentUseCase = new PaymentUseCase(paymentRepository);

const PaymentData: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { paymentData, handleChange, validateForm, errors } = usePaymentViewModel();

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<Array<{ product_code: string; quantity: number }>>([]);

  useEffect(() => {
    const state = location.state as { totalAmount: number, cartItems: Array<{ product_code: string, quantity: number }> };
    if (state?.totalAmount && state?.cartItems) {
      setTotalAmount(state.totalAmount);
      setCartItems(state.cartItems);
    } else {
      navigate('/cart');
    }
  }, [location, navigate]);

  const handleBack = () => navigate(-1);

  const [isRedirecting, setIsRedirecting] = useState(false);

  const handlePayment = async () => {
    if (!validateForm()) return;

    const dataToSend = { ...paymentData, total_amount: totalAmount, cart_items: cartItems };

    try {
      setIsRedirecting(true);  
      const response = await paymentUseCase.initiateTransaction(dataToSend);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = response.url;

      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'token_ws';
      tokenInput.value = response.token;
      form.appendChild(tokenInput);
      document.body.appendChild(form);

      form.submit();
      //navigate(`/payment-voucher?sale_code=${response.buy_order}`);
    } catch (error) {
      setIsRedirecting(false);
      console.error('Error al iniciar la transacción:', error);
      navigate('/payment-fail', {
        state: { message: 'No se pudo iniciar la transacción. Por favor, inténtelo nuevamente.' },
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topPage}>
        <div className={styles.checkoutSteps}>
          <span>CARRITO</span>
          <FaArrowRight className={styles.arrowIcon} />
          <span className={styles.activeStep}>DATOS DEL COMPRADOR</span>
          <FaArrowRight className={styles.arrowIcon} />
          <span>PROCESO DE PAGO</span>
          <FaArrowRight className={styles.arrowIcon} />
          <span>COMPROBANTE</span>
        </div>
      </div>

      <div className={styles.back}>
        <button onClick={handleBack} className={styles.backButton}>
          <span>&#9664; Volver</span>
        </button>
      </div>

      <h2>Información de Envío</h2>

      <div className={styles.form}>
        <input type="text" placeholder="Nombre y Apellido" name="client_name" className={styles.inputField} onChange={handleChange} />
        {errors.client_name && <span className={styles.error}>{errors.client_name}</span>}

        <input type="text" placeholder="RUT" name="client_rut" className={styles.inputField} onChange={handleChange} />
        {errors.client_rut && <span className={styles.error}>{errors.client_rut}</span>}

        <input type="text" placeholder="Número de teléfono" name="client_phone" className={styles.inputField} onChange={handleChange} />
        {errors.client_phone && <span className={styles.error}>{errors.client_phone}</span>}

        <input type="email" placeholder="Correo" name="client_mail" className={styles.inputField} onChange={handleChange} />
        {errors.client_mail && <span className={styles.error}>{errors.client_mail}</span>}

        <input type="text" placeholder="Región" name="client_region" className={styles.inputField} onChange={handleChange} />
        {errors.client_region && <span className={styles.error}>{errors.client_region}</span>}

        <input type="text" placeholder="Ciudad" name="client_city" className={styles.inputField} onChange={handleChange} />
        {errors.client_city && <span className={styles.error}>{errors.client_city}</span>}

        <input type="text" placeholder="Nombre de Dirección" name="address_name" className={styles.inputField} onChange={handleChange} />
        {errors.address_name && <span className={styles.error}>{errors.address_name}</span>}

        <input type="text" placeholder="Número de Dirección" name="address_number" className={styles.inputField} onChange={handleChange} />
        {errors.address_number && <span className={styles.error}>{errors.address_number}</span>}

        <textarea placeholder="Información adicional" name="additional_info" className={styles.textAreaField} onChange={handleChange}></textarea>
      </div>

      <div className={styles.paymentSection}>
        <h3>Continuar al pago</h3>
        <button onClick={handlePayment} className={styles.paymentButton}>Pagar</button>
      </div>
      <RedirectModal isOpen={isRedirecting}/>
    </div>
  );
};

export default PaymentData;
