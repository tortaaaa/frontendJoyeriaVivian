// src/presentation/components/Navbar.tsx

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../assets/images/pageLogo.png';
import cartIcon from '../../assets/images/cartIcon.png';
import { CartContext } from '../context/CartContext'; // Asegúrate de que la ruta sea correcta
import CartNotification from './CartNotification';

const Navbar: React.FC = () => {
  const { getTotalItems, notification } = useContext(CartContext) || {};
  const totalItems = getTotalItems ? getTotalItems() : 0;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className={styles.topNavbar}>
        <a href="/">
          <img src={logo} alt="Joyería Vivian" className={styles.logo} />
        </a>
        <input type="text" placeholder="Buscar producto" className={styles.searchInput} />
        <a href="/cart" className={styles.cartLink}>
          <img src={cartIcon} alt="Carrito" className={styles.cartIcon} />
          {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
        </a>
        <button className={styles.menuButton} onClick={toggleMenu}>
          <span className={styles.menuIcon}>&#9776;</span>
        </button>
      </div>
      <nav className={`${styles.bottomNavbar} ${isMenuOpen ? styles.showMenu : ''}`}>
        <ul className={styles.navLinks}>
          <li><a href="/products/matrimonio">Matrimonio</a></li>
          <li><a href="/products/anillos">Anillos</a></li>
          <li><a href="/products/aros">Aros</a></li>
          <li><a href="/products/Aros para bebés">Aros Bebés</a></li>
          <li><a href="/products/cadenas">Cadenas</a></li>
          <li><a href="/products/pulseras">Pulseras</a></li>
          <li><a href="/products/colgantes">Colgantes</a></li>
          <li><a href="/products/Joyas para hombres">Hombres</a></li>
          <li><Link to="/Orfebreria">Servicios de Orfebrería</Link></li>
          <li><a href="/">¿Quiénes Somos?</a></li>
        </ul>
      </nav>
      {notification && notification.visible && (
        <CartNotification product={notification.product} />
      )}
    </header>
  );
};

export default Navbar;
