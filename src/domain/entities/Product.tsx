// Product.tsx
export interface Product {
  activated: any;
  product_code: string;  // "P001" (nuevo PK)
  name: string;          // nombre del producto
  category: string;      // tipo de producto (pulsera, colgante, anillo, etc)
  price: number;         // precio en pesos chilenos sin puntos ni comas
  stock: number;         // stock actual del producto en la tienda
  description: string;   // descripción del producto
  weight: number;        // 0.02
  material: string;      // "plata"
  gemstone_type: string; // "diamante"
  gemstone_size: number; // 0.5
  is_wedding: boolean;   // true
  is_baby: boolean;      // true
  is_men: boolean;       // false
  images: string[];
}
