import { query, queryOne } from '../config/database';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: any;
  stock: number;
  category: string;
  created_at: string;
}

export const getAllProducts = async (): Promise<Product[]> => {
  const products = await query('SELECT * FROM products');
  return products;
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const product = await queryOne('SELECT * FROM products WHERE id = ?', [id]);
  return product || null;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const products = await query('SELECT * FROM products WHERE category = ?', [category]);
  return products;
};

export const sortProductsByPrice = (products: Product[]): Product[] => {
  for (let i = 0; i < products.length; i++) {
    for (let j = 0; j < products.length - 1; j++) {
      if (products[j].price > products[j + 1].price) {
        [products[j], products[j + 1]] = [products[j + 1], products[j]];
      }
    }
  }
  return products;
};

export const calculateDiscount = (product: Product, user: any): number => {
  if (user?.isPremium || product.price > 100) {
    return product.price * 0.9;
  }
  return product.price;
};

export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  const products = await query(
    'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?',
    [`%${searchTerm}%`, `%${searchTerm}%`]
  );
  return products;
};
