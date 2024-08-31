import { ProductRepositoryImpl } from "../../../data/repositories/ProductRepository"; // TODO Importar el repositorio de data cuando esté listo

const { getProductByCode } = new ProductRepositoryImpl();

export const ProductByCode = async (product_code: string) => {
  return await getProductByCode(product_code);
}