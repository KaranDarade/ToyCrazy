'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (parseInt(age) < 13) {
      toast.error('Parent or guardian must create the account for children under 13');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? 'Registration failed');
        setLoading(false);
        return;
      }

      toast.success('Account created! Welcome to ToyCraze! 🎉');
      router.push('/auth/login');
    } catch {
      toast.error('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        className="w-full max-w-md"
      >
        <div className="relative p-8 rounded-[40px_16px_40px_16px] border-3 border-ink bg-white">
          <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full border-2 border-ink bg-crayon-green" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full border-2 border-ink bg-crayon-blue" />

          <div className="text-center mb-6">
            <span className="text-4xl block mb-2">🎪</span>
            <h1 className="font-display text-3xl wobbly">
              Join the
              <span className="block text-crayon-green">ToyCraze Club!</span>
            </h1>
            <p className="font-body text-gray-600 mt-2">
              Get exclusive deals and track your orders
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="font-body font-semibold text-sm block mb-1">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body focus:outline-none focus:ring-2 focus:ring-crayon-yellow transition-all"
                placeholder="e.g., Alex"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="font-body font-semibold text-sm block mb-1">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body focus:outline-none focus:ring-2 focus:ring-crayon-yellow transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="font-body font-semibold text-sm block mb-1">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body focus:outline-none focus:ring-2 focus:ring-crayon-yellow transition-all"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label htmlFor="age" className="font-body font-semibold text-sm block mb-1">
                Age
              </label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                min={1}
                max={120}
                className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body focus:outline-none focus:ring-2 focus:ring-crayon-yellow transition-all"
                placeholder="Your age"
              />
              <p className="font-body text-xs text-gray-500 mt-1">
                Users under 13 need a parent to create the account
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-crayon w-full text-lg !py-3 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : '🎉 Join Now!'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-body text-sm text-gray-600">
              Already a member?{' '}
              <Link href="/auth/login" className="text-crayon-blue hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
