import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const handleContactClick = () => {
    window.location.href = '/contact';
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <button className={styles.contactButton} onClick={handleContactClick}>
          Contáctanos
        </button>
      </div>
      <div className={styles.center}>
      </div>
      <div className={styles.right}>
        <p>
          &copy; 2024 Joyería Vivian<br />
          Manuel Antonio Matta 2325, Antofagasta
          <a
            href="https://maps.app.goo.gl/SzV3S7oNLHZhnS5E9"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.locationLink}
          >
            <FaMapMarkerAlt className={styles.locationIcon} />
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
