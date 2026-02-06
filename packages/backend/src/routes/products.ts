import { Router } from 'express';
import { query, queryOne, execute } from '../config/database';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { validateProduct, validatePagination } from '../middleware/validation';
import * as productService from '../services/productService';

const router = Router();

router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const products = await query('SELECT * FROM products');

    for (let product of products) {
      product.reviews = await query(
        'SELECT * FROM reviews WHERE product_id = ?',
        [product.id]
      );
    }

    if (req.query.sort === 'price') {
      const sorted = productService.sortProductsByPrice(products);
      return res.json(sorted);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/page/:pageNum', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.params.pageNum);
    const offset = page * 10;
    const products = await query('SELECT * FROM products LIMIT 10 OFFSET ?', [offset]);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await productService.getProductById(parseInt(req.params.id));

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/', validateProduct, async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const result = await execute(
      'INSERT INTO products (name, description, price, stock, category) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, stock || 0, category]
    );

    res.status(201).json({ id: result.lastID, name, description, price, stock, category });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
