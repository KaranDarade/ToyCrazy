'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 3–5 business days. Express shipping is 1–2 business days. Free shipping on orders over ₹999!',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns within 30 days of delivery. Items must be unused and in original packaging. Start a return from your account page.',
  },
  {
    q: 'Are your toys safe?',
    a: 'Absolutely! All our toys meet or exceed BIS safety standards (IS 9873). We only source from certified manufacturers.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Currently we ship across all states and union territories in India. International shipping is coming soon — sign up for our newsletter to be notified!',
  },
  {
    q: 'Can I track my order?',
    a: 'Yes! Once your order ships, you\'ll receive a tracking number via email. You can also track from your account orders page.',
  },
  {
    q: 'How do I contact customer support?',
    a: 'You can reach us at hello@toycraze.com, call +91 1800-TOYCRAZE, or use the contact form on our website. We respond within 24 hours.',
  },
  {
    q: 'Do you have gift wrapping?',
    a: 'Yes! All orders can be gift wrapped for an additional ₹199. Just select the gift wrap option at checkout.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'You can modify or cancel your order within 1 hour of placing it. After that, it enters processing and cannot be changed.',
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl md:text-5xl mb-2 wobbly">
          ❓ FAQ
        </h1>
        <p className="font-body text-gray-600 mb-8">
          Answers to the most common questions from our toy-loving families!
        </p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-[16px_6px_16px_6px] border-3 border-ink bg-white overflow-hidden"
            >
              <button
                onClick={() => setOpenId(openId === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left font-display text-lg hover:bg-crayon-yellow/10 transition-colors"
                aria-expanded={openId === i}
              >
                <span>{faq.q}</span>
                <motion.span
                  animate={{ rotate: openId === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl shrink-0 ml-4"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {openId === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 font-body text-gray-700 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
