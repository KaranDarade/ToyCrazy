'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { sampleOrders, sampleUsers } from '@/data/sample-data';
import type { OrderStatus } from '@/data/sample-data';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  'out-for-delivery': 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  'out-for-delivery': 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const allStatuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/login', { method: 'GET' })
      .then((r) => { if (!r.ok) router.replace('/admin/login'); else setAuthed(true); })
      .catch(() => router.replace('/admin/login'));
  }, [router]);

  if (authed === null) return null;

  const filtered = sampleOrders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.orderNumber.toLowerCase().includes(q) || o.userName.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => b.placedAt.localeCompare(a.placedAt));

  const selectedOrderData = selectedOrder ? sampleOrders.find((o) => o.id === selectedOrder) : null;
  const statusCounts = allStatuses.reduce((acc, s) => ({ ...acc, [s]: sampleOrders.filter((o) => o.status === s).length }), {} as Record<OrderStatus, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="font-body text-sm text-crayon-red hover:underline">← Dashboard</Link>
              </div>
              <h1 className="font-display text-3xl mt-1">📦 Orders</h1>
              <p className="font-body text-gray-600">{sampleOrders.length} total orders</p>
            </div>
            <button
              onClick={async () => { await fetch('/api/admin/login', { method: 'DELETE' }); router.push('/admin/login'); }}
              className="text-sm font-body text-crayon-red hover:underline"
            >
              Logout
            </button>
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold border-2 border-ink/20 transition-all ${filter === 'all' ? 'bg-ink text-white' : 'bg-white hover:bg-gray-100'}`}
            >
              All ({sampleOrders.length})
            </button>
            {allStatuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold border-2 border-ink/20 transition-all ${filter === s ? 'bg-ink text-white' : 'bg-white hover:bg-gray-100'}`}
              >
                {statusLabels[s]} ({statusCounts[s]})
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or customer name..."
            className="w-full mb-4 px-4 py-2.5 rounded-full border-2 border-ink/20 bg-white font-body text-sm"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders Table */}
            <div className={`${selectedOrderData ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <div className="bg-white rounded-xl border-2 border-ink/20 overflow-hidden sticker">
                <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-ink/10 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-3 font-body font-semibold text-sm">Order</th>
                        <th className="text-left px-4 py-3 font-body font-semibold text-sm">Customer</th>
                        <th className="text-left px-4 py-3 font-body font-semibold text-sm">Items</th>
                        <th className="text-left px-4 py-3 font-body font-semibold text-sm">Total</th>
                        <th className="text-left px-4 py-3 font-body font-semibold text-sm">Payment</th>
                        <th className="text-left px-4 py-3 font-body font-semibold text-sm">Status</th>
                        <th className="text-left px-4 py-3 font-body font-semibold text-sm">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((order) => (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all ${selectedOrder === order.id ? 'bg-crayon-yellow/10 ring-2 ring-inset ring-crayon-yellow' : ''}`}
                        >
                          <td className="px-4 py-3 font-body font-semibold text-sm">{order.orderNumber}</td>
                          <td className="px-4 py-3 font-body text-sm">
                            {order.userName}
                            <div className="text-xs text-gray-400">{sampleUsers.find((u) => u.id === order.userId)?.email}</div>
                          </td>
                          <td className="px-4 py-3 font-number text-sm">{order.items.length}</td>
                          <td className="px-4 py-3 font-number text-sm">₹{(order.total / 100).toFixed(2)}</td>
                          <td className="px-4 py-3 font-body text-xs text-gray-500">{order.paymentMethod}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                              {statusLabels[order.status]}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-body text-xs text-gray-500">{order.placedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Detail Panel */}
            {selectedOrderData && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-xl border-2 border-ink/20 sticker p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="font-display text-lg">#{selectedOrderData.orderNumber}</h2>
                    <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-ink text-lg">✕</button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[selectedOrderData.status]}`}>
                      {statusLabels[selectedOrderData.status]}
                    </span>
                    <span className="font-number text-xs text-gray-400">{selectedOrderData.placedAt}</span>
                  </div>

                  {/* Customer */}
                  <div>
                    <h3 className="font-body font-semibold text-xs text-gray-500 uppercase mb-1">Customer</h3>
                    <p className="font-body">{selectedOrderData.userName}</p>
                    <p className="font-body text-xs text-gray-500">{sampleUsers.find((u) => u.id === selectedOrderData.userId)?.email}</p>
                    <p className="font-body text-xs text-gray-500">{sampleUsers.find((u) => u.id === selectedOrderData.userId)?.phone}</p>
                  </div>

                  {/* Shipping */}
                  <div>
                    <h3 className="font-body font-semibold text-xs text-gray-500 uppercase mb-1">Shipping</h3>
                    <p className="font-body text-sm">{selectedOrderData.shippingAddress}</p>
                    <p className="font-body text-xs text-gray-500 mt-1">Payment: {selectedOrderData.paymentMethod}</p>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="font-body font-semibold text-xs text-gray-500 uppercase mb-1">Items ({selectedOrderData.items.length})</h3>
                    <div className="space-y-2">
                      {selectedOrderData.items.map((item, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-ink/20 bg-crayon-cream">
                            <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-body text-xs font-semibold line-clamp-1">{item.productName}</p>
                            <p className="font-number text-xs text-gray-500">×{item.quantity} @ ₹{(item.price / 100).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="border-t-2 border-ink/10 pt-3 space-y-1">
                    <div className="flex justify-between text-sm font-body">
                      <span>Subtotal</span>
                      <span className="font-number">₹{(selectedOrderData.subtotal / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-body">
                      <span>Shipping</span>
                      <span className={`font-number ${selectedOrderData.shipping === 0 ? 'text-crayon-green' : ''}`}>
                        {selectedOrderData.shipping === 0 ? 'Free' : `₹${(selectedOrderData.shipping / 100).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-display text-lg border-t-2 border-ink/10 pt-1">
                      <span>Total</span>
                      <span className="font-number text-crayon-red">₹{(selectedOrderData.total / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div>
                    <h3 className="font-body font-semibold text-xs text-gray-500 uppercase mb-2">Timeline</h3>
                    <div className="space-y-2">
                      {selectedOrderData.statusHistory.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <div className="w-2 h-2 rounded-full mt-1.5 bg-crayon-yellow border border-ink shrink-0" />
                          <div>
                            <span className="font-body font-semibold">{statusLabels[h.status]}</span>
                            <span className="font-body text-gray-500"> — {h.note}</span>
                            <div className="font-number text-gray-400">{h.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedOrderData.feedback && (
                    <div className="bg-crayon-green/5 border-2 border-crayon-green/30 rounded-xl p-3">
                      <h3 className="font-body font-semibold text-xs text-gray-500 uppercase mb-1">Customer Feedback</h3>
                      <p className="font-body text-sm italic">&ldquo;{selectedOrderData.feedback}&rdquo;</p>
                      {selectedOrderData.rating && (
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={`text-sm ${i < selectedOrderData.rating! ? '' : 'opacity-20'}`}>⭐</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
