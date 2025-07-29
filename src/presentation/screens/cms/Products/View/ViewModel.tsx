import { useState, useEffect } from 'react';
import { ProductCrud } from '../../../../../domain/useCases/product/ProductCrud';
import { Product } from '../../../../../domain/entities/Product';

export const useViewModel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await ProductCrud.getAllProducts();
      setProducts(data);
    } catch (e) {
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const toggleActivation = async (product_code: string) => {
    await ProductCrud.toggleActivation(product_code);
    loadProducts();
  };

  return { products, loading, error, toggleActivation };
};