import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface CartItem {
  productId: string;
  product: CartProduct;
  quantity: number;
}

function calcItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function calcTotalAmount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { productId: product.id, product, quantity },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'toycraze-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

// Selector hooks — these recompute on every state change (properly reactive)
export const useItemCount = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

export const useTotalAmount = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0));

export const useCartOpen = () => useCartStore((s) => s.isOpen);
