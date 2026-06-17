'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { sampleUsers, sampleOrders, sampleReviews } from '@/data/sample-data';

export default function AdminUsersPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/login', { method: 'GET' })
      .then((r) => { if (!r.ok) router.replace('/admin/login'); else setAuthed(true); })
      .catch(() => router.replace('/admin/login'));
  }, [router]);

  if (authed === null) return null;

  const filtered = sampleUsers.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
  });

  const selectedUserData = selectedUser ? sampleUsers.find((u) => u.id === selectedUser) : null;
  const selectedUserOrders = selectedUserData ? sampleOrders.filter((o) => o.userId === selectedUserData.id) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="font-body text-sm text-crayon-red hover:underline">← Dashboard</Link>
              </div>
              <h1 className="font-display text-3xl mt-1">👤 Users</h1>
              <p className="font-body text-gray-600">{sampleUsers.length} registered accounts</p>
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
            placeholder="Search by name, email, or phone..."
            className="w-full mb-4 px-4 py-2.5 rounded-full border-2 border-ink/20 bg-white font-body text-sm"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Users Table */}
            <div className={`${selectedUserData ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <div className="bg-white rounded-xl border-2 border-ink/20 overflow-hidden sticker">
                <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-ink/10 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-3 font-body font-semibold text-sm">User</th>
                        <th className="text-left px-4 py-3 font-body font-semibold text-sm">Email</th>
                        <th className="text-left px-4 py-3 font-body font-semibold text-sm">Phone</th>
                        <th className="text-left px-4 py-3 font-body font-semibold text-sm">Orders</th>
                        <th className="text-left px-4 py-3 font-body font-semibold text-sm">Spent</th>
                        <th className="text-left px-4 py-3 font-body font-semibold text-sm">Member Since</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((user) => {
                        const userOrders = sampleOrders.filter((o) => o.userId === user.id);
                        const totalSpent = userOrders.reduce((s, o) => s + o.total, 0);
                        const isSelected = selectedUser === user.id;
                        return (
                          <tr
                            key={user.id}
                            onClick={() => setSelectedUser(isSelected ? null : user.id)}
                            className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all ${isSelected ? 'bg-crayon-yellow/10 ring-2 ring-inset ring-crayon-yellow' : ''}`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 shrink-0 rounded-full border-2 border-ink/20 bg-crayon-cream overflow-hidden">
                                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="font-body font-semibold text-sm">{user.name}</p>
                                  <p className="font-body text-xs text-gray-400">{user.address.city}, {user.address.state}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-body text-sm">{user.email}</td>
                            <td className="px-4 py-3 font-number text-sm">{user.phone}</td>
                            <td className="px-4 py-3 font-number text-sm">{userOrders.length}</td>
                            <td className="px-4 py-3 font-number text-sm">₹{(totalSpent / 100).toFixed(2)}</td>
                            <td className="px-4 py-3 font-body text-xs text-gray-500">{user.memberSince}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* User Detail Panel */}
            {selectedUserData && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1 space-y-4"
              >
                {/* Profile Card */}
                <div className="bg-white rounded-xl border-2 border-ink/20 sticker p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 shrink-0 rounded-full border-3 border-ink bg-crayon-cream overflow-hidden">
                        <img src={selectedUserData.avatar} alt={selectedUserData.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h2 className="font-display text-lg">{selectedUserData.name}</h2>
                        <p className="font-body text-xs text-gray-500">Member since {selectedUserData.memberSince}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-ink">✕</button>
                  </div>

                  <div className="space-y-3 font-body text-sm">
                    <div>
                      <span className="font-semibold text-xs text-gray-500 uppercase block">Email</span>
                      <span>{selectedUserData.email}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-gray-500 uppercase block">Phone</span>
                      <span>{selectedUserData.phone}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-gray-500 uppercase block">Address</span>
                      <span>{selectedUserData.address.street}, {selectedUserData.address.city}, {selectedUserData.address.state} - {selectedUserData.address.pincode}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t-2 border-ink/10">
                    <div className="text-center">
                      <p className="font-number text-xl">{selectedUserOrders.length}</p>
                      <p className="font-body text-xs text-gray-500">Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="font-number text-xl">{selectedUserOrders.filter((o) => o.status === 'delivered').length}</p>
                      <p className="font-body text-xs text-gray-500">Delivered</p>
                    </div>
                    <div className="text-center">
                      <p className="font-number text-xl">₹{(selectedUserOrders.reduce((s, o) => s + o.total, 0) / 100).toFixed(0)}</p>
                      <p className="font-body text-xs text-gray-500">Spent</p>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl border-2 border-ink/20 sticker p-5">
                  <h3 className="font-display text-base mb-3">📦 Recent Orders</h3>
                  <div className="space-y-2">
                    {selectedUserOrders.sort((a, b) => b.placedAt.localeCompare(a.placedAt)).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-2 rounded-lg border border-ink/10 hover:bg-gray-50">
                        <div>
                          <p className="font-body text-xs font-semibold">{order.orderNumber}</p>
                          <p className="font-number text-xs text-gray-500">₹{(order.total / 100).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            order.status === 'shipped' || order.status === 'out-for-delivery' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews by this user */}
                {(() => {
                  const userReviews = sampleReviews.filter((r) => r.userId === selectedUserData.id);
                  if (userReviews.length === 0) return null;
                  return (
                    <div className="bg-white rounded-xl border-2 border-ink/20 sticker p-5">
                      <h3 className="font-display text-base mb-3">⭐ Reviews ({userReviews.length})</h3>
                      <div className="space-y-2">
                        {userReviews.map((r) => (
                          <div key={r.id} className="p-2 rounded-lg border border-ink/10">
                            <div className="flex items-center gap-1 mb-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span key={i} className={`text-xs ${i < r.rating ? '' : 'opacity-20'}`}>⭐</span>
                              ))}
                            </div>
                            <p className="font-body text-xs font-semibold">{r.title}</p>
                            <p className="font-body text-xs text-gray-500 line-clamp-2">{r.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
