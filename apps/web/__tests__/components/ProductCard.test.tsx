import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/shop/ProductCard';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock the cart store
jest.mock('@/store/cart', () => ({
  useCartStore: () => ({
    addItem: jest.fn(),
    items: [],
    itemCount: 0,
    totalAmount: 0,
    isOpen: false,
    toggleCart: jest.fn(),
  }),
}));

const mockProps = {
  id: '1',
  name: 'Galaxy Explorer Lego Set',
  slug: 'galaxy-explorer-lego',
  price: 4999,
  imageUrl: '/test.jpg',
  rating: 4.8,
  category: 'Lego & Blocks',
};

describe('ProductCard', () => {
  it('renders the product name', () => {
    render(<ProductCard {...mockProps} />);
    expect(screen.getByText('Galaxy Explorer Lego Set')).toBeInTheDocument();
  });

  it('renders the product category', () => {
    render(<ProductCard {...mockProps} />);
    expect(screen.getByText('Lego & Blocks')).toBeInTheDocument();
  });

  it('renders the price formatted in rupees', () => {
    render(<ProductCard {...mockProps} />);
    expect(screen.getByText('₹49.99')).toBeInTheDocument();
  });

  it('renders the Add to Cart button', () => {
    render(<ProductCard {...mockProps} />);
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('renders sale badge when compareAtPrice is provided', () => {
    render(<ProductCard {...mockProps} compareAtPrice={6499} />);
    expect(screen.getByText(/-23%/)).toBeInTheDocument();
  });

  it('links to product detail page', () => {
    render(<ProductCard {...mockProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/galaxy-explorer-lego');
  });
});
