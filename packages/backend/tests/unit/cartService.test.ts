import { calculateCartTotal } from '../../src/services/cartService';

describe('Cart Service', () => {
  describe('calculateCartTotal', () => {
    it('should calculate total correctly', () => {
      const items = [
        { id: 1, cart_id: 1, product_id: 1, quantity: 2, product: { price: 10 } },
        { id: 2, cart_id: 1, product_id: 2, quantity: 3, product: { price: 5 } },
      ];

      const total = calculateCartTotal(items);

      expect(total).toBe(35); // 2*10 + 3*5 = 35
    });

    it('should handle empty cart', () => {
      const items: any[] = [];

      const total = calculateCartTotal(items);

      expect(total).toBe(0);
    });

    it('should handle missing product data', () => {
      const items = [
        { id: 1, cart_id: 1, product_id: 1, quantity: 2, product: undefined },
      ];

      const total = calculateCartTotal(items);

      expect(total).toBe(0);
    });
  });
});
