// src/domain/useCases/product/ProductListByCategory.ts
import { ProductRepositoryImpl } from "../../../data/repositories/ProductRepository";

const productRepository = new ProductRepositoryImpl();

export const ProductListByCategory = async (category: string) => {
    console.log(`[INFO] Ejecutando caso de uso para la categoría: ${category}`);
    return await productRepository.getProductsByCategory(category);
};
