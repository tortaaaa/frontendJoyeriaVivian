import { ProductRepositoryImpl } from "../../../data/repositories/ProductRepository";

const { getProductByFilter } = new ProductRepositoryImpl();

export const ProductByFilter = async (product_filter: string) => {
  return await getProductByFilter(product_filter);
}