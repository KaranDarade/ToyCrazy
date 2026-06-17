// ============================================================
// ToyCraze — Shared Utilities
// ============================================================

/** Format a number as currency (INR by default) */
export function formatPrice(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

/** Format a number as a discount percentage */
export function formatDiscount(original: number, sale: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - sale) / original) * 100);
}

/** Generate a URL-friendly slug from a string */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/** Truncate text to a given length with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/** Get a random rotation between -max and +max degrees */
export function randomRotation(max = 2): number {
  return (Math.random() * 2 - 1) * max;
}

/** Generate a random integer between min and max (inclusive) */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Generate a pseudo-unique order number */
export function generateOrderNumber(): string {
  const prefix = 'TC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Check if a value is a positive integer */
export function isPositiveInteger(value: unknown): boolean {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

/** Delay execution (for animations / simulated loading) */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Group an array of objects by a key */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const k = String(item[key]);
      (acc[k] = acc[k] || []).push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

/** Merge class names, filtering out falsy values */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
