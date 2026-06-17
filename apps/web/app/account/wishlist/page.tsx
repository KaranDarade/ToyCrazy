'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ProductCard } from '@/components/shop/ProductCard';

const wishlistItems = [
  {
    id: '7',
    name: 'Robot Builder Kit',
    slug: 'robot-builder-kit',
    price: 5999,
    imageUrl: 'https://images.unsplash.com/photo-1563903530908-afdd155d057a?w=400&q=80',
    rating: 4.9,
    category: 'Lego & Blocks',
  },
  {
    id: '8',
    name: 'Princess Castle Play Set',
    slug: 'princess-castle-play-set',
    price: 4499,
    compareAtPrice: 5499,
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80',
    rating: 4.7,
    category: 'Dolls & Plush',
  },
];

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl md:text-4xl mb-2 wobbly">
          ⭐ My Wishlist
        </h1>
        <p className="font-body text-gray-600 mb-8">
          Toys you&apos;ve saved for later
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard
                {...item}
                tilt={i % 2 === 0 ? 1.2 : -1.8}
              />
            </motion.div>
          ))}
        </div>

        {wishlistItems.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">💔</span>
            <h2 className="font-display text-2xl mb-2">Your wishlist is empty</h2>
            <p className="font-body text-gray-600 mb-6">
              Find toys you love and save them here!
            </p>
            <Link href="/products" className="btn-crayon inline-block">
              Browse Toys
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
