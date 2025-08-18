import { ProductRepositoryImpl } from "../../../data/repositories/ProductRepository";

const productRepository = new ProductRepositoryImpl();

export const ProductByCode = async (product_code: string) => {
  return await productRepository.getProductByCode(product_code);
}
