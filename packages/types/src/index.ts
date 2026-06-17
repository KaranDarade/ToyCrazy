// ============================================================
// ToyCraze — Shared TypeScript Types
// ============================================================

// --- Enums ---
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';

// --- User ---
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  image: string | null;
  createdAt: string;
}

// --- Category ---
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  parent?: Category | null;
  children?: Category[];
  productCount?: number;
}

// --- Product ---
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  category?: Category;
  stockQty: number;
  imageUrls: string[];
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// --- Cart ---
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

// --- Order ---
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  status: OrderStatus;
  totalAmount: number;
  shippingAmount: number;
  taxAmount: number;
  discountAmount: number;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId: string | null;
  shippingAddress: Address;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
}

// --- Address ---
export interface Address {
  id: string;
  userId: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

// --- Review ---
export interface Review {
  id: string;
  userId: string;
  user?: Pick<User, 'id' | 'name' | 'image'>;
  productId: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

// --- API Response ---
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// --- Wishlist ---
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

// --- Checkout ---
export interface CheckoutSession {
  id: string;
  url: string;
  amount: number;
}

export interface ShippingFormData {
  fullName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
}

export interface PaymentFormData {
  cardNumber: string;
  expDate: string;
  cvc: string;
  nameOnCard: string;
}
