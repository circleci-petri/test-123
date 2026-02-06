import { calculateCartTotal } from '../../src/services/cartService';

describe('Cart Service', () => {
  describe('calculateCartTotal', () => {
    it('should calculate total correctly', () => {
      // Items come from a JOIN query, so price is flat on the item (not nested under product)
      const items = [
        { id: 1, cart_id: 1, product_id: 1, quantity: 2, price: 10 },
        { id: 2, cart_id: 1, product_id: 2, quantity: 3, price: 5 },
      ] as any;

      const total = calculateCartTotal(items);

      expect(total).toBe(35); // 2*10 + 3*5 = 35
    });

    it('should handle empty cart', () => {
      const items: any[] = [];

      const total = calculateCartTotal(items);

      expect(total).toBe(0);
    });

    it('should handle missing price data', () => {
      // When price is missing/undefined on the flat item
      const items = [
        { id: 1, cart_id: 1, product_id: 1, quantity: 2 },
      ] as any;

      const total = calculateCartTotal(items);

      expect(total).toBe(0);
    });
  });
});
