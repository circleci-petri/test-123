import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query, queryOne, execute } from '../config/database';
import { config } from '../config/secrets';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validateUser } from '../middleware/validation';

const router = Router();

router.post('/register', validateUser, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await queryOne(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );

    const token = jwt.sign(
      { id: result.lastID, username, email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: result.lastID, username, email } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await queryOne('SELECT * FROM users WHERE username = ?', [username]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, isPremium: user.is_premium },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { query: searchQuery } = req.query;

    const results = await query(
      `SELECT * FROM users WHERE username LIKE '%${searchQuery}%'`
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await queryOne('SELECT id, username, email, is_premium, created_at FROM users WHERE id = ?', [req.user.id]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
