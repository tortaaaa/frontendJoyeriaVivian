import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import styles from './Cart.module.css';
import cartIcon from '../../../assets/images/cartIcon.png';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import ErrorModal from '../../components/ErrorModal';

const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart, addToCart, getTotalPrice, updateCartInformation } = useContext(CartContext) || {};
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  useEffect(() => {
    updateCartInformation();
  }, []);

  const cartSchema = Yup.object().shape({
    cart: Yup.array()
      .min(1, 'El carrito está vacío.')
      .required('El carrito es requerido.')
  });

  const handleIncrement = (item: any) => {
    addToCart({ ...item, quantity: 1 });
  };

  const handleDecrement = (item: any) => {
    if (item.quantity > 1) {
      addToCart({ ...item, quantity: -1 });
    }
  };

  const handlePaymentClick = async () => {
    try {
      await cartSchema.validate({ cart });

      const hasChanges = await updateCartInformation();

      if (hasChanges || cart.some(item => item.stock === 0)) {
        setShowErrorModal(true);
        return;
      }

      if (getTotalPrice() <= 0) {
        setShowWarning('El total del precio no puede ser 0 o menor.');
        return;
      }

      setShowWarning(null);
      // Pasar el total_amount, los datos del carrito (productos y cantidades) como estado a PaymentData
      navigate('/payment-data', { 
        state: { 
          totalAmount: getTotalPrice(), 
          cartItems: cart.map(item => ({
            product_code: item.product_code,
            quantity: item.quantity,
          })) 
        } 
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setShowWarning(error.message);
      }
    }
  };

  return (
    <div className={styles.cart}>
      {showErrorModal && (
        <ErrorModal
          message="Hubo cambios en el stock o precio de los productos. Por favor, revisa tu carrito nuevamente."
          onClose={() => setShowErrorModal(false)}
        />
      )}
      <div className={styles.checkoutSteps}>
        <span className={styles.activeStep}>CARRITO</span>
        <FaArrowRight className={styles.arrowIcon} />
        <span>DATOS DEL COMPRADOR</span>
        <FaArrowRight className={styles.arrowIcon} />
        <span>PROCESO DE PAGO</span>
        <FaArrowRight className={styles.arrowIcon} />
        <span>COMPROBANTE</span>
      </div>
      <div className={styles.cartContent}>
        <div className={styles.cartItemsContainer}>
          <h1>Carrito de Compras</h1>
          {cart && cart.length > 0 ? (
            <div className={styles.cartItems}>
              {cart.map(item => (
                <div key={item.product_code} className={styles.cartItem}>
                  <img src={item.images[0]} alt={`Producto ${item.product_code}`} className={styles.cartItemImage} />
                  <div className={styles.cartItemDetails}>
                    <h2>{item.name}</h2>
                    <h4>{item.description}</h4>
                    <h4>Código de producto: {item.product_code}</h4>
                    <h4>${item.price.toLocaleString()} CLP</h4>
                    {item.stock < 1 && <p className={styles.outOfStock}>Producto sin stock</p>}
                    <div className={styles.cartItemControls}>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() => handleDecrement(item)}
                          disabled={item.quantity <= 1 || item.stock === 0}
                          className={item.stock === 0 ? styles.disabledButton : ''}
                        >
                          -
                        </button>
                        <span>{item.stock > 0 ? item.quantity : 0}</span>
                        <button
                          onClick={() => handleIncrement(item)}
                          disabled={item.quantity >= item.stock || item.stock === 0}
                          className={item.stock === 0 ? styles.disabledButton : ''}
                        >
                          +
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.product_code)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>El carrito está vacío.</p>
          )}
          <div className={styles.cartSummary}>
            <div className={styles.total}>Total de Productos: {cart.reduce((total, item) => total + item.quantity, 0)}</div>
            <button onClick={clearCart} className={styles.checkoutButton}>Vaciar Carrito</button>
          </div>
        </div>
        <div className={styles.cartPayment}>
          <div className={styles.paymentDetails}>
            <img src={cartIcon} alt="Carrito" className={styles.cartIcon} />
            <div className={styles.totalPrice}>Total: ${getTotalPrice().toLocaleString()} CLP</div>
          </div>
          <button
            className={getTotalPrice() <= 0 ? `${styles.payButton} ${styles.disabledButton}` : styles.payButton}
            onClick={handlePaymentClick}
            disabled={getTotalPrice() <= 0}
          >
            Pagar
          </button>
          {showWarning && <p className={styles.warning}>{showWarning}</p>}
        </div>
      </div>
    </div>
  );
};

export default Cart;
