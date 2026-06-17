'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { SampleOrder, OrderStatus } from '@/data/sample-data';

const statusIcons: Record<OrderStatus, string> = {
  pending: '📝',
  confirmed: '✅',
  processing: '📦',
  shipped: '🚚',
  'out-for-delivery': '🚛',
  delivered: '🎉',
  cancelled: '❌',
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  'out-for-delivery': 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const progressSteps: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered',
];

export default function OrderTrackingPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<SampleOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/track-order?orderNumber=${encodeURIComponent(orderNumber)}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setOrder(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="inline-block w-12 h-12 border-4 border-crayon-yellow border-t-transparent rounded-full animate-spin" />
        <p className="font-body mt-4 text-gray-500">Looking up your order...</p>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <span className="text-6xl block mb-4">🔍</span>
        <h1 className="font-display text-3xl mb-2">Order Not Found</h1>
        <p className="font-body text-gray-600 mb-6">
          We couldn&apos;t find an order with number <strong>{orderNumber}</strong>
        </p>
        <Link href="/track-order" className="btn-crayon inline-block">
          Try Again
        </Link>
      </div>
    );
  }

  const currentStepIndex = order.status === 'cancelled'
    ? -1
    : progressSteps.indexOf(order.status);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
      >
        <div>
          <Link href="/track-order" className="font-body text-sm text-crayon-red hover:underline mb-2 inline-block">
            ← Track Another Order
          </Link>
          <h1 className="font-display text-2xl md:text-3xl">
            Order #{order.orderNumber}
          </h1>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center gap-2 bg-crayon-yellow/30 px-4 py-2 rounded-full border-2 border-ink">
          <span className="text-xl">{statusIcons[order.status]}</span>
          <span className="font-body font-bold">{statusLabels[order.status]}</span>
        </div>
      </motion.div>

      {/* Progress Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="sticker p-6 rounded-[24px_10px_24px_10px] border-3 border-ink bg-white mb-6"
      >
        {order.status === 'cancelled' ? (
          <div className="text-center py-6">
            <span className="text-5xl block mb-3">❌</span>
            <h2 className="font-display text-2xl mb-2 text-crayon-red">Order Cancelled</h2>
            <p className="font-body text-gray-600">This order was cancelled on {order.statusHistory[1]?.date || order.placedAt}</p>
          </div>
        ) : (
          <div className="relative">
            {/* Progress bar background */}
            <div className="absolute top-6 left-8 right-8 h-2 bg-ink/10 rounded-full">
              <div
                className="h-full bg-crayon-green rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${Math.max(0, (currentStepIndex / (progressSteps.length - 1)) * 100)}%`,
                }}
              />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {progressSteps.map((step, i) => {
                const isCompleted = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={step} className="flex flex-col items-center relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className={`w-14 h-14 rounded-full border-3 border-ink flex items-center justify-center text-2xl transition-all ${
                        isCompleted ? 'bg-crayon-green scale-110' : 'bg-white'
                      } ${isCurrent ? 'ring-4 ring-crayon-yellow ring-offset-2' : ''}`}
                    >
                      {isCompleted ? '✓' : statusIcons[step]}
                    </motion.div>
                    <span className="font-body text-xs mt-2 text-center font-bold leading-tight max-w-[80px]">
                      {statusLabels[step]}
                    </span>
                    {order.statusHistory[i] && (
                      <span className="font-number text-[10px] text-gray-400 mt-0.5">
                        {order.statusHistory[i].date}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Status notes */}
        <div className="mt-6 space-y-2 border-t-2 border-ink/10 pt-4">
          {order.statusHistory.map((h, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="text-base shrink-0 mt-0.5">{statusIcons[h.status]}</span>
              <div>
                <span className="font-body font-semibold">{statusLabels[h.status]}</span>
                <span className="font-body text-gray-500"> — {h.note}</span>
                <span className="font-number text-gray-400 text-xs block">{h.date}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sticker p-5 rounded-[20px_8px_20px_8px] border-3 border-ink bg-white"
        >
          <h2 className="font-display text-lg mb-4">🛒 Items ({order.items.length})</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-14 h-14 shrink-0 rounded-[12px_4px_12px_4px] overflow-hidden border-2 border-ink/20 bg-crayon-cream">
                  <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-sm leading-tight line-clamp-1">{item.productName}</p>
                  <p className="font-number text-xs text-gray-500">×{item.quantity}</p>
                </div>
                <div className="ml-auto font-number text-sm">
                  ₹{((item.price * item.quantity) / 100).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Shipping & Payment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="sticker p-5 rounded-[20px_8px_20px_8px] border-3 border-ink bg-white"
        >
          <h2 className="font-display text-lg mb-4">📍 Delivery Details</h2>
          <div className="space-y-3 font-body text-sm">
            <div>
              <span className="font-semibold block text-xs text-gray-500 uppercase">Shipping Address</span>
              <p className="font-body">{order.shippingAddress}</p>
            </div>
            <div>
              <span className="font-semibold block text-xs text-gray-500 uppercase">Payment Method</span>
              <p className="font-body">{order.paymentMethod}</p>
            </div>
            <div>
              <span className="font-semibold block text-xs text-gray-500 uppercase">Placed On</span>
              <p className="font-body">{order.placedAt}</p>
            </div>
            {order.estimatedDelivery && (
              <div>
                <span className="font-semibold block text-xs text-gray-500 uppercase">Estimated Delivery</span>
                <p className="font-body">{order.estimatedDelivery}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="sticker p-5 rounded-[20px_8px_20px_8px] border-3 border-ink bg-white"
      >
        <h2 className="font-display text-lg mb-3">💰 Order Summary</h2>
        <div className="space-y-2 font-body text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-number">₹{(order.subtotal / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className={`font-number ${order.shipping === 0 ? 'text-crayon-green' : ''}`}>
              {order.shipping === 0 ? 'FREE' : `₹${(order.shipping / 100).toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between font-display text-lg border-t-2 border-ink/20 pt-2 mt-2">
            <span>Total</span>
            <span className="font-number text-crayon-red">₹{(order.total / 100).toFixed(2)}</span>
          </div>
        </div>
      </motion.div>

      {/* Feedback (if delivered) */}
      {order.status === 'delivered' && order.feedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 sticker p-5 rounded-[20px_8px_20px_8px] border-3 border-crayon-green bg-crayon-green/5"
        >
          <h2 className="font-display text-lg mb-2">💬 Your Feedback</h2>
          <p className="font-body text-sm italic">&ldquo;{order.feedback}&rdquo;</p>
          {order.rating && (
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={`text-lg ${i < order.rating! ? '' : 'opacity-20'}`}>⭐</span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link href="/track-order" className="btn-crayon-ghost">
          🔍 Track Another
        </Link>
        <Link href="/products" className="btn-crayon-secondary">
          🛍️ Shop More
        </Link>
        <Link href="/contact" className="btn-crayon-ghost">
          💬 Need Help?
        </Link>
      </div>
    </div>
  );
}
