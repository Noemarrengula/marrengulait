import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductPrice from '../ProductPrice';

describe('ProductPrice', () => {
  it('should render price correctly', () => {
    render(<ProductPrice price="100.00" />);
    expect(screen.getByText(/MT 100.00/i)).toBeInTheDocument();
  });

  it('should render old price with strikethrough', () => {
    render(<ProductPrice price="80.00" oldPrice="100.00" />);
    expect(screen.getByText(/MT 100.00/i)).toHaveClass('line-through');
  });

  it('should calculate and display discount percentage', () => {
    render(<ProductPrice price="80" oldPrice="100" showDiscount={true} />);
    expect(screen.getByText(/-20%/i)).toBeInTheDocument();
  });

  it('should not show discount badge when showDiscount is false', () => {
    render(<ProductPrice price="80" oldPrice="100" showDiscount={false} />);
    expect(screen.queryByText(/-20%/i)).not.toBeInTheDocument();
  });

  it('should use custom currency', () => {
    render(<ProductPrice price="100" currency="USD" />);
    expect(screen.getByText(/USD 100/i)).toBeInTheDocument();
  });

  it('should apply correct size classes', () => {
    const { rerender } = render(<ProductPrice price="100" size="sm" />);
    expect(screen.getByText(/MT 100/i)).toHaveClass('text-lg');

    rerender(<ProductPrice price="100" size="lg" />);
    expect(screen.getByText(/MT 100/i)).toHaveClass('text-3xl');
  });
});
