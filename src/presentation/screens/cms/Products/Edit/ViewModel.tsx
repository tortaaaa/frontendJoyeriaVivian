import { useState, useEffect } from 'react';
import { ProductCrud } from '../../../../../domain/useCases/product/ProductCrud';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../../../../domain/entities/Product';
import api from '../../../../../data/sources/api/apiJoyeriaVivian';

export const useViewModel = (product_code: string) => {
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
    is_baby: false,
    is_men: false,
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const prod = await ProductCrud.getProduct(product_code);
        setProduct(prod);
      } catch {
        setError("Error al cargar datos del producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product_code]);

  // Eliminar una imagen por URL (tanto en backend como frontend)
  const handleDeleteImage = async (url: string) => {
    try {
      // 1. Busca el ID de la imagen en backend (puedes mejorar esto si backend permite borrar por URL directa)
      await api.delete(`/api/images/`, { data: { product: product_code, url } }); // <-- REQUIERE endpoint que acepte esto
      // 2. Actualiza el estado para quitar la imagen
      setProduct(prev => ({
        ...prev,
        images: prev.images.filter(img => img !== url)
      }));
    } catch {
      setError("Error al eliminar la imagen.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Actualizar producto (sin las imágenes)
      await ProductCrud.update(product_code, {
        ...product,
        images: [], // No enviar imágenes aquí
      });
      // 2. Subir nuevas imágenes (por cada URL de Cloudinary)
      await Promise.all(
        product.images.map(async (imgUrl) => {
          await api.post('/api/images/', {
            product: product_code,
            url: imgUrl,
          });
        })
      );
      navigate("/cms/products");
    } catch {
      setError("Error al actualizar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return { product, setProduct, handleSubmit, loading, error, handleDeleteImage };
};
