'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = orderNumber.trim().toUpperCase();
    if (!val) {
      setError('Please enter an order number');
      return;
    }
    setLoading(true);
    // Try to look up the order
    try {
      const res = await fetch(`/api/track-order?orderNumber=${encodeURIComponent(val)}`);
      if (!res.ok) {
        setError('Order not found. Please check your order number.');
        setLoading(false);
        return;
      }
      router.push(`/track-order/${encodeURIComponent(val)}`);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <span className="text-5xl block mb-4">📦</span>
        <h1 className="font-display text-3xl md:text-4xl mb-2 wobbly">
          Track Your Order
        </h1>
        <p className="font-body text-gray-600">
          Enter your order number to see the latest status
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="sticker p-6 rounded-[24px_10px_24px_10px] border-3 border-ink bg-white"
      >
        <label htmlFor="orderNumber" className="font-body font-semibold text-sm block mb-2">
          Order Number
        </label>
        <div className="flex gap-3">
          <input
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => { setOrderNumber(e.target.value.toUpperCase()); setError(''); }}
            placeholder="e.g. TC-250001"
            className="flex-1 px-4 py-3 rounded-full border-3 border-ink bg-paper font-number text-lg uppercase"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-crayon !px-8 !py-3 disabled:opacity-50"
          >
            {loading ? '⏳' : '🔍 Track'}
          </button>
        </div>
        {error && (
          <p className="font-body text-sm text-crayon-red mt-2 flex items-center gap-1">
            <span>⚠️</span> {error}
          </p>
        )}
        <p className="font-body text-xs text-gray-400 mt-3">
          Sample order numbers: TC-250000, TC-250001, TC-250002, TC-250003
        </p>
      </motion.form>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { icon: '🔍', title: 'Enter Number', desc: 'Find your order number in your confirmation email' },
          { icon: '📋', title: 'View Status', desc: 'See the current status of your order in real-time' },
          { icon: '📬', title: 'Get Updates', desc: 'Know exactly when your package will arrive' },
        ].map((step, i) => (
          <div key={i} className="text-center p-4 rounded-[16px_6px_16px_6px] border-2 border-ink/30 bg-paper">
            <span className="text-3xl block mb-2">{step.icon}</span>
            <h3 className="font-display text-sm mb-1">{step.title}</h3>
            <p className="font-body text-xs text-gray-500">{step.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
