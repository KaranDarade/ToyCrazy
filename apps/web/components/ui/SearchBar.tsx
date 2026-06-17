'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }
    fetch(`/api/products?search=${encodeURIComponent(debouncedQuery)}&pageSize=5`)
      .then((r) => r.json())
      .then((data) => setResults(data.data ?? []))
      .catch(() => setResults([]));
  }, [debouncedQuery]);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/products/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="Search toys..."
          className="w-full md:w-64 px-4 py-2 pr-10 rounded-full border-3 border-ink bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-crayon-yellow placeholder:text-gray-400"
          aria-label="Search toys"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-crayon-yellow border-2 border-ink flex items-center justify-center text-sm hover:bg-crayon-orange transition-colors"
          aria-label="Search"
        >
          🔍
        </button>
      </form>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white border-3 border-ink rounded-[16px_6px_16px_6px] overflow-hidden z-50 shadow-comic"
          >
            {results.map((product: any) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product.slug)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-crayon-yellow/20 transition-colors text-left border-b-2 border-ink/10 last:border-b-0"
              >
                <div className="w-10 h-10 rounded-full bg-crayon-cream border-2 border-ink overflow-hidden shrink-0">
                  {product.imageUrls?.[0] && (
                    <img
                      src={product.imageUrls[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-body font-semibold text-sm truncate">{product.name}</p>
                  <p className="font-number text-xs">₹{(product.price / 100).toFixed(2)}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
