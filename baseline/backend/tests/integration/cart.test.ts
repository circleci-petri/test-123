import request from 'supertest';
import app from '../../src/index';

describe('Cart API', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginResponse = await request(app).post('/api/users/login').send({
      username: 'alice',
      password: 'password123',
    });
    authToken = loginResponse.body.token;
  });

  beforeEach(async () => {
    // Clear cart before each test
    await request(app)
      .delete('/api/cart/clear')
      .set('Authorization', `Bearer ${authToken}`);
  });

  describe('POST /api/cart/add', () => {
    it('should add item to cart', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: 5, quantity: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should handle concurrent additions correctly', async () => {
      const promises = [
        request(app)
          .post('/api/cart/add')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ productId: 2, quantity: 1 }),
        request(app)
          .post('/api/cart/add')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ productId: 2, quantity: 1 }),
      ];

      await Promise.all(promises);

      const cartResponse = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`);

      const item = cartResponse.body.items.find((i: any) => i.product_id === 2);
      expect(item.quantity).toBe(2); // Should be exactly 2, not more
    });
  });
});
