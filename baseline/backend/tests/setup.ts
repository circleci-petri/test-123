import { initDatabase } from '../src/config/database';

// Set environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.API_KEY = 'test-api-key';
process.env.STRIPE_SECRET = 'test-stripe-secret';

beforeAll(async () => {
  await initDatabase();
});
