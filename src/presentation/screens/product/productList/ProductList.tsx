import React, { useState, useContext, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import styles from './ProductList.module.css';
import fetchProductsByCategory from './ViewModel';
import { CartContext } from '../../../context/CartContext';
import { Product } from '../../../../domain/entities/Product';
import Spinner from '../../../components/Spinner'; // Importa el componente Spinner
import defaultImage from '../../../../assets/images/JoyeriaVivianLogo2.jpg'; // Importa la imagen predeterminada

const ProductList: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [materialFilter, setMaterialFilter] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([]);
  const [searchTerm] = useState('');
  const productsPerPage = 12;
  const { addToCart } = useContext(CartContext) || {};

  const categoryMapping: Record<string, string> = {
    anillos: 'ring',
    pulseras: 'bracelet',
    aros: 'earring',
    cadenas: 'chain',
    colgantes: 'pendant',
    'Aros para bebés': 'ring'
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const mappedCategory = categoryMapping[category || 'ring'];
        console.log(`[INFO] Cargando productos de la categoría: ${mappedCategory}`);
        const fetchedProducts = await fetchProductsByCategory(mappedCategory);
        setProducts(fetchedProducts);
        setLoading(false);
        console.log('[INFO] Productos cargados con éxito:', fetchedProducts);
      } catch (error) {
        console.error('[ERROR] Fallo al cargar los productos:', error);
        setError('Failed to load products');
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const applyFilters = (product: Product) => {
    if (category === 'Aros para bebés' && !product.is_baby) {
      return false;
    }

    const priceMatch = priceFilter.length === 0 || priceFilter.some(range => {
      const [min, max] = range.split('-').map(Number);
      return product.price >= min && product.price <= max;
    });

    const materialMatch = materialFilter.length === 0 || materialFilter.includes(product.material.toLowerCase());

    const availabilityMatch = availabilityFilter.length === 0 || (
      (availabilityFilter.includes('in-stock') && product.stock > 0) ||
      (availabilityFilter.includes('out-of-stock') && product.stock === 0)
    );

    const categoryMatch = !category || (
      (category === 'matrimonio' && product.is_wedding) ||
      (category === 'anillos' && product.category === 'ring') ||
      (category === 'aros' && product.category === 'earring') ||
      (category === 'Aros para bebés' && product.is_baby && product.category === 'ring') ||
      (category === 'cadenas' && product.category === 'chain') ||
      (category === 'pulseras' && product.category === 'bracelet') ||
      (category === 'colgantes' && product.category === 'pendant') ||
      (category === 'hombres' && product.is_men)
    );

    const searchMatch = searchTerm === '' || (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.material.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return priceMatch && materialMatch && availabilityMatch && categoryMatch && searchMatch;
  };

  const currentProducts = products.filter(applyFilters).slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.filter(applyFilters).length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePriceFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setPriceFilter([...priceFilter, value]);
    } else {
      setPriceFilter(priceFilter.filter(item => item !== value));
    }
  };

  const handleMaterialFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setMaterialFilter([...materialFilter, value]);
    } else {
      setMaterialFilter(materialFilter.filter(item => item !== value));
    }
  };

  const handleAvailabilityFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setAvailabilityFilter([...availabilityFilter, value]);
    } else {
      setAvailabilityFilter(availabilityFilter.filter(item => item !== value));
    }
  };

  // Usamos window.location.href para forzar una recarga completa
  const handleProductClick = (producto: Product) => {
    window.location.href = `/product/${producto.product_code}`;
  };

  const handleAddToCart = (product: Product) => {
    if (addToCart) {
      addToCart({ ...product, quantity: 1 });
    }
  };

  if (loading) return <Spinner />;

  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <button className={styles.hamburger} onClick={toggleFilters}>
        &#9776;
      </button>
      <aside className={`${styles.filters} ${showFilters ? styles.show : ''}`}>
        <h2>Filtros</h2>
        <div className={styles.filterSection}>
          <h3>Rango de precios</h3>
          <label>
            <input type="checkbox" name="price" value="0-100000" onChange={handlePriceFilterChange} />
            $0 - $100.000
          </label>
          <label>
            <input type="checkbox" name="price" value="100000-200000" onChange={handlePriceFilterChange} />
            $100.000 - $200.000
          </label>
          <label>
            <input type="checkbox" name="price" value="200000-300000" onChange={handlePriceFilterChange} />
            $200.000 - $300.000
          </label>
          <label>
            <input type="checkbox" name="price" value="300000-400000" onChange={handlePriceFilterChange} />
            $300.000 - $400.000
          </label>
        </div>
        <div className={styles.filterSection}>
          <h3>Material</h3>
          <label>
            <input type="checkbox" name="material" value="gold" onChange={handleMaterialFilterChange} />
            Oro
          </label>
          <label>
            <input type="checkbox" name="material" value="silver" onChange={handleMaterialFilterChange} />
            Plata
          </label>
          <label>
            <input type="checkbox" name="material" value="platinum" onChange={handleMaterialFilterChange} />
            Platino
          </label>
        </div>
        <div className={styles.filterSection}>
          <h3>Disponibilidad</h3>
          <label>
            <input type="checkbox" name="availability" value="in-stock" onChange={handleAvailabilityFilterChange} />
            En Stock
          </label>
          <label>
            <input type="checkbox" name="availability" value="out-of-stock" onChange={handleAvailabilityFilterChange} />
            Agotado
          </label>
        </div>
      </aside>
      <main className={styles.products}>
        <h1>{category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Productos'}</h1>
        <div className={styles.productGrid}>
          {currentProducts.map(product => (
            <div key={product.product_code} className={styles.productCard}>
              {product.stock === 0 && <div className={styles.soldOut}>Agotado</div>}
              <div
                className={styles.productLink}
                onClick={() => handleProductClick(product)}
              >
                {product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className={styles.productImage} />
                ) : (
                  <div className={styles.noImageContainer}>
                    <img src={defaultImage} alt="Imagen no disponible" className={styles.productImage} />
                    <div className={styles.noImageBackground}>
                      <div className={styles.noImageText}>Imagen no disponible</div>
                    </div>
                  </div>
                )}
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className={styles.price}>${product.price.toLocaleString()} CLP</p>
              </div>
              <button
                className={`${styles.buyButton} ${product.stock === 0 ? styles.disabled : ''}`}
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? styles.active : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductList;