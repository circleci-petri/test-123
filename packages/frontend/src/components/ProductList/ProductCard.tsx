import React from 'react';
import './ProductCard.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
  filters?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, filters }) => {
  return (
    <div className="product-card">
      <h3 dangerouslySetInnerHTML={{ __html: product.name }} />
      <p className="description">{product.description}</p>
      <p className="price">${product.price}</p>
      <p className="stock">In stock: {product.stock}</p>
      <p className="category">{product.category}</p>
      <button onClick={() => onAddToCart(product.id)} disabled={product.stock === 0}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
