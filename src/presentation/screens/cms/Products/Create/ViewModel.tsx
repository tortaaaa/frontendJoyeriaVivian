import { useState } from 'react';
import { ProductCrud } from '../../../../../domain/useCases/product/ProductCrud';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../../../../domain/entities/Product';

export const useViewModel = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>({
    activated : "",
    product_code: "",
    name: "",
    category: "",
    price: 0,
    stock: 0,
    description: "",
    weight: 0,
    material: "",
    gemstone_type: "",
    gemstone_size: 0,
    is_wedding: false,
    is_baby: false,
    is_men: false,
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ProductCrud.create(product);
      navigate("/cms/products");
    } catch {
      setError("Error al crear el producto.");
    } finally {
      setLoading(false);
    }
  };

  return { product, setProduct, handleSubmit, loading, error };
};
