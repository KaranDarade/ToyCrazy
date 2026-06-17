# 🧸 ToyCraze — Crayon Kingdom E-Commerce

> A hand-drawn, crayon-themed children's toy store built with Next.js 14, Prisma, PostgreSQL, and Three.js. Fully localised for India (₹, en-IN, metric, BIS standards).

## Purpose

ToyCraze is a full-stack e-commerce platform for children's toys with a distinctive "Crayon Kingdom" visual identity. It serves as both a production-ready storefront and a demonstration of modern full-stack patterns: monorepo architecture, serverless API routes, 3D product viewing, Indian-market localisation, sample data seeding, admin dashboard, and end-to-end testing.

---

## Tech Stack

| Layer              | Technology                                                              |
| ------------------ | ----------------------------------------------------------------------- |
| **Framework**      | Next.js 14 (App Router), TypeScript (strict)                            |
| **Styling**        | Tailwind CSS, custom hand-drawn keyframes, SVG doodle backgrounds        |
| **State**          | Zustand with `persist` middleware                                        |
| **Animation**      | Framer Motion (page transitions, scroll reveals), Three.js / R3F (3D)   |
| **Database**       | PostgreSQL 15 via Prisma ORM                                             |
| **Auth**           | NextAuth v5 (Credentials + Google OAuth, JWT strategy)                  |
| **Payments**       | Stripe (Checkout Sessions, Webhooks)                                    |
| **Background**     | Redis 7 (caching, sessions), MeiliSearch (product search)               |
| **Testing**        | Jest + React Testing Library (unit), Playwright (E2E)                   |
| **Monorepo**       | pnpm workspaces + Turborepo                                             |
| **Infrastructure** | Docker Compose (Postgres, Redis, MeiliSearch)                           |
| **CI / Tooling**   | Prettier, ESLint, ts-jest, Turbo                                        |

---

## Architecture

```
Toy/
├── apps/
│   ├── web/          # Next.js 14 storefront (28 routes, SSR + RSC)
│   └── api/          # Express.js REST backend (optional, most logic in api/ routes)
├── packages/
│   ├── database/     # Prisma schema, client singleton, seed script
│   ├── types/        # Shared TypeScript interfaces & enums
│   ├── utils/        # formatPrice (INR), slugify, truncate, cn, etc.
│   └── email-templates/  # (placeholder for transactional emails)
├── e2e/              # Playwright end-to-end tests
├── infra/            # (placeholder for Terraform / Pulumi)
└── docs/             # (placeholder for additional docs)
```

The monorepo uses Turborepo to orchestrate builds: `turbo run build` compiles all packages and the Next.js app in dependency order. Each package is versioned via workspace protocol (`"@toycraze/types": "workspace:*"`).

### Why a Monorepo?

- **Shared types** (`@toycraze/types`) — single source of truth for `Product`, `Order`, `CartItem`, etc.
- **Shared utilities** (`@toycraze/utils`) — `formatPrice(amount)` always produces `₹1,234.56` regardless of consumer.
- **Shared database client** (`@toycraze/database`) — Prisma singleton prevents connection exhaustion.
- **Turborepo caching** — rebuilds only changed packages; `dev` runs all apps in parallel.

---

## File System Deep Dive

### `apps/web/` — Next.js Storefront

