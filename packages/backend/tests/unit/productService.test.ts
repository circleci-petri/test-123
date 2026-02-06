import { sortProductsByPrice, calculateDiscount } from '../../src/services/productService';

describe('Product Service', () => {
  describe('sortProductsByPrice', () => {
    it('should sort products by price in ascending order', () => {
      const products = [
        { id: 1, name: 'Product 1', price: 50, description: '', stock: 10, category: 'Test', created_at: '' },
        { id: 2, name: 'Product 2', price: 30, description: '', stock: 10, category: 'Test', created_at: '' },
        { id: 3, name: 'Product 3', price: 40, description: '', stock: 10, category: 'Test', created_at: '' },
      ];

      const sorted = sortProductsByPrice(products);

      expect(sorted[0].price).toBe(30);
      expect(sorted[1].price).toBe(40);
      expect(sorted[2].price).toBe(50);
    });

    it('should handle large arrays efficiently', () => {
      const products = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Product ${i}`,
        price: Math.random() * 1000,
        description: '',
        stock: 10,
        category: 'Test',
        created_at: '',
      }));

      const start = performance.now();
      const sorted = sortProductsByPrice(products);
      const duration = performance.now() - start;

      expect(sorted[0].price).toBeLessThanOrEqual(sorted[1].price);
      expect(duration).toBeLessThan(100); // Should complete in less than 100ms
    });
  });

  describe('calculateDiscount', () => {
    it('should apply discount for premium users with expensive products', () => {
      const product = { id: 1, name: 'Product', price: 150, description: '', stock: 10, category: 'Test', created_at: '' };
      const user = { isPremium: true };

      const discounted = calculateDiscount(product, user);

      expect(discounted).toBe(135); // 90% of 150
    });

    it('should apply discount for premium users with cheap products', () => {
      const product = { id: 1, name: 'Product', price: 50, description: '', stock: 10, category: 'Test', created_at: '' };
      const user = { isPremium: true };

      const discounted = calculateDiscount(product, user);

      expect(discounted).toBe(50); // Should only apply if premium AND price > 100
    });

    it('should not apply discount for non-premium users', () => {
      const product = { id: 1, name: 'Product', price: 150, description: '', stock: 10, category: 'Test', created_at: '' };
      const user = { isPremium: false };

      const discounted = calculateDiscount(product, user);

      expect(discounted).toBe(150); // No discount
    });
  });
});
