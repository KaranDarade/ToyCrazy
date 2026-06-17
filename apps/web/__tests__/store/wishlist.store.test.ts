import { useWishlist } from '@/hooks/useWishlist';

const mockProduct = {
  id: 'prod_1',
  name: 'Test Toy',
  slug: 'test-toy',
  price: 1999,
  imageUrl: '/test.jpg',
};

// We need to access the store directly for testing
const store = useWishlist();

describe('Wishlist Store', () => {
  beforeEach(() => {
    // Clear the wishlist before each test
    while (store.items.length > 0) {
      store.removeItem(store.items[0].id);
    }
  });

  it('starts with an empty wishlist', () => {
    expect(store.items).toHaveLength(0);
  });

  it('adds an item to the wishlist', () => {
    store.addItem(mockProduct);
    expect(store.items).toHaveLength(1);
    expect(store.items[0].id).toBe('prod_1');
  });

  it('does not duplicate items', () => {
    store.addItem(mockProduct);
    store.addItem(mockProduct);
    expect(store.items).toHaveLength(1);
  });

  it('removes an item from the wishlist', () => {
    store.addItem(mockProduct);
    store.removeItem('prod_1');
    expect(store.items).toHaveLength(0);
  });

  it('checks if item is in wishlist', () => {
    expect(store.isInWishlist('prod_1')).toBe(false);
    store.addItem(mockProduct);
    expect(store.isInWishlist('prod_1')).toBe(true);
  });

  it('toggles items in wishlist', () => {
    store.toggleItem(mockProduct);
    expect(store.isInWishlist('prod_1')).toBe(true);
    store.toggleItem(mockProduct);
    expect(store.isInWishlist('prod_1')).toBe(false);
  });

  it('clears the wishlist', () => {
    store.addItem(mockProduct);
    store.addItem({ ...mockProduct, id: 'prod_2' });
    store.clearWishlist();
    expect(store.items).toHaveLength(0);
  });
});
