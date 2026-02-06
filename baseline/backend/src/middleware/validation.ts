import { Request, Response, NextFunction } from 'express';

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { name, price } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (price !== undefined && price < 0) {
    return res.status(400).json({ error: 'Price must be positive' });
  }

  next();
};

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  next();
};

export const validateCartItem = (req: Request, res: Response, next: NextFunction) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  if (quantity !== undefined && quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }

  next();
};

export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query;

  if (page && isNaN(Number(page))) {
    return res.status(400).json({ error: 'Invalid page number' });
  }

  if (limit && isNaN(Number(limit))) {
    return res.status(400).json({ error: 'Invalid limit' });
  }

  next();
};
