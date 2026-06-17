'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
}

interface WishlistState {
  items: WishlistProduct[];
  addItem: (product: WishlistProduct) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: WishlistProduct) => void;
  clearWishlist: () => void;
}

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (get().items.some((i) => i.id === product.id)) return;
        set((s) => ({ items: [...s.items, product] }));
        toast.success(`${product.name} saved to wishlist!`, { icon: '⭐' });
      },
      removeItem: (productId) => {
        set((s) => ({ items: s.items.filter((i) => i.id !== productId) }));
        toast.success('Removed from wishlist', { icon: '🗑️' });
      },
      isInWishlist: (productId) => get().items.some((i) => i.id === productId),
      toggleItem: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'toycraze-wishlist' },
  ),
);

export function useWishlist() {
  return useWishlistStore();
}
