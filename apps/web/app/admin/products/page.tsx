'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { allProducts } from '@/data/products';

export default function AdminProductsPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/login', { method: 'GET' })
      .then((r) => { if (!r.ok) router.replace('/admin/login'); else setAuthed(true); })
      .catch(() => router.replace('/admin/login'));
  }, [router]);

  if (authed === null) return null;

  const filtered = allProducts.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="font-body text-sm text-crayon-red hover:underline">← Dashboard</Link>
              </div>
              <h1 className="font-display text-3xl mt-1">🧸 Products</h1>
              <p className="font-body text-gray-600">{allProducts.length} total products in catalog</p>
            </div>
            <button
              onClick={async () => { await fetch('/api/admin/login', { method: 'DELETE' }); router.push('/admin/login'); }}
              className="text-sm font-body text-crayon-red hover:underline"
            >
              Logout
            </button>
          </div>

          {/* Search */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, category, or tag..."
            className="w-full mb-4 px-4 py-2.5 rounded-full border-2 border-ink/20 bg-white font-body text-sm"
          />

          <div className="bg-white rounded-xl border-2 border-ink/20 overflow-hidden sticker">
            <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-ink/10 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 font-body font-semibold text-sm">Image</th>
                    <th className="text-left px-4 py-3 font-body font-semibold text-sm">Name</th>
                    <th className="text-left px-4 py-3 font-body font-semibold text-sm">Category</th>
                    <th className="text-left px-4 py-3 font-body font-semibold text-sm">Price</th>
                    <th className="text-left px-4 py-3 font-body font-semibold text-sm">Stock</th>
                    <th className="text-left px-4 py-3 font-body font-semibold text-sm">Rating</th>
                    <th className="text-left px-4 py-3 font-body font-semibold text-sm">Age</th>
                    <th className="text-left px-4 py-3 font-body font-semibold text-sm">Featured</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-lg border border-ink/20 bg-crayon-cream overflow-hidden">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-body text-sm font-semibold">{product.name}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-body px-2 py-0.5 rounded-full bg-crayon-yellow/30 border border-ink/20">
                          {product.categoryName}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-number text-sm">
                        ₹{(product.price / 100).toFixed(2)}
                        {product.compareAtPrice && (
                          <span className="text-xs text-gray-400 line-through ml-1">₹{(product.compareAtPrice / 100).toFixed(2)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-number text-sm ${product.stockQty === 0 ? 'text-crayon-red font-bold' : product.stockQty < 10 ? 'text-crayon-red' : ''}`}>
                          {product.stockQty}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-number text-sm">{product.rating} ⭐</td>
                      <td className="px-4 py-3 font-body text-xs text-gray-500">{product.ageRange}</td>
                      <td className="px-4 py-3">
                        {product.isFeatured ? <span className="text-xs">⭐</span> : <span className="text-xs text-gray-300">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
