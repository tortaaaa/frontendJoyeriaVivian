// src/presentation/viewmodels/ProductListViewModel.tsx
import { Product } from '../../../../domain/entities/Product';
import { ProductListByCategory } from '../../../../domain/useCases/product/ProductListByCategory';
import { ProductByFilter } from '../../../../domain/useCases/product/ProductByFilter';

export const products = async (category: string): Promise<Product[]> => {
  try {
    console.log(`[INFO] Fetching productos de la categoría: ${category}`);

    let products;
    if (category.toLowerCase() === 'matrimonio' || category.toLowerCase() === 'hombres') {
      // Si la categoría es 'matrimonio' o 'hombres', se usa el filtro correspondiente
      products = await ProductByFilter(category.toLowerCase());
    } else {
      // De lo contrario, se usa la búsqueda por categoría normal
      products = await ProductListByCategory(category);
    }

    console.log('[INFO] Productos obtenidos:', products);
    return products;
  } catch (error) {
    console.error('[ERROR] Error fetching products:', error);
    throw new Error('No se pudo obtener los productos desde el backend');
  }
};

export default products;
