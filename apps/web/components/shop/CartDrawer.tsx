'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useTotalAmount, useItemCount } from '@/store/cart';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function CartDrawer() {
  const { items, isOpen, toggleCart, closeCart, removeItem, updateQuantity } = useCartStore();
  const totalAmount = useTotalAmount();
  const itemCount = useItemCount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-hidden="true"
          />
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-paper border-l-3 border-ink z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-3 border-ink">
              <h2 className="font-display text-2xl">
                🛒 Cart <span className="font-number text-lg text-crayon-red">({itemCount})</span>
              </h2>
              <button
                onClick={closeCart}
                className="w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center font-display text-lg hover:bg-crayon-red hover:text-white transition-colors"
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-5xl block mb-4">🛍️</span>
                  <p className="font-body text-gray-600">Your cart is empty!</p>
                  <Link
                    href="/products"
                    className="btn-crayon-secondary mt-4 inline-block !px-6 !py-2 text-sm"
                    onClick={closeCart}
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex gap-3 p-3 rounded-[16px_6px_16px_6px] border-2 border-ink bg-white"
                  >
                    <div className="relative w-20 h-20 shrink-0 rounded-[12px_4px_12px_4px] overflow-hidden bg-crayon-cream">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-sm leading-tight line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="font-number text-base mt-1">
                        ₹{(item.product.price * item.quantity / 100).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 rounded-full border-2 border-ink flex items-center justify-center font-display text-sm hover:bg-crayon-yellow transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="font-number text-lg min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border-2 border-ink flex items-center justify-center font-display text-sm hover:bg-crayon-green text-white hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="ml-auto w-7 h-7 rounded-full border-2 border-ink flex items-center justify-center font-body text-xs hover:bg-crayon-red hover:text-white transition-colors"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t-3 border-ink p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-display text-lg">Total</span>
                  <span className="font-number text-2xl text-crayon-red">
                    ₹{(totalAmount / 100).toFixed(2)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  className="btn-crayon w-full text-center text-lg !py-3"
                  onClick={closeCart}
                >
                  Checkout →
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
