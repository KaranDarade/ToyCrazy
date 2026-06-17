import { useCartStore, useItemCount, useTotalAmount } from '@/store/cart';
import { act, renderHook } from '@testing-library/react';

const mockProduct = {
  id: 'prod_1',
  name: 'Test Toy',
  slug: 'test-toy',
  price: 1999,
  imageUrl: '/test.jpg',
  category: 'Test',
};

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('starts with an empty cart', () => {
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    const { result: count } = renderHook(() => useItemCount());
    const { result: total } = renderHook(() => useTotalAmount());
    expect(count.current).toBe(0);
    expect(total.current).toBe(0);
  });

  it('adds an item to the cart', () => {
    useCartStore.getState().addItem(mockProduct);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId).toBe('prod_1');
    expect(state.items[0].quantity).toBe(1);
  });

  it('increments quantity when adding existing item', () => {
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().addItem(mockProduct, 2);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('removes an item from the cart', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().removeItem('prod_1');
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it('updates item quantity', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().updateQuantity('prod_1', 5);
    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(5);
  });

  it('removes item when quantity reaches 0', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().updateQuantity('prod_1', 0);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it('clears the cart', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().addItem({ ...mockProduct, id: 'prod_2' });
    useCartStore.getState().clearCart();
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it('calculates totalAmount correctly via selector', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct, 2);
      useCartStore.getState().addItem({ ...mockProduct, id: 'prod_2', price: 500 }, 3);
    });
    const { result } = renderHook(() => useTotalAmount());
    expect(result.current).toBe(3998 + 1500);
  });

  it('calculates itemCount correctly via selector', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct, 3);
      useCartStore.getState().addItem({ ...mockProduct, id: 'prod_2' }, 2);
    });
    const { result } = renderHook(() => useItemCount());
    expect(result.current).toBe(5);
  });

  it('toggles cart drawer', () => {
    expect(useCartStore.getState().isOpen).toBe(false);
    useCartStore.getState().toggleCart();
    expect(useCartStore.getState().isOpen).toBe(true);
    useCartStore.getState().toggleCart();
    expect(useCartStore.getState().isOpen).toBe(false);
  });

  it('opens and closes cart drawer', () => {
    useCartStore.getState().openCart();
    expect(useCartStore.getState().isOpen).toBe(true);
    useCartStore.getState().closeCart();
    expect(useCartStore.getState().isOpen).toBe(false);
  });
});
