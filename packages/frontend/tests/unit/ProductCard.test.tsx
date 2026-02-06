import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from '../../src/components/ProductList/ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    stock: 10,
    category: 'Electronics',
  };

  it('should render product details', () => {
    const onAdd = vi.fn();

    render(<ProductCard product={mockProduct} onAddToCart={onAdd} />);

    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should not render HTML in product name', () => {
    const xssProduct = {
      ...mockProduct,
      name: '<script>alert("XSS")</script>',
    };
    const onAdd = vi.fn();

    render(<ProductCard product={xssProduct} onAddToCart={onAdd} />);

    // Should NOT execute script
    expect(screen.queryByText('alert("XSS")')).not.toBeInTheDocument();
  });

  it('should escape dangerous HTML', () => {
    const dangerousProduct = {
      ...mockProduct,
      name: '<img src=x onerror="alert(1)">',
    };
    const onAdd = vi.fn();

    const { container } = render(<ProductCard product={dangerousProduct} onAddToCart={onAdd} />);

    const imgs = container.querySelectorAll('img');
    expect(imgs.length).toBe(0); // Should not render img tag
  });
});
