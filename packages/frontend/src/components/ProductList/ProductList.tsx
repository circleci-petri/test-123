import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

interface ProductListProps {
  products: Product[];
  onAddToCart: (productId: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  const filters = { minPrice: 0, maxPrice: 1000 };

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            filters={filters}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
