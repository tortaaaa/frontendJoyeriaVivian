import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductList.module.css';
import fetchProductsByCategory from './ViewModel';
import { CartContext } from '../../../context/CartContext';
import { Product } from '../../../../domain/entities/Product';
import Spinner from '../../../components/Spinner';
import defaultImage from '../../../../assets/images/JoyeriaVivianLogo2.jpg';

const ProductList: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  const normalizedCategory = (category ?? '').toLowerCase();
  const isWeddingRoute = normalizedCategory === 'matrimonio';
  const isMenRoute = normalizedCategory === 'hombres';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [materialFilter, setMaterialFilter] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([]);

  // ⭐ NUEVO: filtro por tipo de piedra
  const [gemstoneFilter, setGemstoneFilter] = useState<string[]>([]);

  const [searchTerm] = useState('');

  const productsPerPage = 12;
  const { addToCart } = useContext(CartContext) || {};

  const categoryMapping: Record<string, string> = {
    anillos: 'ring',
    pulseras: 'bracelet',
    aros: 'earring',
    cadenas: 'chain',
    colgantes: 'pendant',
    'aros para bebés': 'baby earring',
    'Aros para bebés': 'baby earring',
    'baby earring': 'baby earring',
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isWeddingRoute || isMenRoute) {
          const allProducts = await fetchProductsByCategory('all');
          setProducts(allProducts);
          return;
        }

        const mapped = categoryMapping[normalizedCategory];
        const fetched = await fetchProductsByCategory(mapped || 'all');
        setProducts(fetched);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedCategory]);

  const handlePriceFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setPriceFilter(prev => (checked ? [...prev, value] : prev.filter(v => v !== value)));
  };

  // ⭐ corrige y distingue valores de material
  const handleMaterialFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setMaterialFilter(prev => (checked ? [...prev, value] : prev.filter(v => v !== value)));
  };

  const handleAvailabilityFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setAvailabilityFilter(prev => (checked ? [...prev, value] : prev.filter(v => v !== value)));
  };

  // ⭐ NUEVO: handler para piedras
  const handleGemstoneFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setGemstoneFilter(prev => (checked ? [...prev, value] : prev.filter(v => v !== value)));
  };

  const toggleFilters = () => setShowFilters(prev => !prev);

  const handleProductClick = (producto: Product) => {
    window.location.href = `/product/${producto.product_code}`;
  };

  const handleAddToCart = (product: Product) => {
    if (addToCart) addToCart({ ...product, quantity: 1 });
  };

  // ⭐ utilidades para normalizar strings (sin tildes, minúsculas)
  const normalize = (s: string) =>
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const applyFilters = (product: Product) => {
    // Rango de precio
    const priceMatch =
      priceFilter.length === 0 ||
      priceFilter.some(range => {
        const [min, max] = range.split('-').map(Number);
        return product.price >= min && product.price <= max;
      });

    // ⭐ Material
    const mat = normalize(product.material || '');
    const wantsGoldAll = materialFilter.includes('oro_all');
    const wantsGoldWhite = materialFilter.includes('oro_blanco');
    const wantsGoldYellow = materialFilter.includes('oro_amarillo');
    const wantsGoldItalian = materialFilter.includes('oro_italiano');
    const wantsGoldRed = materialFilter.includes('oro_rojo');
    const wantsSilver = materialFilter.includes('plata');
    const wantsPlatinum = materialFilter.includes('platino');

    const materialSelected = materialFilter.length > 0;

    const matchesGoldAll = wantsGoldAll && (mat.includes('oro'));
    const matchesGoldWhite = wantsGoldWhite && (mat.includes('oro') && mat.includes('blanco'));
    // Acepta "oro" simple como amarillo también
    const matchesGoldYellow =
      wantsGoldYellow && ( (mat.includes('oro') && mat.includes('amarillo')) || mat === 'oro' );
    const matchesGoldItalian = wantsGoldItalian && (mat.includes('oro') && mat.includes('italiano'));
    const matchesGoldRed = wantsGoldRed && (mat.includes('oro') && mat.includes('rojo'));
    const matchesSilver = wantsSilver && (mat.includes('plata') || mat.includes('silver'));
    const matchesPlatinum = wantsPlatinum && (mat.includes('platino') || mat.includes('platinum'));

    const materialMatch =
      !materialSelected ||
      matchesGoldAll ||
      matchesGoldWhite ||
      matchesGoldYellow ||
      matchesGoldItalian ||
      matchesGoldRed ||
      matchesSilver ||
      matchesPlatinum;

    // Disponibilidad
    const availabilityMatch =
      availabilityFilter.length === 0 ||
      (availabilityFilter.includes('in-stock') && product.stock > 0) ||
      (availabilityFilter.includes('out-of-stock') && product.stock === 0);

    // Categoría
    const mappedCategory = categoryMapping[normalizedCategory];
    const categoryMatch =
      normalizedCategory === '' ||
      (isWeddingRoute && !!product.is_wedding) ||
      (isMenRoute && !!product.is_men) ||
      (!!mappedCategory && product.category === mappedCategory);

    // ⭐ Tipo de piedra
    const gem = normalize(product.gemstone_type || '');
    const gemstoneSelected = gemstoneFilter.length > 0;
    const gemstoneMatch =
      !gemstoneSelected ||
      gemstoneFilter.some(g => normalize(g) === gem);

    // Búsqueda
    const term = normalize(searchTerm || '');
    const searchMatch =
      term === '' ||
      normalize(product.name || '').includes(term) ||
      normalize(product.description || '').includes(term) ||
      normalize(product.material || '').includes(term) ||
      normalize(product.gemstone_type || '').includes(term);

    return priceMatch && materialMatch && availabilityMatch && categoryMatch && gemstoneMatch && searchMatch;
  };

  // --- Filtrado previo + paginación ---
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const activated = products.filter(p => p.activated);

  const filteredBase = isWeddingRoute
    ? activated.filter(p => !!p.is_wedding)
    : isMenRoute
    ? activated.filter(p => !!p.is_men)
    : activated;

  const finalFiltered = filteredBase.filter(applyFilters);

  const currentProducts = finalFiltered.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(finalFiltered.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // ⭐ Resetea a la primera página cuando cambian filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [priceFilter, materialFilter, availabilityFilter, gemstoneFilter, searchTerm]);

  if (loading) return <Spinner />;

  return (
    <div className={styles.container}>
      <button className={styles.hamburger} onClick={toggleFilters}>
        &#9776;
      </button>

      <aside className={`${styles.filters} ${showFilters ? styles.show : ''}`}>
        <button
          className={styles.filtersClose}
          onClick={toggleFilters}
          aria-label="Cerrar filtros"
        >
          ×
        </button>

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

        {/* ⭐ MATERIAL: valores corregidos */}
        <div className={styles.filterSection}>
          <h3>Material</h3>
          <label>
            <input type="checkbox" name="material" value="oro_all" onChange={handleMaterialFilterChange} />
            Oro (Todos los tipos)
          </label>
          <label>
            <input type="checkbox" name="material" value="oro_blanco" onChange={handleMaterialFilterChange} />
            Oro Blanco
          </label>
          <label>
            <input type="checkbox" name="material" value="oro_amarillo" onChange={handleMaterialFilterChange} />
            Oro (Amarillo)
          </label>
          <label>
            <input type="checkbox" name="material" value="oro_italiano" onChange={handleMaterialFilterChange} />
            Oro Italiano
          </label>
          <label>
            <input type="checkbox" name="material" value="oro_rojo" onChange={handleMaterialFilterChange} />
            Oro Rojo
          </label>
          <label>
            <input type="checkbox" name="material" value="plata" onChange={handleMaterialFilterChange} />
            Plata
          </label>
          <label>
            <input type="checkbox" name="material" value="platino" onChange={handleMaterialFilterChange} />
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

        {/* ⭐ TIPO DE PIEDRA: handler y valores correctos */}
        <div className={styles.filterSection}>
          <h3>Tipo de piedra</h3>
          {[
            'Amatista',
            'Aguamarina',
            'Topacio',
            'Granate',
            'Turmalina',
            'Tanzanita',
            'Peridoto',
            'Citrino',
            'Espinela',
            'Circón',
            'Ópalo',
            'Morganita',
            'Perla',
            'Cuarzo',
          ].map(label => {
            const value = label; // usamos el texto tal cual y normalizamos al comparar
            return (
              <label key={label}>
                <input
                  type="checkbox"
                  name="gemstone"
                  value={value}
                  onChange={handleGemstoneFilterChange}
                />
                {label}
              </label>
            );
          })}
        </div>
      </aside>

      {/* Overlay */}
      <div
        className={`${styles.filtersOverlay} ${showFilters ? styles.show : ''}`}
        onClick={toggleFilters}
      />

      <main className={styles.products}>
        <h1>{category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Productos'}</h1>

        {error && (
          <div className={styles.errorMsg}>
            Ocurrió un problema al cargar los productos. Por favor, intenta nuevamente más tarde.
          </div>
        )}

        <div className={styles.productGrid}>
          {!error && currentProducts.length === 0 && (
            <div className={styles.noProductsMessage}>
              <p>
                Actualmente no hay productos disponibles en esta categoría.
                <br />
                Muy pronto agregaremos más novedades. ¡Vuelve a visitarnos pronto!
              </p>
            </div>
          )}

          {currentProducts.map(product => {
            const formatPrice = (v: number) =>
              new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

            return (
              <article key={product.product_code} className={styles.card}>
                {product.stock === 0 && <div className={styles.soldOut}>Agotado</div>}

                <div
                  className={styles.cardLink}
                  onClick={() => handleProductClick(product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' ? handleProductClick(product) : null)}
                >
                  <div className={styles.imgWrap}>
                    {product.images?.length ? (
                      <img src={product.images[0]} alt={product.name} className={styles.img} />
                    ) : (
                      <img src={defaultImage} alt="Imagen no disponible" className={styles.img} />
                    )}
                  </div>

                  <h3 className={styles.title}>{product.name}</h3>

                  <div className={styles.meta}>
                    <div><span className={styles.metaLabel}>Material:</span> {product.material ?? '—'}</div>
                    <div><span className={styles.metaLabel}>Piedra:</span> {product.gemstone_type ?? '—'}</div>
                    <div><span className={styles.subtitle}>Código:</span> {product.product_code}</div>
                  </div>

                  <div className={styles.price}>{formatPrice(product.price)}</div>
                </div>

                <button
                  className={`${styles.cta} ${product.stock === 0 ? styles.disabled : ''}`}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  Compra Ya
                </button>
              </article>
            );
          })}
        </div>

        {!error && currentProducts.length > 0 && (
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
        )}
      </main>
    </div>
  );
};

export default ProductList;
