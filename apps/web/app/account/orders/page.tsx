'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const mockOrders = [
  {
    id: 'ord_1',
    orderNumber: 'TC-A1B2C3',
    status: 'DELIVERED',
    totalAmount: 7498,
    itemCount: 2,
    createdAt: '2026-06-10T10:30:00Z',
  },
  {
    id: 'ord_2',
    orderNumber: 'TC-D4E5F6',
    status: 'SHIPPED',
    totalAmount: 2499,
    itemCount: 1,
    createdAt: '2026-06-15T14:00:00Z',
  },
  {
    id: 'ord_3',
    orderNumber: 'TC-G7H8I9',
    status: 'PROCESSING',
    totalAmount: 3999,
    itemCount: 1,
    createdAt: '2026-06-17T09:15:00Z',
  },
];

const statusStyles: Record<string, string> = {
  DELIVERED: 'bg-crayon-green text-white',
  SHIPPED: 'bg-crayon-blue text-white',
  PROCESSING: 'bg-crayon-yellow text-ink',
  PENDING: 'bg-gray-200 text-gray-700',
  CANCELLED: 'bg-crayon-red text-white',
};

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl md:text-4xl mb-2 wobbly">
          📦 My Orders
        </h1>
        <p className="font-body text-gray-600 mb-8">
          Track and view all your ToyCraze orders
        </p>

        {mockOrders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="sticker mb-4 p-4 md:p-6 rounded-[20px_8px_20px_8px] border-3 border-ink bg-white"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="font-display text-lg hover:text-crayon-red transition-colors"
                >
                  {order.orderNumber}
                </Link>
                <p className="font-body text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="font-body text-sm text-gray-600">
                  {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`font-body text-xs font-semibold px-3 py-1 rounded-full border-2 border-ink ${
                    statusStyles[order.status]
                  }`}
                >
                  {order.status}
                </span>
                <span className="font-number text-xl">
                  ₹{(order.totalAmount / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {mockOrders.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">📭</span>
            <h2 className="font-display text-2xl mb-2">No orders yet</h2>
            <p className="font-body text-gray-600 mb-6">Time to find your perfect toy!</p>
            <Link href="/products" className="btn-crayon inline-block">
              Start Shopping
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
