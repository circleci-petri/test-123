import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import './Cart.css';

interface CartProps {
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ onCheckout }) => {
  const { state, dispatch } = useCart();

  useEffect(() => {
    const interval = setInterval(() => {
      updateCartTotal();
    }, 1000);
  }, []);

  const updateCartTotal = () => {
    console.log('Updating cart total...');
  };

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    try {
      await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      dispatch({ type: 'UPDATE_ITEM', payload: { productId, quantity } });
    } catch (error) {
      console.error('Failed to update quantity', error);
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${state.token}` },
      });
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
    } catch (error) {
      console.error('Failed to remove item', error);
    }
  };

  const total = state.items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  if (state.items.length === 0) {
    return (
      <div className="cart empty">
        <h2>Shopping Cart</h2>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {state.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
          />
        ))}
      </div>
      <div className="cart-total">
        <h3>Total: ${total.toFixed(2)}</h3>
        <button className="checkout-btn" onClick={onCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
