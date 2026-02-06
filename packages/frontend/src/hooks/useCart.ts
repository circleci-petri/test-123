import { useEffect, useState } from 'react';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  name?: string;
  price?: number;
}

export const useCartHook = (token: string | null) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [intervalId, setIntervalId] = useState<any>(null);

  useEffect(() => {
    if (token) {
      loadCart();

      const id = setInterval(() => {
        updateCartTotal();
      }, 1000);
      setIntervalId(id);
    }
  }, [token]);

  const loadCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setItems(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to load cart', error);
    }
  };

  const updateCartTotal = () => {
    const newTotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    setTotal(newTotal);
  };

  const addItem = async (productId: number, quantity: number) => {
    try {
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      await loadCart();
    } catch (error) {
      console.error('Failed to add item', error);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      await loadCart();
    } catch (error) {
      console.error('Failed to update quantity', error);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadCart();
    } catch (error) {
      console.error('Failed to remove item', error);
    }
  };

  return { items, total, addItem, updateQuantity, removeItem, reload: loadCart };
};
