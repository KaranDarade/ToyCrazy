'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the admin password');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError('Invalid password. Access denied.');
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">🔐</span>
          <h1 className="font-display text-3xl mb-1">Admin Access</h1>
          <p className="font-body text-gray-600">Enter the admin password to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="sticker p-6 rounded-[24px_10px_24px_10px] border-3 border-ink bg-white"
        >
          <label htmlFor="admin-password" className="font-body font-semibold text-sm block mb-2">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body mb-4"
            autoFocus
          />
          {error && (
            <p className="font-body text-sm text-crayon-red mb-3 flex items-center gap-1">
              <span>⚠️</span> {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-crayon w-full text-lg !py-3 disabled:opacity-50"
          >
            {loading ? '🔓 Verifying...' : '🔓 Unlock Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
