import type { Metadata } from 'next';
import { Providers } from './providers';
import '@/styles/globals.css';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { MobileNav } from '@/components/ui/MobileNav';
import { SearchBar } from '@/components/ui/SearchBar';
import { CartBadge } from '@/components/ui/CartBadge';
import { BackgroundDoodles } from '@/components/animations/BackgroundDoodles';

export const metadata: Metadata = {
  title: {
    default: 'ToyCraze — Toys That Make You SMILE!',
    template: '%s | ToyCraze',
  },
  description: 'Discover the most wonderful toys for kids of all ages. Hand-picked, joyfully delivered.',
  keywords: ['toys', 'kids toys', 'educational toys', 'lego', 'dolls', 'games'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-paper font-body text-ink antialiased">
        <Providers>
          <BackgroundDoodles />
          <div className="flex min-h-screen flex-col relative z-10">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="relative z-50 border-b-3 border-ink bg-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl md:text-3xl text-crayon-red crayon-underline">
            ToyCraze
          </span>
          <span className="text-lg" aria-hidden="true">🧸</span>
        </a>
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <a href="/products" className="font-body font-semibold text-lg hover:text-crayon-red transition-colors">
            Shop
          </a>
          <a href="/categories" className="font-body font-semibold text-lg hover:text-crayon-red transition-colors">
            Categories
          </a>
          <a href="/account/orders" className="font-body font-semibold text-lg hover:text-crayon-red transition-colors">
            My Orders
          </a>
          <a href="/track-order" className="font-body font-semibold text-lg hover:text-crayon-red transition-colors">
            📦 Track
          </a>
        </nav>
        <div className="hidden md:block mx-4">
          <SearchBar />
        </div>
        <div className="flex items-center gap-3">
          <CartBadge />
          <a
            href="/auth/login"
            className="btn-crayon !px-4 !py-2 text-sm"
          >
            Sign In
          </a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative mt-16 border-t-3 border-ink bg-crayon-cream pt-8 pb-24 md:pb-8">
      {/* Notebook doodle decorations */}
      <div className="absolute top-0 left-4 w-8 h-8 rounded-full border-2 border-ink bg-crayon-yellow opacity-30" />
      <div className="absolute top-4 right-8 w-6 h-6 border-2 border-ink bg-crayon-red opacity-20 rotate-12" />
      <div className="absolute bottom-8 left-1/3 w-10 h-10 rounded-full border-2 border-ink border-dashed opacity-20" />

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-xl text-crayon-red mb-3">ToyCraze</h3>
            <p className="font-body text-sm leading-relaxed text-gray-700">
              Making childhood magical, one toy at a time. Hand-picked with love and delivered with joy.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 font-body text-sm">
              <li><a href="/products" className="hover:text-crayon-red">All Toys</a></li>
              <li><a href="/track-order" className="hover:text-crayon-red">Track Order</a></li>
              <li><a href="/contact" className="hover:text-crayon-red">Contact Us</a></li>
              <li><a href="/faq" className="hover:text-crayon-red">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg mb-3">Safety First</h3>
            <p className="font-body text-sm leading-relaxed text-gray-700">
              All toys meet strict safety standards. Age recommendations on every product.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t-2 border-ink/20 pt-4 text-center font-body text-xs text-gray-600">
          &copy; {new Date().getFullYear()} ToyCraze. Made with crayons and love.
        </div>
      </div>
    </footer>
  );
}
