import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import './Checkout.css';

interface CheckoutProps {
  onSuccess: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onSuccess }) => {
  const { state, dispatch } = useCart();
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [processing, setProcessing] = useState(false);

  const total = state.items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setProcessing(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          paymentToken: `tok_${cardNumber}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        dispatch({ type: 'CLEAR_CART' });
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: { id: Date.now(), message: 'Order placed successfully!', type: 'success' },
        });
        onSuccess();
      } else {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: { id: Date.now(), message: 'Payment failed', type: 'error' },
        });
      }
    } catch (error) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { id: Date.now(), message: 'Checkout error', type: 'error' },
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="checkout-summary">
        <h3>Order Summary</h3>
        <div className="summary-items">
          {state.items.map((item) => (
            <div key={item.id} className="summary-item">
              <span>{item.name}</span>
              <span>x{item.quantity}</span>
              <span>${((item.price || 0) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="summary-total">
          <strong>Total:</strong> <strong>${total.toFixed(2)}</strong>
        </div>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <h3>Payment Information</h3>
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
            />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
            />
          </div>
        </div>
        <button type="submit" disabled={processing}>
          {processing ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
