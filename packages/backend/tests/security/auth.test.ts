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
