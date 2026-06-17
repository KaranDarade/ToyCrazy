'use client';

import Link from 'next/link';
import { useItemCount, useCartStore } from '@/store/cart';

export function MobileNav() {
  const itemCount = useItemCount();
  const toggleCart = useCartStore((s) => s.toggleCart);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t-3 border-ink bg-paper"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around py-2 px-2">
        <NavLink href="/" icon="🏠" label="Home" />
        <NavLink href="/products" icon="🧸" label="Shop" />
        <NavLink href="/categories" icon="📂" label="Categories" />
        <button
          onClick={toggleCart}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg relative"
          aria-label={`Cart with ${itemCount} items`}
        >
          <span className="text-xl">🛒</span>
          <span className="font-body text-xs">Cart</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-crayon-red text-white text-xs font-bold w-5 h-5 rounded-full border-2 border-ink flex items-center justify-center font-number">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </button>
        <NavLink href="/account" icon="👤" label="Account" />
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg hover:bg-crayon-yellow/20 transition-colors"
    >
      <span className="text-xl">{icon}</span>
      <span className="font-body text-xs">{label}</span>
    </Link>
  );
}
