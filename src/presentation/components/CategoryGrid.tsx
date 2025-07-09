import React from 'react';
import styles from './CategoryGrid.module.css';

interface Category {
  name: string;
  image: string;
}

const categories: Category[] = [
  { name: 'Necklaces & Pendants', image: '/images/categories/necklaces.jpg' },
  { name: 'Earrings', image: '/images/categories/earrings.jpg' },
  { name: 'Rings', image: '/images/categories/rings.jpg' },
  { name: 'Bracelets', image: '/images/categories/bracelets.jpg' },
];

const CategoryGrid: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2>Shop by Category</h2>
      <p className={styles.description}>
        Tiffany & Co. designs feature the world’s finest diamonds and unparalleled craftsmanship—
        signatures of the House for almost two centuries.
      </p>
      <div className={styles.grid}>
        {categories.map((cat, index) => (
          <div className={styles.item} key={index}>
            <img src={cat.image} alt={cat.name} />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
