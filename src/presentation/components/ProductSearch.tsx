// src/presentation/components/ProductSearch.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import styles from './ProductSearch.module.css';

interface Product {
  product_code: string;
  name: string;
  category: string;
  price: number;
  images?: string[];
}

const API_BASE_URL = 'http://localhost:8000';

const categoryDisplayNames: Record<string, string> = {
  ring: 'Anillo',
  bracelet: 'Pulsera',
  earring: 'Aro',
  'baby earring': 'Aros para bebés',
  chain: 'Cadena',
  pendant: 'Colgante',
  // agrega aquí más si alguna vez tienes nuevas categorías...
};

const ProductSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchResults = async (search: string) => {
    if (!search.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get<Product[]>(
        `${API_BASE_URL}/api/buscar/?q=${encodeURIComponent(search)}`
      );
      setResults(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching products:', error);
      setResults([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useMemo(() => debounce(fetchResults, 300), []);

  useEffect(() => {
    debouncedFetch(query);
    return () => {
      debouncedFetch.cancel();
    };
  }, [query, debouncedFetch]);

  // Cerrar dropdown si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <input
        type="text"
        value={query}
        placeholder="Buscar producto..."
        onChange={(e) => setQuery(e.target.value)}
        className={styles.input}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
      />

      {showDropdown && (
        <div className={styles.dropdown}>
          {loading && <p style={{ padding: '0.5rem' }}>Buscando...</p>}
          {!loading && results.length === 0 && query && (
            <p style={{ padding: '0.5rem' }}>No hay resultados.</p>
          )}
          {results.map((product) => (
            <div
              key={product.product_code}
              className={styles.resultItem}
              onClick={() => {
                window.location.href = `/product/${product.product_code}`;
              }}
            >
            {product.images && product.images.length > 0 && (
            <img
                src={
                product.images[0].startsWith('http')
                    ? product.images[0]
                    : `${API_BASE_URL}${product.images[0]}`
                }
                alt={product.name}
                className={styles.productImage}
            />
            )}
              <div className={styles.productDetails}>
                <div className={styles.productName}>{product.name}</div>
<div>
  Categoría:{' '}
  {categoryDisplayNames[product.category] || product.category}
</div>                <div>Precio: ${product.price}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
