'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1500));
    toast.success('Message sent! We\'ll get back to you soon 🎉');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl md:text-5xl mb-2 wobbly">
          📬 Contact Us
        </h1>
        <p className="font-body text-gray-600 mb-8">
          Got a question? Found a broken toy? We&apos;d love to hear from you!
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body font-semibold text-sm block mb-1">Your Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body"
                placeholder="e.g., Alex"
              />
            </div>
            <div>
              <label className="font-body font-semibold text-sm block mb-1">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="font-body font-semibold text-sm block mb-1">Subject</label>
              <input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body"
                placeholder="What's this about?"
              />
            </div>
            <div>
              <label className="font-body font-semibold text-sm block mb-1">Message</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-[20px_8px_20px_8px] border-3 border-ink bg-paper font-body resize-none"
                placeholder="Tell us more..."
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="btn-crayon w-full !py-3 disabled:opacity-50"
            >
              {sending ? '✉️ Sending...' : '✉️ Send Message'}
            </button>
          </form>

          <div className="space-y-6">
            <div className="sticker p-6 rounded-[20px_8px_20px_8px] border-3 border-ink bg-white">
              <span className="text-2xl block mb-2">📧</span>
              <h3 className="font-display text-lg">Email</h3>
              <p className="font-body text-gray-600">hello@toycraze.com</p>
            </div>
            <div className="sticker p-6 rounded-[20px_8px_20px_8px] border-3 border-ink bg-white">
              <span className="text-2xl block mb-2">📞</span>
              <h3 className="font-display text-lg">Phone</h3>
               <p className="font-body text-gray-600">+91 1800-TOYCRAZE</p>
            </div>
            <div className="sticker p-6 rounded-[20px_8px_20px_8px] border-3 border-ink bg-white">
              <span className="text-2xl block mb-2">🏪</span>
              <h3 className="font-display text-lg">Visit Us</h3>
              <p className="font-body text-gray-600">
                B-42, Sector 18<br />
                Noida, Uttar Pradesh 201301<br />
                India
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
