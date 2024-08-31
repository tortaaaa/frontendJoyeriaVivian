import { Product } from '../entities/Product';

export interface ProductRepository {
    getProductsByCategory(category: string): Promise<Product[]>;
    getProductByCode(product_code: string): Promise<Product>;
}
