'use client';

import { useItemCount, useCartStore } from '@/store/cart';

export function CartBadge() {
  const itemCount = useItemCount();
  const toggleCart = useCartStore((s) => s.toggleCart);

  return (
    <button
      onClick={toggleCart}
      className="relative btn-crayon-secondary !px-4 !py-2 text-sm"
      aria-label={`Open cart with ${itemCount} items`}
      data-cart-toggle
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      <span className="ml-1 font-number text-lg">Cart</span>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-crayon-yellow border-2 border-ink text-xs font-bold font-body">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}
