import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { productRoutes } from './routes/products';
import { orderRoutes } from './routes/orders';
import { cartRoutes } from './routes/cart';

const app = express();
const PORT = process.env.PORT ?? 4000;

// ── Middleware ──
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many login attempts. Try again in 15 minutes.' },
});
app.use('/api/auth/login', authLimiter);

// ── Routes ──
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// ── Health Check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 Handler ──
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Error Handler ──
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 ToyCraze API running on http://localhost:${PORT}`);
});
