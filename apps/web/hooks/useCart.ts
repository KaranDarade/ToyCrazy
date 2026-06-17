'use client';

import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';

export function useCart() {
  const store = useCartStore();

  const addToCart = (product: Parameters<typeof store.addItem>[0], quantity = 1) => {
    store.addItem(product, quantity);
    toast.success(`${product.name} added to cart!`, { icon: '🎉' });
  };

  const removeFromCart = (productId: string) => {
    const item = store.items.find((i) => i.productId === productId);
    store.removeItem(productId);
    if (item) {
      toast.success(`${item.product.name} removed from cart`, { icon: '🗑️' });
    }
  };

  const isInCart = (productId: string) => {
    return store.items.some((i) => i.productId === productId);
  };

  const getQuantity = (productId: string) => {
    return store.items.find((i) => i.productId === productId)?.quantity ?? 0;
  };

  return {
    ...store,
    addToCart,
    removeFromCart,
    isInCart,
    getQuantity,
  };
}
