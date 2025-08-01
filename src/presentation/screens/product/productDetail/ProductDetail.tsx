// src/views/screens/ProductDetail.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Slider from "react-slick";
import styles from './ProductDetail.module.css';
import { sliderSettings, getProductDetail } from './ViewModel';
import { CartContext } from '../../../context/CartContext';
import { Product } from '../../../../domain/entities/Product';
import Spinner from '../../../components/Spinner';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetail: React.FC = () => {
  const { product_code } = useParams<{ product_code: string }>();
  const { addToCart } = React.useContext(CartContext) || {};
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getProductDetail(product_code!);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('[ERROR] Fallo al cargar el producto:', error);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [product_code]);

  const handleAddToCart = () => {
    if (addToCart && product) {
      addToCart({ ...product, quantity: 1 });
    }
  };

  const handleThumbnailClick = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Producto no encontrado.</p>;

  const isOutOfStock = product.stock === 0;

  return (
    <div className={styles.productDetail}>
      <div className={styles.imageSection}>
        {product.images.length > 1 ? (
          <>
            <Slider ref={sliderRef} {...sliderSettings} className={styles.slider}>
              {product.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={product.name}
                    className={styles.productImage}
                  />
                </div>
              ))}
            </Slider>

            <div className={styles.thumbnailContainer}>
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={styles.thumbnail}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          </>
        ) : (
          <img
            src={product.images[0]}
            alt={product.name}
            className={styles.productImage}
          />
        )}
      </div>

      <div className={styles.infoSection}>
        <h1>{product.name}</h1>
        <h2>Modelo {product.product_code}</h2>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.price}>${product.price.toLocaleString()} CLP</p>
        {isOutOfStock && <p className={styles.outOfStockMessage}>Agotado</p>}
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.buyButton} ${isOutOfStock ? styles.disabled : ''}`}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            Compra Ya
          </button>
          <button
            className={`${styles.cartButton} ${isOutOfStock ? styles.disabled : ''}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
