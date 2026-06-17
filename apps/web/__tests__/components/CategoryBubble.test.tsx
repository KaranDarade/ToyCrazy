import { render, screen } from '@testing-library/react';
import { CategoryBubble } from '@/components/shop/CategoryBubble';

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

describe('CategoryBubble', () => {
  const props = {
    name: 'Lego & Blocks',
    slug: 'lego-blocks',
    color: '#FF6B6B',
    icon: '🧱',
  };

  it('renders category name', () => {
    render(<CategoryBubble {...props} />);
    expect(screen.getByText('Lego & Blocks')).toBeInTheDocument();
  });

  it('links to correct URL', () => {
    render(<CategoryBubble {...props} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products?category=lego-blocks');
  });

  it('has accessible label', () => {
    render(<CategoryBubble {...props} />);
    expect(screen.getByLabelText('Browse Lego & Blocks')).toBeInTheDocument();
  });
});
