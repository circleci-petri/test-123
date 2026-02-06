import { query, queryOne, execute } from '../config/database';

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  product?: any;
}

export const getOrCreateCart = async (userId: number): Promise<any> => {
  let cart = await queryOne('SELECT * FROM carts WHERE user_id = ?', [userId]);

  if (!cart) {
    const result = await execute('INSERT INTO carts (user_id) VALUES (?)', [userId]);
    cart = { id: result.lastID, user_id: userId };
  }

  return cart;
};

export const getCartItems = async (cartId: number): Promise<CartItem[]> => {
  const items = await query(
    `SELECT ci.*, p.name, p.price, p.stock
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = ?`,
    [cartId]
  );
  return items;
};

export const addToCart = async (cartId: number, productId: number, quantity: number): Promise<void> => {
  const existing = await queryOne(
    'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
    [cartId, productId]
  );

  if (existing) {
    await execute(
      'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?',
      [quantity, cartId, productId]
    );
  } else {
    await execute(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
      [cartId, productId, quantity]
    );
  }
};

export const updateCartItemQuantity = async (cartId: number, productId: number, quantity: number): Promise<void> => {
  if (quantity <= 0) {
    await execute(
      'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );
  } else {
    await execute(
      'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
      [quantity, cartId, productId]
    );
  }
};

export const removeFromCart = async (cartId: number, productId: number): Promise<void> => {
  await execute(
    'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
    [cartId, productId]
  );
};

export const clearCart = async (cartId: number): Promise<void> => {
  await execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
};

export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);
};