```
app/
├── layout.tsx              # Root shell: Header, Footer, SearchBar, CartDrawer, MobileNav, Toaster, BackgroundDoodles
├── page.tsx                # Homepage: hero, featured products, categories, testimonials, newsletter
├── loading.tsx             # Root loading UI (bouncing dots)
├── error.tsx               # Root error boundary (reset + home)
├── not-found.tsx           # Custom 404 (animated)
├── providers.tsx           # SessionProvider + QueryClientProvider + Toaster
│
├── (auth)/auth/
│   ├── login/page.tsx      # Login (email/password + Google OAuth)
│   └── register/page.tsx   # Registration with age gate (13+)
│
├── account/
│   ├── page.tsx            # User dashboard (profile summary)
│   ├── orders/page.tsx     # Order history (mock data)
│   └── wishlist/page.tsx   # Wishlist grid (Zustand store)
│
├── admin/
│   ├── login/page.tsx      # Admin login (password: Karan@123)
│   ├── page.tsx            # Dashboard (stats, recent orders, quick links)
│   ├── orders/page.tsx     # Order management (filter, search, detail panel)
│   ├── users/page.tsx      # User management (profile, orders, reviews)
│   └── products/page.tsx   # Product catalog (all 108 products)
│
├── api/
│   ├── admin/login/route.ts    # Admin auth: POST (set cookie), GET (verify), DELETE (clear)
│   ├── auth/
│   │   ├── [...nextauth]/route.ts  # NextAuth catch-all
│   │   └── register/route.ts       # User registration
│   ├── cart/route.ts           # Cart CRUD (session-based)
│   ├── checkout/route.ts       # Stripe Checkout session creation
│   ├── orders/route.ts         # Order listing & creation
│   ├── products/route.ts       # Product listing with filter/sort/paginate
│   └── track-order/route.ts    # Order lookup by order number
│
├── categories/page.tsx         # Browse by category (grid with counts)
├── checkout/page.tsx           # 4-step checkout: shipping → payment → review → confirmation
├── contact/page.tsx            # Contact form + info (Noida address, +91 phone)
├── faq/page.tsx                # Accordion FAQ (BIS safety, shipping, returns)
├── products/
│   ├── page.tsx                # Product listing (paginated, filterable, sortable)
│   ├── loading.tsx             # Per-route loading state
│   └── [slug]/page.tsx         # Product detail (images, 3D viewer, reviews, add-to-cart)
└── track-order/
    ├── page.tsx                # Order number entry form
    └── [orderNumber]/page.tsx  # 6-step visual timeline tracker
```

### Frontend Components

| Component                    | Location                        | Purpose                                                     |
| ---------------------------- | ------------------------------- | ----------------------------------------------------------- |
| `Header`                     | `layout.tsx` (inline)           | Logo, nav links, SearchBar, CartBadge                       |
| `Footer`                     | `layout.tsx` (inline)           | Links, newsletter, social, copyright                        |
| `CartDrawer`                 | `components/shop/CartDrawer.tsx`| Slide-out cart with quantity controls                       |
| `CartBadge`                  | `components/ui/CartBadge.tsx`   | Dynamic item count badge on cart icon                       |
| `SearchBar`                  | `components/ui/SearchBar.tsx`   | Debounced live search (300ms) with dropdown results          |
| `MobileNav`                  | `components/ui/MobileNav.tsx`   | Sticky bottom navigation for mobile                         |
| `ProductCard`                | `components/shop/ProductCard.tsx`| Product card with tilt, discount badge, wishlist heart      |
| `CategoryBubble`             | `components/shop/CategoryBubble.tsx`| Circular category button with emoji icon                |
| `ProductViewer3D`            | `components/shop/ProductViewer3D.tsx`| Three.js scene with orbit controls, fullscreen toggle   |
| `BackgroundDoodles`          | `components/animations/BackgroundDoodles.tsx`| Floating SVG doodle characters                   |
| `Confetti`                   | `components/animations/Confetti.tsx`| Canvas-based confetti burst on order completion          |
| `PageTransition`             | `components/animations/PageTransition.tsx`| Framer Motion spring page wrapper               |

### Data Layer

| File                         | Contents                                                     |
| ---------------------------- | ------------------------------------------------------------ |
| `data/products.ts`           | 108 products across 6 categories, all metrics in metric (cm, m, kg), all images via `picsum.photos/seed/{slug}` |
| `data/sample-data.ts`        | 12 Indian users (Priya, Arjun, Sneha, etc.) with dicebear avatars, ~40 orders each, product reviews |

### State Management

| Store         | File                | Technology | Purpose                      |
| ------------- | ------------------- | ---------- | ---------------------------- |
| Cart          | `store/cart.ts`     | Zustand    | Cart items, open/close state |
| Wishlist      | `hooks/useWishlist.ts` | Zustand  | Wishlist toggle              |

