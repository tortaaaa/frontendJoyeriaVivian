import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../assets/images/pageLogo.png';
import cartIcon from '../../assets/images/cartIcon.png';
import { CartContext } from '../context/CartContext';
import CartNotification from './CartNotification';
import ProductSearch from '../components/ProductSearch';
import { useLocation, useNavigate } from 'react-router-dom';
import logoutIcon from '../../assets/images/logoutIcon.png';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('transbank_token');
    navigate('/transbank-login');
  };

  const { getTotalItems, notification } = useContext(CartContext) || {};
  const totalItems = getTotalItems ? getTotalItems() : 0;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header>
      <div className={styles.topNavbar}>

        <div className={styles.logoUserContainer}>
          <a href="/">
            <img src={logo} alt="Joyería Vivian" className={styles.logo} />
          </a>
          {localStorage.getItem('transbank_token') && (
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <img src={logoutIcon} alt="" className={styles.logoutIcon} />
            </button>
          )}
        </div>

        <div className={styles.cartMenuContainer}>
          <ProductSearch />
          <a href="/cart" className={styles.cartLink}>
            <img src={cartIcon} alt="Carrito" className={styles.cartIcon} />
            {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
          </a>
          <button
            ref={buttonRef}
            className={styles.menuButton}
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <span className={styles.menuIcon}>&#9776;</span>
          </button>
        </div>

      </div>

      <nav
        ref={menuRef}
        className={`${styles.bottomNavbar} ${isMenuOpen ? styles.showMenu : ''}`}
      >
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
