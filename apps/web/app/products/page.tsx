'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/shop/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imageUrls: string[];
  rating: number;
  category: { name: string; slug: string };
  tags: string[];
}

interface Meta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 150, damping: 15 },
  },
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, pageSize: 12, totalPages: 1, hasNext: false, hasPrev: false });
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (categoryFilter) params.set('category', categoryFilter);
    if (sort) params.set('sort', sort);
    params.set('page', String(page));
    params.set('pageSize', '12');

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data ?? []);
        setMeta(data.meta ?? { total: 0, page: 1, pageSize: 12, totalPages: 1, hasNext: false, hasPrev: false });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryFilter, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, sort]);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => map.set(p.category.slug, p.category.name));
    return Array.from(map.entries());
  }, [products]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="wobbly text-4xl md:text-5xl">
          {categoryFilter
            ? categories.find(([, n]) => n) ?? 'Toys'
            : 'All Toys'}
          <span className="text-crayon-red crayon-underline ml-2">🎯</span>
        </h1>
        <p className="font-body text-gray-600 mt-2">
          {meta.total} amazing toys found
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-56 shrink-0">
          <div className="sticker p-4 rounded-[20px_8px_20px_8px] border-3 border-ink bg-crayon-cream">
            <h2 className="font-display text-lg mb-4">Sort</h2>
            <div className="space-y-2">
              {[
                { value: 'featured', label: 'Featured' },
                { value: 'price_asc', label: 'Price: Low to High' },
                { value: 'price_desc', label: 'Price: High to Low' },
                { value: 'rating', label: 'Top Rated' },
                { value: 'newest', label: 'Newest' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSort(option.value)}
                  className={`block w-full text-left font-body px-3 py-2 rounded-full border-2 transition-all text-sm ${
                    sort === option.value
                      ? 'border-ink bg-crayon-yellow font-bold'
                      : 'border-transparent hover:border-ink/30'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {categoryFilter && (
              <div className="mt-4 pt-4 border-t-2 border-ink/20">
                <a
                  href="/products"
                  className="font-body text-sm text-crayon-blue hover:underline"
                >
                  ← Clear filter
                </a>
              </div>
            )}
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[20px_8px_20px_8px] border-3 border-ink bg-white p-3 animate-pulse"
                >
                  <div className="aspect-square bg-gray-200 rounded-[16px_6px_16px_6px] mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">🔍</span>
              <h2 className="font-display text-2xl mb-2">No toys found!</h2>
              <p className="font-body text-gray-600 mb-4">
                Try a different category or search term.
              </p>
              <a href="/products" className="btn-crayon inline-block">
                View All Toys
              </a>
            </div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={page}
              >
                {products.map((product, i) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      price={product.price}
                      compareAtPrice={product.compareAtPrice}
                      imageUrl={product.imageUrls[0]}
                      rating={product.rating}
                      category={product.category.name}
                      tilt={i % 3 === 0 ? 1.8 : i % 3 === 1 ? -1.5 : 0.8}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!meta.hasPrev}
                    className="w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center font-body font-bold hover:bg-crayon-yellow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    ←
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        const d = Math.abs(p - meta.page);
                        return p === 1 || p === meta.totalPages || d <= 2;
                      })
                      .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                        if (idx > 0) {
                          const prev = arr[idx - 1];
                          if (p - prev > 1) acc.push('ellipsis');
                        }
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === 'ellipsis' ? (
                          <span key={`e${i}`} className="w-8 text-center font-body text-sm text-gray-400">
                            …
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center font-body font-bold transition-all ${
                              meta.page === p
                                ? 'bg-crayon-yellow scale-110'
                                : 'hover:bg-crayon-yellow/50'
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      )}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={!meta.hasNext}
                    className="w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center font-body font-bold hover:bg-crayon-yellow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[20px_8px_20px_8px] border-3 border-ink bg-white p-3 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-[16px_6px_16px_6px] mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
