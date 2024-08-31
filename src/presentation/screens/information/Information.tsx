import React from 'react';
import styles from './Information.module.css';

const Information: React.FC = () => {
  return (
    <div className={styles.information}>
      <h1>Information</h1>
      <p>This is the information page.</p>
    </div>
  );
};

export default Information;
