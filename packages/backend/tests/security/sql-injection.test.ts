import request from 'supertest';
import app from '../../src/index';

describe('SQL Injection Tests', () => {
  describe('User Search', () => {
    it('should prevent SQL injection in search', async () => {
      const maliciousQuery = "' OR '1'='1";

      const response = await request(app).get('/api/users/search').query({
        query: maliciousQuery,
      });

      expect(response.status).toBe(200);
      expect(response.body.length).not.toBeGreaterThan(10); // Should not return all users
    });

    it('should prevent SQL injection with UNION attack', async () => {
      const maliciousQuery = "' UNION SELECT * FROM users --";

      const response = await request(app).get('/api/users/search').query({
        query: maliciousQuery,
      });

      expect(response.status).toBe(200);
      expect(response.body).not.toContain('password_hash');
    });
  });
});
