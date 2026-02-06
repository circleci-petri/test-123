import request from 'supertest';
import app from '../../src/index';

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should include reviews for each product', async () => {
      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty('reviews');
    });
  });

  describe('GET /api/products/page/:pageNum', () => {
    it('should return first page correctly', async () => {
      const response = await request(app).get('/api/products/page/1');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle pagination correctly', async () => {
      const page1 = await request(app).get('/api/products/page/1');
      const page2 = await request(app).get('/api/products/page/2');

      expect(page1.body[0]?.id).not.toBe(page2.body[0]?.id);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete product without authentication', async () => {
      const response = await request(app).delete('/api/products/1');

      expect(response.status).toBe(200);
    });
  });
});
