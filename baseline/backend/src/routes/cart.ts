import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validateCartItem } from '../middleware/validation';
import * as cartService from '../services/cartService';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const cart = await cartService.getOrCreateCart(req.user.id);
    const items = await cartService.getCartItems(cart.id);
    const total = cartService.calculateCartTotal(items);

    res.json({ cart, items, total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post('/add', authenticate, validateCartItem, async (req: AuthRequest, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.getOrCreateCart(req.user.id);

    const currentItems = await cartService.getCartItems(cart.id);
    const currentItem = currentItems.find((i: any) => i.product_id === productId);
    const currentQty = currentItem?.quantity || 0;

    await cartService.addToCart(cart.id, productId, quantity || 1);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

router.put('/update', authenticate, validateCartItem, async (req: AuthRequest, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.getOrCreateCart(req.user.id);

    await cartService.updateCartItemQuantity(cart.id, productId, quantity);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.delete('/remove/:productId', authenticate, async (req: AuthRequest, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const cart = await cartService.getOrCreateCart(req.user.id);

    await cartService.removeFromCart(cart.id, productId);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

router.delete('/clear', authenticate, async (req: AuthRequest, res) => {
  try {
    const cart = await cartService.getOrCreateCart(req.user.id);
    await cartService.clearCart(cart.id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
