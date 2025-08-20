// src/data/repositories/ProductRepositoryImpl.ts
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import api from '../../data/sources/api/apiJoyeriaVivian';
import { Product } from '../../domain/entities/Product';

export class ProductRepositoryImpl implements ProductRepository {
  async bulkUpload(rows: any[]) {
    const response = await api.post('/products/bulk_upload/', rows);
    return response.data;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const cat = (category || '').toLowerCase();
      console.log(`[INFO] Solicitando productos de la categoría: ${cat}`);

      let url = '';

      // 1) “all” → trae TODOS (sin query param)
      if (cat === 'all' || cat === '') {
        url = `/products/`;
      }
      // 2) Rutas especiales → usa el endpoint de filtros del backend
      else if (cat === 'matrimonio' || cat === 'hombres') {
        url = `/products/filter/${encodeURIComponent(cat)}/`;
      }
      // 3) Categorías normales → query param
      else {
        url = `/products/?category=${encodeURIComponent(cat)}`;
      }

      const response = await api.get(url);
      console.log('[INFO] Productos recibidos:', response.data);

      // Normalización segura
      const toNum = (v: any) => (v === null || v === undefined || v === '' ? 0 : Number(v));

      return (response.data || []).map((item: any) => ({
        activated: !!item.activated,
        product_code: item.product_code,
        name: item.name,
        category: item.category,
        price: toNum(item.price),
        stock: toNum(item.stock),
        description: item.description || '',
        weight: toNum(item.weight),
        material: item.material || '',
        gemstone_type: item.gemstone_type || '',
        gemstone_size: toNum(item.gemstone_size),
        is_wedding: !!item.is_wedding, // tinyint(1) → boolean
        is_men: !!item.is_men,         // tinyint(1) → boolean
        images: item.images || [],
      })) as Product[];
    } catch (error) {
      console.error('[ERROR] Error al obtener productos por categoría:', error);
      throw error;
    }
  }

  async getProductByCode(product_code: string): Promise<Product> {
    try {
      console.log(`[INFO] Solicitando producto con código: ${product_code}`);
      const response = await api.get(`/products/${product_code}`);
      const item = response.data;
      console.log('[INFO] Producto recibido:', item);

      const toNum = (v: any) => (v === null || v === undefined || v === '' ? 0 : Number(v));

      return {
        activated: !!item.activated,
        product_code: item.product_code,
        name: item.name,
        category: item.category,
        price: toNum(item.price),
        stock: toNum(item.stock),
        description: item.description || '',
        weight: toNum(item.weight),
        material: item.material || '',
        gemstone_type: item.gemstone_type || '',
        gemstone_size: toNum(item.gemstone_size),
        is_wedding: !!item.is_wedding,
        is_men: !!item.is_men,
        images: item.images || [],
      } as Product;
    } catch (error) {
      console.error('[ERROR] Error al obtener producto por código:', error);
      throw error;
    }
  }

  async createProduct(productData: Product): Promise<Product> {
    try {
      const response = await api.post(`/products/`, productData);
      return response.data;
    } catch (err: any) {
      // Re-lanza para que ViewModel muestre el mensaje del backend
      throw err;
    }
  }

  async updateProduct(product_code: string, productData: Product): Promise<Product> {
    const response = await api.put(`/products/${product_code}/`, productData);
    return response.data;
  }

  async toggleActivateProduct(product_code: string): Promise<{ activated: boolean }> {
    const response = await api.delete(`/products/${product_code}/`);
    return response.data;
  }

  async addImage(product_code: string, url: string) {
    await api.post(`/images/`, { product: product_code, url });
  }

  async deleteImage(product_code: string, url: string) {
    await api.delete(`/images/delete_by_url/?product=${product_code}&url=${encodeURIComponent(url)}`);
  }
}
