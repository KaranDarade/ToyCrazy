'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  rating: number;
  category: string;
  tilt?: number;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  imageUrl,
  rating,
  category,
  tilt = 1,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, slug, price, imageUrl, category }, 1);
    toast.success(`${name} added to cart!`, {
      icon: '🎉',
    });
  };

  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <Link
      href={`/products/${slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative rounded-[20px_8px_20px_8px] border-3 border-ink bg-white p-3 transition-all duration-300"
        style={{ transform: `rotate(${tilt}deg)` }}
        whileHover={{ rotate: 0, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
      >
        {/* SVG hand-drawn border animation */}
        <svg
          className="absolute inset-0 pointer-events-none w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <rect
            x="2" y="2" width="96" height="96"
            fill="none"
            stroke="#2D2D2D"
            strokeWidth="2.5"
            strokeDasharray="300"
            strokeDashoffset={isHovered ? '0' : '300'}
            style={{
              transition: 'stroke-dashoffset 1.2s ease-in-out',
              rx: '18',
              ry: '8',
            }}
          />
        </svg>

        {/* Sale badge */}
        {discount > 0 && (
          <div className="absolute -top-2 -right-2 z-10 bg-crayon-orange text-white font-display text-xs px-2 py-1 rounded-full border-2 border-ink transform rotate-12">
            -{discount}%
          </div>
        )}

        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-[16px_6px_16px_6px] bg-crayon-cream mb-3">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Category tag */}
        <span className="font-body text-xs font-semibold text-crayon-blue uppercase tracking-wider">
          {category}
        </span>

        {/* Name */}
        <h3 className="font-display text-base md:text-lg mt-1 leading-tight line-clamp-2">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1" aria-label={`Rating: ${rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              width="14" height="14"
              viewBox="0 0 24 24"
              fill={i < Math.round(rating) ? '#FFD93D' : '#E5E7EB'}
              stroke="#2D2D2D"
              strokeWidth="1.5"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
          <span className="font-body text-xs text-gray-500 ml-1">({rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-number text-xl price">
            ₹{(price / 100).toFixed(2)}
          </span>
          {compareAtPrice && (
            <span className="font-number text-sm line-through text-gray-400">
              ₹{(compareAtPrice / 100).toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          className="btn-crayon w-full mt-3 !px-3 !py-2 text-sm"
          aria-label={`Add ${name} to cart`}
        >
          🛒 Add to Cart
        </button>
      </motion.div>
    </Link>
  );
}
