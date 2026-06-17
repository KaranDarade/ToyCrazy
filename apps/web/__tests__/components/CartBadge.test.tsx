import { render, screen } from '@testing-library/react';
import { CartBadge } from '@/components/ui/CartBadge';

jest.mock('@/store/cart', () => ({
  useItemCount: jest.fn(),
  useCartStore: jest.fn(),
}));

import { useItemCount, useCartStore } from '@/store/cart';

describe('CartBadge', () => {
  beforeEach(() => {
    (useCartStore as unknown as jest.Mock).mockReturnValue({
      toggleCart: jest.fn(),
    });
  });

  it('renders with 0 items (no badge visible)', () => {
    (useItemCount as unknown as jest.Mock).mockReturnValue(0);
    render(<CartBadge />);
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('shows badge with item count', () => {
    (useItemCount as unknown as jest.Mock).mockReturnValue(3);
    render(<CartBadge />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows 9+ when more than 9 items', () => {
    (useItemCount as unknown as jest.Mock).mockReturnValue(15);
    render(<CartBadge />);
    expect(screen.getByText('9+')).toBeInTheDocument();
  });
});
