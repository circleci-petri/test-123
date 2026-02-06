import express from 'express';
import cors from 'cors';
import { initDatabase } from './config/database';
import { config } from './config/secrets';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

import productsRouter from './routes/products';
import usersRouter from './routes/users';
import cartRouter from './routes/cart';
import checkoutRouter from './routes/checkout';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  try {
    await initDatabase();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

export default app;
