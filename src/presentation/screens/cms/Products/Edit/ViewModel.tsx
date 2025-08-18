import { useState, useEffect } from 'react';
import { ProductCrud } from '../../../../../domain/useCases/product/ProductCrud';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../../../../domain/entities/Product';

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
    is_men: false,
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialImages, setInitialImages] = useState<string[]>([]); // Para comparar al guardar

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const prod = await ProductCrud.getProduct(product_code);
        setProduct(prod);
        setInitialImages(prod.images || []);
      } catch {
        setError("Error al cargar datos del producto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [product_code]);

  // Quitar imagen solo en frontend
  const handleRemoveImage = (url: string) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url)
    }));
  };

  // Guardar cambios en backend (sólo en “Actualizar Producto”)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Actualizar datos del producto (sin tocar imágenes)
      await ProductCrud.update(product_code, { ...product, images: [] });

      // 2. Eliminar imágenes que ya no están
      const imagesToDelete = initialImages.filter(img => !product.images.includes(img));
      await Promise.all(
        imagesToDelete.map(async (imgUrl) =>
          await ProductCrud.deleteImage(product_code, imgUrl)
        )
      );

      // 3. Subir imágenes nuevas que no existían antes
      const imagesToAdd = product.images.filter(img => !initialImages.includes(img));
      await Promise.all(
        imagesToAdd.map(async (imgUrl) =>
          await ProductCrud.addImage(product_code, imgUrl)
        )
      );

      navigate("/cms/products");
    } catch (err) {
      setError("Error al actualizar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return { product, setProduct, handleSubmit, loading, error, handleRemoveImage };
};
