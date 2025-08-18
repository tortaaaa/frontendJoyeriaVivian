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
            console.log(`[INFO] Solicitando productos de la categoría: ${category}`);
            const response = await api.get(`/products/?category=${category}`);
            console.log('[INFO] Productos recibidos:', response.data);

            return response.data.map((item: any) => ({
                activated: item.activated, // 👈 SIEMPRE traer este campo
                product_code: item.product_code,
                name: item.name,
                category: item.category,
                price: item.price,
                stock: item.stock,
                description: item.description,
                weight: parseFloat(item.weight),
                material: item.material,
                gemstone_type: item.gemstone_type,
                gemstone_size: parseFloat(item.gemstone_size),
                is_wedding: item.is_wedding,
                is_men: item.is_men,
                images: item.images
            }));
        } catch (error) {
            console.error("[ERROR] Error al obtener productos por categoría:", error);
            throw error;
        }
    }

    async getProductByCode(product_code: string): Promise<Product> {
        try {
            console.log(`[INFO] Solicitando producto con código: ${product_code}`);
            const response = await api.get(`/products/${product_code}`);
            const item = response.data;
            console.log('[INFO] Producto recibido:', item);

            return {
                activated: item.activated, // 👈 SIEMPRE traer este campo
                product_code: item.product_code,
                name: item.name,
                category: item.category,
                price: item.price,
                stock: item.stock,
                description: item.description,
                weight: parseFloat(item.weight),
                material: item.material,
                gemstone_type: item.gemstone_type,
                gemstone_size: parseFloat(item.gemstone_size),
                is_wedding: item.is_wedding,
                is_men: item.is_men,
                images: item.images,
            };
        } catch (error) {
            console.error("[ERROR] Error al obtener producto por código:", error);
            throw error;
        }   
    }

    async createProduct(productData: Product): Promise<Product> {
        const response = await api.post(`/products/`, productData);
        return response.data;
    }

    async updateProduct(product_code: string, productData: Product): Promise<Product> {
        const response = await api.put(`/products/${product_code}/`, productData);
        return response.data;
    }

    async toggleActivateProduct(product_code: string): Promise<{ activated: boolean }> {
        const response = await api.delete(`/products/${product_code}/`);
        return response.data;
    }

    // Subir imagen
    async addImage(product_code: string, url: string) {
        await api.post(`/images/`, { product: product_code, url });
    }

    // Eliminar imagen
    async deleteImage(product_code: string, url: string) {
        // Usa el endpoint delete_by_url que espera product_code y url
        await api.delete(`/images/delete_by_url/?product=${product_code}&url=${encodeURIComponent(url)}`);
    }
}
