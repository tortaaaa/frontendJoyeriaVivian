// src/data/repositories/ProductRepositoryImpl.ts

import { ProductRepository } from '../../domain/repositories/ProductRepository';
import api from '../../data/sources/api/apiJoyeriaVivian';
import { Product } from '../../domain/entities/Product';

export class ProductRepositoryImpl implements ProductRepository {
    async getProductsByCategory(category: string): Promise<Product[]> {
        try {
            console.log(`[INFO] Solicitando productos de la categoría: ${category}`);
            const response = await api.get(`/api/products/?category=${category}`);
            console.log('[INFO] Productos recibidos:', response.data);

            return response.data.map((item: any) => ({
                product_code: item.product_code, // Clave primaria
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
                is_baby: item.is_baby,
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
            const response = await api.get(`/api/products/${product_code}`);
            const item = response.data;
            console.log('[INFO] Producto recibido:', item);

            return {
                product_code: item.product_code, // Clave primaria
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
                is_baby: item.is_baby,
                is_men: item.is_men,
                images: item.images
            };
        } catch (error) {
            console.error("[ERROR] Error al obtener producto por código:", error);
            throw error;
        }
    }
        async createProduct(productData: Product): Promise<Product> {
        const response = await api.post(`/api/products/`, productData);
        return response.data;
    }

    async updateProduct(product_code: string, productData: Product): Promise<Product> {
        const response = await api.put(`/api/products/${product_code}/`, productData);
        return response.data;
    }

    async toggleActivateProduct(product_code: string): Promise<{ activated: boolean }> {
        const response = await api.delete(`/api/products/${product_code}/`);
        return response.data;
    }
}
