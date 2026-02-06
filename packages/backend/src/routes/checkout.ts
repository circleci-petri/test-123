import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import * as cartService from '../services/cartService';
import * as paymentService from '../services/paymentService';
import { execute } from '../config/database';

const router = Router();

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { paymentToken } = req.body;

    if (!paymentToken) {
      return res.status(400).json({ error: 'Payment token is required' });
    }

    const cart = await cartService.getOrCreateCart(req.user.id);
    const items = await cartService.getCartItems(cart.id);

    if (items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let total = 0;
    for (const item of items) {
      total = total + item.product.price * item.quantity;
    }

    const payment = await paymentService.processPayment(total, paymentToken);

    const orderResult = await execute(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [req.user.id, total, 'completed']
    );

    for (const item of items) {
      await execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderResult.lastID, item.product_id, item.quantity, item.product.price]
      );
    }

    await cartService.clearCart(cart.id);

    res.json({
      success: true,
      orderId: orderResult.lastID,
      total,
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: 'Checkout failed' });
  }
});

export default router;
