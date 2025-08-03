import { useState } from 'react';
import { ProductCrud } from '../../../../../domain/useCases/product/ProductCrud';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../../../../domain/entities/Product';
import api from '../../../../../data/sources/api/apiJoyeriaVivian';

export const useViewModel = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>({
    activated: true,
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
    is_men: false,
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Para quitar imágenes del array local (antes de guardar)
  const handleRemoveImage = (url: string) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Crea el producto (sin imágenes)
      const prodData = { ...product, images: [] };
      await ProductCrud.create(prodData);

      // 2. Asocia imágenes al producto en la base de datos (una request por cada imagen)
      await Promise.all(
        product.images.map(async (imgUrl) => {
          await api.post('/api/images/', {
            product: product.product_code,
            url: imgUrl,
          });
        })
      );

      navigate("/cms/products");
    } catch {
      setError("Error al crear el producto.");
    } finally {
      setLoading(false);
    }
  };

  return { product, setProduct, handleSubmit, loading, error, handleRemoveImage };
};
