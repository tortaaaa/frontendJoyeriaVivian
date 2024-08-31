import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './PaymentData.module.css';
import { FaArrowRight } from 'react-icons/fa';
import { PaymentUseCase } from '../../../../domain/useCases/payment/PaymentUseCase';
import { PaymentRepositoryImpl } from '../../../../data/repositories/PaymentRepository';

const PaymentData: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentRepository = new PaymentRepositoryImpl();
  const paymentUseCase = new PaymentUseCase(paymentRepository);

  const [paymentData, setPaymentData] = useState({
    client_name: '',
    client_rut: '',
    client_phone: '',
    client_mail: '',
    client_region: '',
    client_city: '',
    address_name: '',
    address_number: '',
    additional_info: ''
  });

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<Array<{ product_code: string; quantity: number }>>([]);

  useEffect(() => {
    const state = location.state as { totalAmount: number, cartItems: Array<{ product_code: string, quantity: number }> };
    if (state?.totalAmount && state?.cartItems) {
      setTotalAmount(state.totalAmount);
      setCartItems(state.cartItems);
    } else {
      navigate('/cart'); // Si no se recibe la información necesaria, redirigir al carrito
    }
  }, [location, navigate]);

  const handleBack = () => {
    navigate(-1); // Regresa a la pantalla anterior
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPaymentData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    try {
      const dataToSend = { ...paymentData, total_amount: totalAmount, cart_items: cartItems };

      const response = await paymentUseCase.initiateTransaction(dataToSend);
      console.log('Transacción iniciada', response);

      // Crear un formulario dinámico y enviarlo a Webpay
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = response.url;

      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'token_ws';
      tokenInput.value = response.token;

      form.appendChild(tokenInput);
      document.body.appendChild(form);

      form.submit(); // Enviar el formulario

      // Guardar el sale_code en el estado de navegación para utilizarlo en PaymentVoucher
      navigate(`/payment-voucher?sale_code=${response.buy_order}`);

    } catch (error) {
      console.error('Error al iniciar la transacción', error);
      navigate('/payment-fail', {
        state: {
          message: 'No se pudo iniciar la transacción. Por favor, inténtelo nuevamente.',
        },
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
        <input type="text" placeholder="RUT" name="client_rut" className={styles.inputField} onChange={handleChange} />
        <input type="text" placeholder="Número de teléfono" name="client_phone" className={styles.inputField} onChange={handleChange} />
        <input type="email" placeholder="Correo" name="client_mail" className={styles.inputField} onChange={handleChange} />
        <input type="text" placeholder="Región" name="client_region" className={styles.inputField} onChange={handleChange} />
        <input type="text" placeholder="Ciudad" name="client_city" className={styles.inputField} onChange={handleChange} />
        <input type="text" placeholder="Nombre de Dirección" name="address_name" className={styles.inputField} onChange={handleChange} />
        <input type="text" placeholder="Número de Dirección" name="address_number" className={styles.inputField} onChange={handleChange} />
        <textarea placeholder="Información adicional" name="additional_info" className={styles.textAreaField} onChange={handleChange}></textarea>
      </div>
      <div className={styles.paymentSection}>
        <h3>Continuar al pago</h3>
        <button onClick={handlePayment} className={styles.paymentButton}>Pagar</button>
      </div>
    </div>
  );
};

export default PaymentData;
