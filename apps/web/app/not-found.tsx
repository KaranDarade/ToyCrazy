'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 12 }}
      >
        <motion.div
          className="text-8xl mb-6"
          animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
        >
          🔍
        </motion.div>
        <h1 className="font-display text-5xl md:text-6xl wobbly mb-2">
          Oh No! <span className="text-crayon-red">404</span>
        </h1>
        <p className="font-body text-lg text-gray-600 mb-2">
          This toy rolled away and hid somewhere!
        </p>
        <p className="font-body text-sm text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-crayon text-lg px-8 py-3">
            🏠 Go Home
          </Link>
          <Link href="/products" className="btn-crayon-secondary text-lg px-8 py-3">
            🧸 Browse Toys
          </Link>
        </div>
        <div className="mt-12 text-4xl space-x-3 opacity-30" aria-hidden="true">
          <span>🚀</span>
          <span>🧩</span>
          <span>🎪</span>
          <span>🧸</span>
          <span>⚽</span>
        </div>
      </motion.div>
    </div>
  );
}
