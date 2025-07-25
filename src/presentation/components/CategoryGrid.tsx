import React from 'react';
import styles from './CategoryGrid.module.css';
import { Link } from 'react-router-dom';
const images = [
  { name: 'Cadenas', image: '/images/categories/joya1.jpg', path: '/products/cadenas' },
  { name: 'Anillos', image: '/images/categories/joya2.jpg', path: '/products/anillos' },
  { name: 'Aros', image: '/images/categories/joya3.jpg', path: '/products/aros' },
  { name: 'Pulseras', image: '/images/categories/joya4.jpg', path: '/products/pulseras' },
  { name: 'Anillos de Matrimonio', image: '/images/categories/joya5.jpg', path: '/products/matrimonio' },
];

const loopImages = [...images, ...images];

const CategoryGrid: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Encuentra lo que estás buscando</h2>
      <div className={styles.carouselWrapper}>
        <div className={styles.carousel}>
          {loopImages.map((item, idx) => (
            <Link key={idx} to={item.path} className={styles.link}>
              <div className={styles.slide}>
                <img src={item.image} alt={item.name} />
                <p className={styles.categoryName}>{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;