import { ProductRepositoryImpl } from "../../../data/repositories/ProductRepository";
import { Product } from "../../entities/Product";

const repository = new ProductRepositoryImpl();

export const ProductCrud = {
    getAllProducts: () => repository.getProductsByCategory(""),
    getProduct: (product_code: string) => repository.getProductByCode(product_code),
    create: (productData: Product) => repository.createProduct(productData),
    update: (product_code: string, productData: Product) => repository.updateProduct(product_code, productData),
    toggleActivation: (product_code: string) => repository.toggleActivateProduct(product_code),

    // NUEVAS FUNCIONES
    addImage: (product_code: string, url: string) => repository.addImage(product_code, url),
    deleteImage: (product_code: string, url: string) => repository.deleteImage(product_code, url),
};
