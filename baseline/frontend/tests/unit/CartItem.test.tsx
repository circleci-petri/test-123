import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from '../../src/components/Cart/CartItem';

describe('CartItem', () => {
  const mockItem = {
    id: 1,
    product_id: 1,
    quantity: 2,
    name: 'Test Product',
    price: 10,
  };

  it('should render item details', () => {
    const onUpdate = vi.fn();
    const onRemove = vi.fn();

    render(<CartItem item={mockItem} onUpdateQuantity={onUpdate} onRemove={onRemove} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should handle quantity decrease correctly', () => {
    const onUpdate = vi.fn();
    const onRemove = vi.fn();

    render(<CartItem item={mockItem} onUpdateQuantity={onUpdate} onRemove={onRemove} />);

    const decreaseButton = screen.getByText('-');
    fireEvent.click(decreaseButton);

    expect(onUpdate).toHaveBeenCalledWith(1, 1);
  });

  it('should not allow negative quantities', () => {
    const singleItem = { ...mockItem, quantity: 1 };
    const onUpdate = vi.fn();
    const onRemove = vi.fn();

    render(<CartItem item={singleItem} onUpdateQuantity={onUpdate} onRemove={onRemove} />);

    const decreaseButton = screen.getByText('-');
    fireEvent.click(decreaseButton);

    // When quantity is 1, decrementing should remove the item instead of setting quantity to 0
    expect(onRemove).toHaveBeenCalledWith(1);
    expect(onUpdate).not.toHaveBeenCalled();
  });
});
