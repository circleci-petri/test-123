import request from 'supertest';
import app from '../../src/index';

describe('Validation Middleware', () => {
  describe('validateUser - email format', () => {
    it('should reject registration with invalid email format', async () => {
      const response = await request(app).post('/api/users/register').send({
        username: 'newuser_validation_test',
        email: 'invalid-email',
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/email/i);
    });
  });

  describe('validateProduct - price validation', () => {
    let authToken: string;

    beforeAll(async () => {
      const loginResponse = await request(app).post('/api/users/login').send({
        username: 'alice',
        password: 'password123',
      });
      authToken = loginResponse.body.token;
    });

    it('should reject product without price', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Product', description: 'test', category: 'test' });

      expect(response.status).toBe(400);
    });

    it('should reject product with non-numeric price', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Product', price: 'not-a-number', description: 'test', category: 'test' });

      expect(response.status).toBe(400);
    });
  });

  describe('NaN checks on route params', () => {
    it('should reject non-numeric product ID', async () => {
      const response = await request(app).get('/api/products/abc');

      expect(response.status).toBe(400);
    });

    let authToken: string;

    beforeAll(async () => {
      const loginResponse = await request(app).post('/api/users/login').send({
        username: 'alice',
        password: 'password123',
      });
      authToken = loginResponse.body.token;
    });

    it('should reject non-numeric productId in cart remove', async () => {
      const response = await request(app)
        .delete('/api/cart/remove/abc')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });
  });
});
