// src/presentation/viewmodels/ProductListViewModel.tsx
import { Product } from '../../../../domain/entities/Product';
import { ProductListByCategory } from '../../../../domain/useCases/product/ProductListByCategory';

// Función para obtener productos desde el backend
export const products = async (category: string): Promise<Product[]> => {
  try {
    console.log(`[INFO] Fetching productos de la categoría: ${category}`);
    const products = await ProductListByCategory(category);
    console.log('[INFO] Productos obtenidos:', products);
    return products;
  } catch (error) {
    console.error('[ERROR] Error fetching products:', error);
    throw new Error('No se pudo obtener los productos desde el backend');
  }
};

export default products;
