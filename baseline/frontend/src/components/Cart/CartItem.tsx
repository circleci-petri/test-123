import React from 'react';
import './CartItem.css';

interface CartItemProps {
  item: {
    id: number;
    product_id: number;
    quantity: number;
    name?: string;
    price?: number;
  };
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const handleIncrease = () => {
    onUpdateQuantity(item.product_id, item.quantity + 1);
  };

  const handleDecrease = () => {
    onUpdateQuantity(item.product_id, item.quantity - 1);
  };

  return (
    <div className="cart-item">
      <div className="item-info">
        <h4>{item.name}</h4>
        <p className="item-price">${item.price}</p>
      </div>
      <div className="item-controls">
        <button onClick={handleDecrease}>-</button>
        <span className="quantity">{item.quantity}</span>
        <button onClick={handleIncrease}>+</button>
      </div>
      <div className="item-total">
        <p>${((item.price || 0) * item.quantity).toFixed(2)}</p>
        <button className="remove-btn" onClick={() => onRemove(item.product_id)}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
