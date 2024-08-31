// src/views/screens/ProductDetailViewModel.ts

// Configuración del slider
export const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
};

// Importa el caso de uso para obtener el producto por código
import { ProductByCode } from '../../../../domain/useCases/product/ProductByCode';
import { Product } from '../../../../domain/entities/Product';

// Función para obtener los detalles del producto por ID
export const getProductDetail = async (product_code: string): Promise<Product> => {
  try {
    return await ProductByCode(product_code);
  } catch (error) {
    console.error(`[ERROR] Error al obtener detalles del producto con código: ${product_code}`, error);
    throw error;
  }
};
