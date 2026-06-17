'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl md:text-4xl mb-2 wobbly">
          👋 Welcome, {session.user?.name ?? 'Toy Fan'}!
        </h1>
        <p className="font-body text-gray-600 mb-8">
          Manage your orders, wishlist, and account settings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/account/orders"
            className="sticker p-6 rounded-[20px_8px_20px_8px] border-3 border-ink bg-white hover:bg-crayon-yellow/10 transition-all group"
          >
            <span className="text-3xl block mb-2">📦</span>
            <h2 className="font-display text-xl mb-1">My Orders</h2>
            <p className="font-body text-sm text-gray-600">Track and view your order history</p>
          </Link>

          <Link
            href="/account/wishlist"
            className="sticker p-6 rounded-[20px_8px_20px_8px] border-3 border-ink bg-white hover:bg-crayon-red/10 transition-all group"
          >
            <span className="text-3xl block mb-2">⭐</span>
            <h2 className="font-display text-xl mb-1">Wishlist</h2>
            <p className="font-body text-sm text-gray-600">View your saved favorites</p>
          </Link>

          <div className="sticker p-6 rounded-[20px_8px_20px_8px] border-3 border-ink bg-white">
            <span className="text-3xl block mb-2">👤</span>
            <h2 className="font-display text-xl mb-1">Profile</h2>
            <p className="font-body text-sm text-gray-600">{session.user?.email}</p>
          </div>

          <div className="sticker p-6 rounded-[20px_8px_20px_8px] border-3 border-ink bg-white">
            <span className="text-3xl block mb-2">🏠</span>
            <h2 className="font-display text-xl mb-1">Addresses</h2>
            <p className="font-body text-sm text-gray-600">Manage your shipping addresses</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
