'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ProductCard } from '@/components/shop/ProductCard';
import { CategoryBubble } from '@/components/shop/CategoryBubble';
import { useState, useEffect, useRef } from 'react';

const categories = [
  { name: 'Lego & Blocks', slug: 'lego-blocks', color: '#FF6B6B', icon: '🧱' },
  { name: 'Dolls & Plush', slug: 'dolls-plush', color: '#FFD93D', icon: '🧸' },
  { name: 'Cars & Vehicles', slug: 'cars-vehicles', color: '#4D96FF', icon: '🚗' },
  { name: 'Puzzles', slug: 'puzzles', color: '#6BCB77', icon: '🧩' },
  { name: 'Outdoor Fun', slug: 'outdoor', color: '#FF922B', icon: '⚽' },
  { name: 'Arts & Crafts', slug: 'arts-crafts', color: '#FF6B6B', icon: '🎨' },
];

const featuredProducts = [
  { id: '1', name: 'Galaxy Explorer Lego Set', slug: 'galaxy-explorer-lego', price: 4999, imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80', rating: 4.8, category: 'Lego & Blocks' },
  { id: '2', name: 'Rainbow Unicorn Plush', slug: 'rainbow-unicorn-plush', price: 2499, compareAtPrice: 3499, imageUrl: 'https://images.unsplash.com/photo-1559454403-dd90fc27e1b7?w=400&q=80', rating: 4.9, category: 'Dolls & Plush' },
  { id: '3', name: 'Speed Racer RC Car', slug: 'speed-racer-rc-car', price: 3999, imageUrl: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80', rating: 4.6, category: 'Cars & Vehicles' },
  { id: '4', name: '1000-Piece Dino Puzzle', slug: 'dino-puzzle-1000', price: 1899, imageUrl: 'https://images.unsplash.com/photo-1610465299993-e6675c9f9cfa?w=400&q=80', rating: 4.7, category: 'Puzzles' },
  { id: '5', name: 'Robot Builder Kit', slug: 'robot-builder-kit', price: 5999, imageUrl: 'https://images.unsplash.com/photo-1563903530908-afdd155d057a?w=400&q=80', rating: 4.9, category: 'Lego & Blocks' },
  { id: '6', name: 'Princess Castle Play Set', slug: 'princess-castle-play-set', price: 4499, compareAtPrice: 5499, imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80', rating: 4.7, category: 'Dolls & Plush' },
  { id: '7', name: 'Soccer Star Training Set', slug: 'soccer-star-training', price: 2999, imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80', rating: 4.5, category: 'Outdoor Fun' },
  { id: '8', name: 'Creative Art Studio Set', slug: 'creative-art-studio', price: 3499, compareAtPrice: 4499, imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80', rating: 4.8, category: 'Arts & Crafts' },
];

const testimonials = [
  { name: 'Sarah M.', text: 'My son hasn\'t stopped playing with the Lego space set! The quality is amazing and delivery was super fast.', rating: 5, age: '8' },
  { name: 'James L.', text: 'The unicorn plush is my daughter\'s new best friend. She takes it everywhere! So soft and well-made.', rating: 5, age: '4' },
  { name: 'Priya K.', text: 'I love the educational value of the toys here. The robot kit taught my 10-year-old actual coding!', rating: 5, age: '10' },
  { name: 'Mike R.', text: 'Birthday shopping made easy. The kids loved everything. Will definitely be back for more!', rating: 5, age: '6' },
];

const giftGuides = [
  { age: '1-2', title: 'Toddler Discovery', toys: ['Wooden Building Blocks', 'Finger Paint Set', 'Aquadoodle Mat', 'Wooden Train Set'], color: '#6BCB77', icon: '👶' },
  { age: '3-5', title: 'Preschool Fun', toys: ['Rainbow Unicorn Plush', 'Magnetic Tile Builder', 'Doctor Play Set', 'Farm Animal Barn'], color: '#FFD93D', icon: '🎨' },
  { age: '6-8', title: 'Junior Explorer', toys: ['Galaxy Explorer Lego', 'Soccer Training Set', 'Dinosaur Fossil Dig', 'Marble Run'], color: '#4D96FF', icon: '🚀' },
  { age: '9-12', title: 'Tween Zone', toys: ['Robot Builder Kit', 'Speed Racer RC Car', 'Microscope Kit', 'Escape Room Box'], color: '#FF6B6B', icon: '🧠' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 12 } },
};

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const step = Math.ceil(target / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { start = target; clearInterval(timer); }
            setCount(start);
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomePage() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen">
      {/* ════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b-3 border-ink bg-gradient-to-b from-crayon-yellow/20 via-crayon-red/5 to-paper px-4 py-12 md:py-24">
        <motion.div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <span className="absolute top-16 left-[8%] text-6xl animate-float opacity-15">🚀</span>
          <span className="absolute top-24 right-[12%] text-5xl animate-float opacity-15" style={{ animationDelay: '0.8s' }}>🎪</span>
          <span className="absolute bottom-20 left-[15%] text-5xl animate-float opacity-15" style={{ animationDelay: '1.6s' }}>🎠</span>
          <span className="absolute bottom-28 right-[8%] text-5xl animate-float opacity-15" style={{ animationDelay: '2.4s' }}>🎈</span>
          <span className="absolute top-1/3 left-[60%] text-4xl animate-float opacity-10" style={{ animationDelay: '3.2s' }}>🧸</span>
          <span className="absolute top-2/3 left-[30%] text-4xl animate-float opacity-10" style={{ animationDelay: '1.2s' }}>🌟</span>
        </motion.div>

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.h1
            className="wobbly font-display text-5xl md:text-7xl lg:text-8xl leading-tight text-ink mb-4"
            initial={{ opacity: 0, y: -30, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 12 }}
          >
            Toys That Make You
            <span className="block text-crayon-red crayon-underline mt-2">SMILE!</span>
          </motion.h1>
          <motion.p
            className="font-body text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Discover a world of wonder with our hand-picked collection of{' '}
            <strong>108 amazing toys</strong> for kids of all ages.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/products" className="btn-crayon text-xl px-10 py-4 animate-wiggle">
              🎁 Shop Now
            </Link>
            <Link href="/categories" className="btn-crayon-ghost text-lg px-8 py-4">
              Explore Categories
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STATS / TRUST BAR
      ════════════════════════════════════════════════════════ */}
      <section className="border-b-3 border-ink bg-crayon-cream/50">
        <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🧸', label: 'Toys Available', target: 108, suffix: '+' },
              { icon: '⭐', label: 'Happy Customers', target: 12450, suffix: '+' },
              { icon: '📦', label: 'Orders Delivered', target: 28920, suffix: '+' },
              { icon: '💝', label: '5-Star Reviews', target: 4560, suffix: '+' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="sticker p-4 rounded-[20px_8px_20px_8px] border-2 border-ink bg-white"
              >
                <span className="text-3xl block mb-1">{stat.icon}</span>
                <div className="font-number text-2xl md:text-3xl text-crayon-red">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </div>
                <p className="font-body text-xs text-gray-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CATEGORIES
      ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <motion.h2
          className="wobbly text-center text-3xl md:text-4xl mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Shop by <span className="text-crayon-blue crayon-underline">Category</span>
        </motion.h2>
        <p className="text-center font-body text-gray-600 mb-8 max-w-xl mx-auto">
          From building blocks to arts & crafts — we have something for every little dreamer!
        </p>
        <motion.div
          className="flex flex-wrap justify-center gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={itemVariants}>
              <CategoryBubble name={cat.name} slug={cat.slug} color={cat.color} icon={cat.icon} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ════════════════════════════════════════════════════════ */}
      <section className="bg-crayon-cream border-y-3 border-ink py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <motion.h2
            className="wobbly text-center text-3xl md:text-4xl mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            🌟 Featured <span className="text-crayon-orange crayon-underline">Toys</span>
          </motion.h2>
          <p className="text-center font-body text-gray-600 mb-8 max-w-xl mx-auto">
            Our top picks this week — hand-picked by kids, approved by parents!
          </p>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {featuredProducts.slice(0, 8).map((product, i) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard {...product} tilt={i % 2 === 0 ? 1.5 : -1.2} />
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-10">
            <Link href="/products" className="btn-crayon-secondary text-lg px-8 py-3">
              Browse All 108 Toys →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          WHY CHOOSE US
      ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <motion.h2
          className="wobbly text-center text-3xl md:text-4xl mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Why Families <span className="text-crayon-red crayon-underline">Love</span> ToyCraze
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '✅', title: 'Safety First', desc: 'All toys meet strict BIS safety standards (IS 9873). Every product is tested and certified.' },
            { icon: '🎁', title: 'Free Shipping ₹999+', desc: 'Orders over ₹999 ship free. Fast delivery in 3-5 business days with tracking included.' },
            { icon: '💬', title: '24/7 Support', desc: 'Our toy experts are here to help. Contact us anytime — we typically respond within 1 hour!' },
            { icon: '🔄', title: '30-Day Returns', desc: 'Not happy? Return any toy within 30 days. No questions asked, full refund guaranteed.' },
            { icon: '🌱', title: 'Eco-Friendly', desc: 'We prioritize sustainable packaging and eco-friendly toys. Playing nice with the planet!' },
            { icon: '🏆', title: 'Award Winning', desc: 'Winner of "Best Toy Store 2026" by Kids\' Choice Awards. Trusted by 12,000+ families.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="sticker p-5 rounded-[20px_8px_20px_8px] border-3 border-ink bg-white hover:bg-crayon-yellow/5 transition-colors"
            >
              <span className="text-3xl block mb-2">{item.icon}</span>
              <h3 className="font-display text-lg mb-1">{item.title}</h3>
              <p className="font-body text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          GIFT GUIDE BY AGE
      ════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-crayon-blue/5 to-paper border-y-3 border-ink py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <motion.h2
            className="wobbly text-center text-3xl md:text-4xl mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            🎯 Gift Guide by <span className="text-crayon-blue crayon-underline">Age</span>
          </motion.h2>
          <p className="text-center font-body text-gray-600 mb-8 max-w-xl mx-auto">
            Not sure what to get? We&apos;ve picked the perfect toys for every age!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftGuides.map((guide, i) => (
              <motion.div
                key={guide.age}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-[24px_10px_24px_10px] border-3 border-ink p-5"
                style={{ background: `${guide.color}15` }}
              >
                <span className="text-3xl block mb-2">{guide.icon}</span>
                <span className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide">Ages {guide.age}</span>
                <h3 className="font-display text-xl mt-1 mb-3">{guide.title}</h3>
                <ul className="space-y-1.5">
                  {guide.toys.map((toy) => (
                    <li key={toy} className="font-body text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink shrink-0" />
                      {toy}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <motion.h2
          className="wobbly text-center text-3xl md:text-4xl mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          💬 What <span className="text-crayon-green crayon-underline">Parents</span> Say
        </motion.h2>
        <p className="text-center font-body text-gray-600 mb-8 max-w-xl mx-auto">
          Real reviews from real families who love ToyCraze!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="sticker p-5 rounded-[20px_8px_20px_8px] border-3 border-ink bg-white"
            >
              <div className="flex gap-1 mb-2">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#FFD93D" stroke="#2D2D2D" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="font-body text-sm text-gray-700 leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center justify-between">
                <span className="font-body font-semibold text-sm">{t.name}</span>
                <span className="font-body text-xs text-gray-500">Age {t.age}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TRUST BADGES
      ════════════════════════════════════════════════════════ */}
      <section className="bg-crayon-cream border-y-3 border-ink py-10">
        <div className="mx-auto max-w-7xl px-4">
          <motion.p
            className="text-center font-body text-sm text-gray-500 mb-6 uppercase tracking-wider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Trusted by families worldwide
          </motion.p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            {['🏅 ASTM Safety', '⭐ 4.9 Average', '🔒 SSL Secure', '📦 Free Returns', '🌱 Eco Pledge', '💳 Secure Pay'].map((badge) => (
              <motion.div
                key={badge}
                className="flex items-center gap-2 font-body text-sm font-semibold text-gray-700"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {badge}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SURPRISE BOX
      ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16 text-center">
        <motion.div
          className="inline-block p-8 md:p-12 rounded-[40px_20px_40px_20px] border-3 border-ink bg-gradient-to-br from-crayon-yellow/30 to-crayon-red/10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring' }}
        >
          <motion.div
            className="text-7xl md:text-8xl mb-4"
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            🎁
          </motion.div>
          <h2 className="font-display text-3xl md:text-4xl mb-2">
            Today&apos;s Surprise Box
          </h2>
          <p className="font-body text-gray-600 mb-6 max-w-md mx-auto">
            A mystery toy delivered every month! What will you get? 🕵️
          </p>
          <Link href="/products/surprise-box" className="btn-crayon text-lg px-10 py-3 inline-block">
            I&apos;m Feeling Lucky!
          </Link>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          NEWSLETTER
      ════════════════════════════════════════════════════════ */}
      <section className="bg-crayon-red/5 border-y-3 border-ink py-12 md:py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-5xl block mb-4">✉️</span>
            <h2 className="font-display text-3xl md:text-4xl mb-2">
              Join the <span className="text-crayon-red crayon-underline">Toy Club</span>!
            </h2>
            <p className="font-body text-gray-600 mb-6 max-w-md mx-auto">
              Get exclusive deals, new toy alerts, and a <strong>10% discount</strong> on your first order!
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); setEmail(''); alert('🎉 Welcome to the Toy Club! Check your email for 10% off.'); }}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="flex-1 w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-crayon-yellow"
              />
              <button type="submit" className="btn-crayon whitespace-nowrap !px-6 !py-3 shrink-0">
                🎉 Subscribe
              </button>
            </form>
            <p className="font-body text-xs text-gray-500 mt-3">
              No spam, ever. Unsubscribe anytime. We respect your inbox!
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          BRAND PROMISE / CTA
      ════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl mb-4">
            Ready to Make a Child&apos;s Day? <span className="inline-block animate-wiggle">😊</span>
          </h2>
          <p className="font-body text-gray-600 mb-8 max-w-lg mx-auto">
            Every toy we sell is hand-picked for quality, safety, and sheer joy. Free shipping on orders over ₹999!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products" className="btn-crayon text-xl px-10 py-4">
              🎁 Start Shopping
            </Link>
            <Link href="/contact" className="btn-crayon-ghost text-lg px-8 py-4">
              📬 Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
