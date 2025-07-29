import React from 'react';
import Spinner from './Spinner';
import styles from './RedirectModal.module.css';

interface RedirectModalProps {
  isOpen: boolean;
  message?: string;
}

const RedirectModal: React.FC<RedirectModalProps> = ({ isOpen, message = "Estás siendo redirigido a Webpay..." }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <Spinner />
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export default RedirectModal;
