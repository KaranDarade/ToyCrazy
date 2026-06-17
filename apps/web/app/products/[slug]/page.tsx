'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';
import { ProductViewer3D } from '@/components/shop/ProductViewer3D';

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  price: number;
  compareAtPrice?: number;
  stockQty: number;
  imageUrls: string[];
  rating: number;
  reviewCount: number;
  tags: string[];
  category: { name: string; slug: string };
}

export default function ProductDetailPage() {
  const params = useParams();
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  useEffect(() => {
    // Fetch product by slug from our mock API
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.data?.find((p: any) => p.slug === params.slug);
        setProduct(found ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-[20px_8px_20px_8px]" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-10 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <span className="text-6xl block mb-4">❓</span>
        <h1 className="font-display text-3xl mb-2">Toy Not Found</h1>
        <p className="font-body text-gray-600 mb-6">
          This toy rolled away! Maybe it&apos;s hiding?
        </p>
        <Link href="/products" className="btn-crayon inline-block">
          Back to Toys
        </Link>
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        imageUrl: product.imageUrls[0],
        category: product.category.name,
      },
      quantity,
    );
    toast.success(`${product.name} added to cart!`, { icon: '🎉' });
  };

  const tabs = [
    { id: 'description' as const, label: 'Description' },
    { id: 'reviews' as const, label: `Reviews (${product.reviewCount})` },
    { id: 'shipping' as const, label: 'Shipping' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <Link
          href="/products"
          className="font-body text-sm text-crayon-blue hover:underline"
        >
          ← Back to Toys
        </Link>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Image / 3D Viewer toggle */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="relative"
        >
          {/* View toggle */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setViewMode('photo')}
              className={`font-body text-xs font-semibold px-4 py-1.5 rounded-full border-2 border-ink transition-all ${
                viewMode === 'photo' ? 'bg-crayon-yellow' : 'bg-white hover:bg-crayon-yellow/30'
              }`}
            >
              📷 Photo
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`font-body text-xs font-semibold px-4 py-1.5 rounded-full border-2 border-ink transition-all ${
                viewMode === '3d' ? 'bg-crayon-yellow' : 'bg-white hover:bg-crayon-yellow/30'
              }`}
            >
              🎮 3D View
            </button>
          </div>

          {viewMode === 'photo' ? (
            <div className="relative aspect-square rounded-[30px_12px_30px_12px] border-3 border-ink overflow-hidden bg-crayon-cream">
              <Image
                src={product.imageUrls[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          ) : (
            <ProductViewer3D
              imageUrl={product.imageUrls[0]}
              productName={product.name}
            />
          )}

          {/* Sticker badges */}
          {discount > 0 && (
            <div className="absolute -top-3 -right-3 bg-crayon-orange text-white font-display text-sm px-3 py-1.5 rounded-full border-2 border-ink transform rotate-12">
              -{discount}% SALE
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
        >
          <span className="font-body text-sm font-semibold text-crayon-blue uppercase tracking-wider">
            {product.category.name}
          </span>

          <h1 className="font-display text-3xl md:text-4xl mt-1 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex" aria-label={`Rating: ${product.rating} out of 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={i < Math.round(product.rating) ? '#FFD93D' : '#E5E7EB'}
                  stroke="#2D2D2D"
                  strokeWidth="1.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="font-body text-sm text-gray-500">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-number text-4xl price text-crayon-red">
              ₹{(product.price / 100).toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="font-number text-xl line-through text-gray-400">
                ₹{(product.compareAtPrice / 100).toFixed(2)}
              </span>
            )}
          </div>

          {/* Short description */}
          <p className="font-body text-gray-700 mt-4 leading-relaxed">
            {product.shortDesc}
          </p>

          {/* Full description */}
          <p className="font-body text-gray-600 mt-2 leading-relaxed">
            {product.description}
          </p>

          {/* Stock status */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                product.stockQty > 10 ? 'bg-crayon-green' : product.stockQty > 0 ? 'bg-crayon-yellow' : 'bg-crayon-red'
              }`}
            />
            <span className="font-body text-sm">
              {product.stockQty > 10
                ? 'In Stock'
                : product.stockQty > 0
                  ? `Only ${product.stockQty} left!`
                  : 'Out of Stock'}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="font-body text-xs px-3 py-1 rounded-full border-2 border-ink bg-crayon-yellow/30 capitalize"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2 border-2 border-ink rounded-full px-2 py-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center font-display hover:bg-crayon-yellow transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="font-number text-xl min-w-[32px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center font-display hover:bg-crayon-green hover:text-white transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stockQty === 0}
              className="btn-crayon flex-1 text-lg !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stockQty === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12"
      >
        <div className="flex border-b-3 border-ink" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-display px-6 py-3 text-lg transition-all border-b-3 -mb-[3px] ${
                activeTab === tab.id
                  ? 'border-crayon-red text-crayon-red'
                  : 'border-transparent hover:border-ink/30'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 font-body text-gray-700 leading-relaxed">
          {activeTab === 'description' && (
            <p>{product.description}</p>
          )}
          {activeTab === 'reviews' && (
            <div className="text-center py-8">
              <span className="text-4xl block mb-2">💬</span>
              <p>Reviews coming soon! Be the first to review this toy.</p>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div>
              <p className="mb-2"><strong>Free shipping</strong> on orders over ₹999!</p>
              <p>Standard delivery: 3-5 business days</p>
              <p>Express delivery: 1-2 business days</p>
              <p className="mt-2">We ship to all states across India.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