**Why Zustand over Context?** Zustand's `persist` middleware handles localStorage synchronisation — crucial for cart persistence across sessions. Selector hooks (`useItemCount`, `useTotalAmount`) are reactive and recompute on every state change, avoiding the "$0 bug" that occurs when getters are used on the store object after rehydration.

### Backend (API Routes)

All backend logic lives in Next.js API routes (`app/api/`), with a separate Express app (`apps/api/`) as an optional alternative. The Express app includes:

- **Helmet** — secure HTTP headers
- **CORS** — cross-origin requests
- **Rate limiting** — 100 req/min per IP

#### API Endpoints

| Method | Route                  | Description                                      |
| ------ | ---------------------- | ------------------------------------------------ |
| GET    | `/api/products`        | List products (filter, sort, paginate)           |
| GET    | `/api/products?page=2&sort=price_asc&category=puzzles` | Filtered + paginated |
| POST   | `/api/auth/register`   | Create account (email, password, name, age)      |
| POST   | `/api/auth/callback/credentials` | NextAuth credential sign-in |
| GET    | `/api/cart`            | Get cart items (session-based)                   |
| POST   | `/api/cart`            | Add item to cart                                 |
| DELETE | `/api/cart`            | Remove item from cart                            |
| POST   | `/api/checkout`        | Create Stripe Checkout Session                   |
| GET    | `/api/orders`          | List user orders                                 |
| POST   | `/api/orders`          | Create order from cart                           |
| GET    | `/api/track-order?orderNumber=TC-ABC123` | Lookup order status    |
| POST   | `/api/admin/login`     | Admin login (password: Karan@123), sets httpOnly cookie |
| GET    | `/api/admin/login`     | Verify admin session cookie                      |
| DELETE | `/api/admin/login`     | Clear admin session cookie                       |

### Database

**Prisma schema** (`packages/database/prisma/schema.prisma`) — PostgreSQL, 282 lines, 10 models:

| Model              | Purpose                                   |
| ------------------ | ----------------------------------------- |
| `User`             | Customers + admins (role enum: CUSTOMER, ADMIN, SUPER_ADMIN) |
| `Account`          | NextAuth OAuth account linkage             |
| `Session`          | NextAuth sessions                         |
| `VerificationToken`| Email verification tokens                 |
| `Category`         | Product categories (self-referencing hierarchy) |
| `Product`          | Products with price in cents, metric dimensions, picsum images |
| `CartItem`         | Per-user cart entries (unique per product) |
| `Order`            | Orders with status tracking + payment status |
| `OrderItem`        | Line items per order (snapshot of price at purchase) |
| `Address`          | Shipping addresses (Indian pincode, states) |
| `Review`           | Product reviews (1-5 rating, unique per user-product) |
| `Wishlist`         | Saved products (unique per user-product)   |
| `InventoryLog`     | Stock change audit trail                  |

### Seed Data

`packages/database/prisma/seed.ts` + `apps/web/data/sample-data.ts`:

- **12 Indian users** — realistic names (Priya Sharma, Arjun Patel, Sneha Reddy, etc.), dicebear avatars, Indian addresses (Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, Jaipur, Lucknow, Noida, Gurgaon)
- **~480 orders** — ~40 per user, distributed across statuses: 50% DELIVERED, 20% PROCESSING, 20% PENDING, 10% CANCELLED
- **Order numbers** — `TC-250000` to `TC-250048` format
- **Reviews** — 10+ written reviews with 3-5 star ratings on random products

### Security

- **Password hashing** — bcryptjs with salt rounds
- **NextAuth JWT** — encrypted tokens, no session database dependency
- **Admin auth** — httpOnly cookie (`toycraze_admin`) set via dedicated `/api/admin/login` endpoint; all admin pages verify cookie on mount and redirect to `/admin/login` if absent
- **CORS + Helmet** (Express backend) — secure headers, cross-origin protection
- **Rate limiting** — 100 requests/minute on Express routes
- **Input validation** — Zod schemas on all API inputs
- **DOMPurify** — sanitizes user-generated content in reviews
- **Strict CSP** — via Helmet in Express, inline styles allowed only through Next.js

