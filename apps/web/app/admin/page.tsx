'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { sampleUsers, sampleOrders, sampleReviews } from '@/data/sample-data';

export default function AdminDashboard() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/admin/login', { method: 'GET' })
      .then((r) => { if (!r.ok) router.replace('/admin/login'); else setAuthed(true); })
      .catch(() => router.replace('/admin/login'));
  }, [router]);

  if (authed === null) return null;

  const totalRevenue = sampleOrders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = sampleOrders.filter((o) => o.status === 'pending' || o.status === 'processing' || o.status === 'confirmed').length;
  const deliveredOrders = sampleOrders.filter((o) => o.status === 'delivered').length;
  const cancelledOrders = sampleOrders.filter((o) => o.status === 'cancelled').length;

  const stats = [
    { label: 'Total Users', value: sampleUsers.length, icon: '👤', color: 'bg-crayon-blue' },
    { label: 'Total Orders', value: sampleOrders.length, icon: '📦', color: 'bg-crayon-green' },
    { label: 'Pending Orders', value: pendingOrders, icon: '⏳', color: 'bg-crayon-yellow' },
    { label: 'Revenue', value: `₹${(totalRevenue / 100).toFixed(0)}`, icon: '💰', color: 'bg-crayon-red' },
    { label: 'Delivered', value: deliveredOrders, icon: '✅', color: 'bg-green-500' },
    { label: 'Cancelled', value: cancelledOrders, icon: '❌', color: 'bg-red-400' },
    { label: 'Reviews', value: sampleReviews.length, icon: '⭐', color: 'bg-purple-400' },
    { label: 'Products', value: '108', icon: '🧸', color: 'bg-orange-400' },
  ];

  const recentOrders = [...sampleOrders].sort((a, b) => b.placedAt.localeCompare(a.placedAt)).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl">🛠️ Admin Dashboard</h1>
              <p className="font-body text-gray-600">Manage your ToyCraze store</p>
            </div>
            <button
              onClick={async () => {
                await fetch('/api/admin/login', { method: 'DELETE' });
                router.push('/admin/login');
              }}
              className="text-sm font-body text-crayon-red hover:underline"
            >
              Logout
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border-2 border-ink/20 bg-white p-4 sticker"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-lg border-2 border-ink`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-body">{stat.label}</p>
                    <p className="text-2xl font-bold font-number">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              href="/admin/orders"
              className="rounded-xl border-2 border-ink/20 bg-white p-5 hover:border-crayon-green transition-all hover:shadow-md sticker"
            >
              <span className="text-2xl block mb-2">📦</span>
              <h2 className="font-display text-lg">Manage Orders</h2>
              <p className="font-body text-sm text-gray-600">View all {sampleOrders.length} orders, update statuses, track deliveries</p>
            </Link>
            <Link
              href="/admin/users"
              className="rounded-xl border-2 border-ink/20 bg-white p-5 hover:border-crayon-blue transition-all hover:shadow-md sticker"
            >
              <span className="text-2xl block mb-2">👤</span>
              <h2 className="font-display text-lg">Manage Users</h2>
              <p className="font-body text-sm text-gray-600">View all {sampleUsers.length} customer accounts and profiles</p>
            </Link>
            <Link
              href="/admin/products"
              className="rounded-xl border-2 border-ink/20 bg-white p-5 hover:border-crayon-yellow transition-all hover:shadow-md sticker"
            >
              <span className="text-2xl block mb-2">🧸</span>
              <h2 className="font-display text-lg">Manage Products</h2>
              <p className="font-body text-sm text-gray-600">Browse all 108 products in the catalog</p>
            </Link>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border-2 border-ink/20 overflow-hidden sticker">
            <div className="px-5 py-4 border-b-2 border-ink/10 flex justify-between items-center">
              <h2 className="font-display text-lg">📋 Recent Orders</h2>
              <Link href="/admin/orders" className="font-body text-sm text-crayon-red hover:underline">
                View All →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-ink/10">
                  <tr>
                    <th className="text-left px-4 py-3 font-body font-semibold text-sm">Order</th>
                    <th className="text-left px-4 py-3 font-body font-semibold text-sm">Customer</th>
                    <th className="text-left px-4 py-3 font-body font-semibold text-sm">Items</th>
                    <th className="text-left px-4 py-3 font-body font-semibold text-sm">Total</th>
                    <th className="text-left px-4 py-3 font-body font-semibold text-sm">Status</th>
                    <th className="text-left px-4 py-3 font-body font-semibold text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-body font-semibold text-sm">{order.orderNumber}</td>
                      <td className="px-4 py-3 font-body text-sm">{order.userName}</td>
                      <td className="px-4 py-3 font-number text-sm">{order.items.length}</td>
                      <td className="px-4 py-3 font-number text-sm">₹{(order.total / 100).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full border border-ink/20 ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          order.status === 'shipped' || order.status === 'out-for-delivery' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500">{order.placedAt}</td>
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
