// src/presentation/screens/cart/Cart.tsx
import React, { useEffect, useState } from 'react';
import { useCart, type CartItem } from '../../context/CartContext';
import styles from './Cart.module.css';
import cartIcon from '../../../assets/images/cartIcon.png';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import ErrorModal from '../../components/ErrorModal';

const Cart: React.FC = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    addToCart,
    getTotalPrice,
    updateCartInformation,
  } = useCart();

  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    let alive = true;

    const sync = async () => {
      setIsSyncing(true);
      const hasChanges = await updateCartInformation();
      if (!alive) return;
      if (hasChanges || cart.some(item => item.stock === 0)) {
        setShowErrorModal(true);
      }
      setIsSyncing(false);
    };

    void sync();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cartSchema = Yup.object().shape({
    cart: Yup.array()
      .min(1, 'El carrito está vacío.')
      .required('El carrito es requerido.'),
  });

  const handleIncrement = (item: CartItem) => {
    if (isSyncing) return;
    addToCart({ ...item, quantity: 1 });
  };

  const handleDecrement = (item: CartItem) => {
    if (isSyncing) return;
    if (item.quantity > 1) {
      addToCart({ ...item, quantity: -1 });
    }
  };

  const handlePaymentClick = async () => {
    try {
      await cartSchema.validate({ cart });

      setIsSyncing(true);
      const hasChanges = await updateCartInformation();
      setIsSyncing(false);

      if (hasChanges || cart.some(item => item.stock === 0)) {
        setShowErrorModal(true);
        return;
      }

      const totalPrice = getTotalPrice();
      if (totalPrice <= 0) {
        setShowWarning('El total del precio no puede ser 0 o menor.');
        return;
      }

      setShowWarning(null);

      navigate('/payment-data', {
        state: {
          totalAmount: totalPrice,
          cartItems: cart.map(item => ({
            product_code: item.product_code,
            quantity: item.quantity,
          })),
        },
      });
    } catch (error) {
      setIsSyncing(false);
      if (error instanceof Yup.ValidationError) {
        setShowWarning(error.message);
      }
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <div className={styles.cart}>
      {showErrorModal && (
        <ErrorModal
          message="Hubo cambios en el stock o precio de los productos. Por favor, revisa tu carrito nuevamente."
          onClose={() => setShowErrorModal(false)}
        />
      )}

      <div className={styles.checkoutSteps}>
        <span className={styles.activeStep}>Carrito</span>
        <FaArrowRight className={styles.arrowIcon} />
        <span className={styles.activeStep}>Detalles de compra</span>
        <FaArrowRight className={styles.arrowIcon} />
        <span className={styles.activeStep}>Procesando el pago</span>
        <FaArrowRight className={styles.arrowIcon} />
        <span className={styles.activeStep}>Comprobante</span>
      </div>

      <div className={styles.cartContent}>
        <div className={styles.cartItemsContainer}>
          <h2>Carrito de Compras</h2>

          {cart.length > 0 ? (
            <div className={styles.cartItems}>
              {cart.map(item => (
                <div key={item.product_code} className={styles.cartItem}>
                  <img
                    src={item.images?.[0] ?? cartIcon}
                    alt={`Producto ${item.product_code}`}
                    className={styles.cartItemImage}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = cartIcon; }}
                  />
                  <div className={styles.cartItemDetails}>
                    <h4>Código de producto: {item.product_code}</h4>
                    <h2
                      onClick={() => navigate(`/product/${item.product_code}`)}
                      title="Ver detalles del producto"
                      style={{ cursor: 'pointer' }}
                    >
                      {item.name}
                    </h2>
                    <h4>{item.description}</h4>
                    <h4>${item.price.toLocaleString('es-CL')} CLP</h4>
                    {item.stock < 1 && (
                      <p className={styles.outOfStock}>Producto sin stock</p>
                    )}

                    <div className={styles.cartItemControls}>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() => handleDecrement(item)}
                          disabled={isSyncing || item.quantity <= 1 || item.stock === 0}
                        >
                          -
                        </button>

                        <span style={{ color: 'black' }}>
                          {item.stock > 0 ? item.quantity : 0}
                        </span>

                        <button
                          onClick={() => handleIncrement(item)}
                          disabled={isSyncing || item.quantity >= item.stock || item.stock === 0}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product_code)}
                        disabled={isSyncing}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>El carrito está vacío.</p>
          )}

          <div className={styles.cartSummary}>
            <div className={styles.total}>
              Total de Productos:{' '}
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </div>
            <button onClick={clearCart} className={styles.checkoutButton} disabled={isSyncing}>
              Vaciar Carrito
            </button>
          </div>
        </div>

        <div className={styles.cartPayment}>
          <div className={styles.paymentDetails}>
            <img src={cartIcon} alt="Carrito" className={styles.cartIcon} />
            <div className={styles.total}>
              Total: ${totalPrice.toLocaleString('es-CL')} CLP
            </div>
          </div>

          <button
            className={totalPrice <= 0 ? `${styles.payButton} ${styles.disabledButton}` : styles.payButton}
            onClick={handlePaymentClick}
            disabled={isSyncing || totalPrice <= 0}
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
