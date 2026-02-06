import request from 'supertest';
import app from '../../src/index';

describe('Authentication and Authorization', () => {
  describe('Protected Routes', () => {
    it('should require authentication for cart access', async () => {
      const response = await request(app).get('/api/cart');

      expect(response.status).toBe(401);
    });

    it('should reject invalid tokens', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
    });

    it('should require admin role for product deletion', async () => {
      const loginResponse = await request(app).post('/api/users/login').send({
        username: 'bob',
        password: 'password123',
      });

      const response = await request(app)
        .delete('/api/products/1')
        .set('Authorization', `Bearer ${loginResponse.body.token}`);

      expect(response.status).toBe(403); // Should be forbidden for non-admins
    });

    it('should require authentication for product creation', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({ name: 'Test', price: 10, description: 'Test', category: 'Test' });

      expect(response.status).toBe(401); // Should require auth
    });

    it('should require admin role for product deletion (not just auth)', async () => {
      const loginResponse = await request(app).post('/api/users/login').send({
        username: 'alice',
        password: 'password123',
      });

      // A regular authenticated user should get 403, not 200
      const response = await request(app)
        .delete('/api/products/999')
        .set('Authorization', `Bearer ${loginResponse.body.token}`);

      expect(response.status).toBe(403);
    });
  });

  describe('Registration Validation', () => {
    it('should reject invalid email format during registration', async () => {
      const response = await request(app).post('/api/users/register').send({
        username: 'testuser123',
        email: 'not-an-email',
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });

    it('should reject email with only @ sign', async () => {
      const response = await request(app).post('/api/users/register').send({
        username: 'testuser456',
        email: '@',
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('Hardcoded Secrets', () => {
    it('should not use hardcoded JWT secret', () => {
      const config = require('../../src/config/secrets').config;
      expect(config.jwtSecret).not.toBe('super-secret-key-12345');
    });

    it('should not expose API keys in responses', async () => {
      const response = await request(app).get('/api/products');

      const responseString = JSON.stringify(response.body);
      expect(responseString).not.toContain('sk_live_');
      expect(responseString).not.toContain('sk_test_');
    });
  });
});
