'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  { name: 'Lego & Blocks', slug: 'lego-blocks', color: '#FF6B6B', icon: '🧱', count: 12, desc: 'Build amazing creations!' },
  { name: 'Dolls & Plush', slug: 'dolls-plush', color: '#FFD93D', icon: '🧸', count: 18, desc: 'Soft, cuddly, and loveable' },
  { name: 'Cars & Vehicles', slug: 'cars-vehicles', color: '#4D96FF', icon: '🚗', count: 9, desc: 'Vroom vroom! Racing fun' },
  { name: 'Puzzles', slug: 'puzzles', color: '#6BCB77', icon: '🧩', count: 7, desc: 'Piece together the fun' },
  { name: 'Outdoor Fun', slug: 'outdoor', color: '#FF922B', icon: '⚽', count: 6, desc: 'Play outside!' },
  { name: 'Arts & Crafts', slug: 'arts-crafts', color: '#FF6B6B', icon: '🎨', count: 10, desc: 'Get creative!' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 12 } },
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="wobbly text-4xl md:text-5xl mb-2">
          📂 Toy Categories
        </h1>
        <p className="font-body text-gray-600 mb-8">
          Find exactly what you&apos;re looking for!
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((cat) => (
          <motion.div key={cat.slug} variants={itemVariants}>
            <Link
              href={`/products?category=${cat.slug}`}
              className="sticker block p-6 rounded-[24px_10px_24px_10px] border-3 border-ink transition-all duration-300 hover:scale-[1.02] active:scale-95"
              style={{ background: `${cat.color}15` }}
            >
              <span className="text-5xl block mb-3" aria-hidden="true">{cat.icon}</span>
              <h2 className="font-display text-xl mb-1">{cat.name}</h2>
              <p className="font-body text-sm text-gray-600 mb-2">{cat.desc}</p>
              <span className="font-number text-sm text-crayon-blue">
                {cat.count} toys
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