### Testing

| Layer   | Tool                    | Files                                                     |
| ------- | ----------------------- | --------------------------------------------------------- |
| Unit    | Jest + ts-jest          | `cart.store.test.ts`, `wishlist.store.test.ts`            |
| Unit    | Jest + React Testing Library | `ProductCard.test.tsx`, `CategoryBubble.test.tsx`, `CartBadge.test.tsx` |
| E2E     | Playwright              | `happy-path.spec.ts` (browse → search → cart → checkout → complete) |

### Colour Scheme (Crayon Kingdom)

```
Crayon Red:    #FF6B6B  (primary accent, buttons, sale badges)
Crayon Yellow: #FFD93D  (secondary active states, highlights)
Crayon Green:  #6BCB77  (success, delivery confirmed)
Crayon Blue:   #4D96FF  (secondary buttons, links)
Crayon Orange: #FF922B  (support accent)
Crayon Cream:  #F8F0E3  (card backgrounds, stickers)
Ink:           #2D2D2D  (text, borders)
Paper:         #FCF9F2  (page background)
```

### Key Design Decisions

1. **Zustand selectors for cart totals**: Replaced JS getter `itemCount`/`totalAmount` with `useItemCount()`/`useTotalAmount()` selector hooks — getters computed once at store creation and don't survive `persist` rehydration; selectors recompute reactively on every render.

2. **Picsum for all product images**: All 108 product images use `picsum.photos/seed/{slug}` — guarantees 100% load rate with deterministic images per seed, avoids Unsplash API rate limits.

3. **India-localised everything**: `$`→`₹`, `en-US`→`en-IN`, imperial→metric (in→cm, ft→m, miles→km, lbs→kg, mph→km/h), US addresses→Indian cities, US safety→BIS IS 9873, $50→₹999 shipping threshold.

4. **Admin auth via simple cookie**: No database dependency for admin sessions. POST to `/api/admin/login` with password hash sets httpOnly cookie; GET verifies; DELETE clears. Password (`Karan@123`) is a constant ready to be moved to `ADMIN_PASSWORD_HASH` env var.

### Running Locally

```bash
# Prerequisites: Node 20+, pnpm 9+, Docker

# Clone and install
git clone https://github.com/KaranDarade/ToyCrazy.git
cd ToyCrazy
pnpm install

# Start infrastructure
docker compose up -d

# Set up database
pnpm db:push
pnpm db:seed

# Start dev
pnpm dev
# → http://localhost:3000 (Next.js storefront)
# → http://localhost:3001 (Express API)

# Tests
pnpm test                 # Unit tests
cd apps/web && npx playwright test  # E2E

# Build
pnpm build
```

### Admin Access

- **URL**: `/admin/login`
- **Password**: `Karan@123`

### Build Output

28 routes, 0 TypeScript errors, 0 warnings. First Load JS shared: 87.3 kB.

```
Route (app)                                Size     First Load JS
┌ ○ /                                      6.09 kB         88.9 kB
├ ○ /account                               2.11 kB         131 kB
├ ○ /account/orders                        5.93 kB         131 kB
├ ○ /account/wishlist                      2.54 kB         123 kB
├ ○ /admin                                 6.28 kB         152 kB
├ ○ /admin/login                           1.42 kB         123 kB
├ ○ /admin/orders                          5.03 kB         148 kB
├ ○ /admin/products                        1.5 kB          145 kB
├ ○ /admin/users                           4.7 kB          148 kB
├ ○ /auth/login                            1.88 kB         143 kB
├ ○ /auth/register                         1.69 kB         139 kB
├ ○ /categories                            1.16 kB         133 kB
├ ○ /checkout                              5.01 kB         144 kB
├ ○ /contact                               1.24 kB         129 kB
├ ○ /faq                                   2.87 kB         126 kB
├ ○ /products                              3.69 kB         148 kB
├ ƒ /products/[slug]                       220 kB          364 kB
├ ○ /track-order                           1.46 kB         125 kB
└ ƒ /track-order/[orderNumber]             2.73 kB         135 kB
```
