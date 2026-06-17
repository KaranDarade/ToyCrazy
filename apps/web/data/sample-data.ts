import { allProducts } from './products';

export interface SampleUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  memberSince: string;
}

export interface SampleOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';

export interface SampleOrder {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  items: SampleOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; date: string; note: string }[];
  placedAt: string;
  estimatedDelivery: string;
  deliveredAt?: string;
  shippingAddress: string;
  paymentMethod: string;
  feedback?: string;
  rating?: number;
}

export interface SampleReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

const productPool = allProducts;

function pickProduct() {
  return productPool[Math.floor(Math.random() * productPool.length)];
}

function pickProducts(count: number) {
  const shuffled = [...productPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function formatDate(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function randomOrderNumber(idx: number) {
  return `TC-${String(2025000 + idx).slice(-6)}`;
}

const statusFlow: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered',
];

function generateStatusHistory(status: OrderStatus, placedAt: string): { status: OrderStatus; date: string; note: string }[] {
  const history: { status: OrderStatus; date: string; note: string }[] = [];
  const placedDate = new Date(placedAt);

  if (status === 'cancelled') {
    history.push({ status: 'pending', date: placedAt, note: 'Order placed successfully' });
    const cancelDate = new Date(placedDate);
    cancelDate.setDate(cancelDate.getDate() + 1);
    history.push({ status: 'cancelled', date: cancelDate.toISOString().split('T')[0], note: 'Cancelled by customer' });
    return history;
  }

  if (status === 'pending') {
    history.push({ status: 'pending', date: placedAt, note: 'Order placed successfully' });
    return history;
  }

  const statusIdx = statusFlow.indexOf(status);
  for (let i = 0; i <= statusIdx; i++) {
    const d = new Date(placedDate);
    d.setDate(d.getDate() + i);
    const date = d.toISOString().split('T')[0];
    const notes: Record<OrderStatus, string> = {
      pending: 'Order placed successfully',
      confirmed: 'Order confirmed and payment verified',
      processing: 'Items are being packed',
      shipped: 'Package handed to courier partner',
      'out-for-delivery': 'Out for delivery — expect today!',
      delivered: 'Package delivered successfully',
      cancelled: '',
    };
    history.push({ status: statusFlow[i], date, note: notes[statusFlow[i]] });
  }
  return history;
}

export const sampleUsers: SampleUser[] = [
  { id: 'u1', name: 'Priya Sharma', email: 'priya.sharma@gmail.com', phone: '+91 98765 43210', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', address: { street: '42, Lake View Apartments', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }, memberSince: '2024-03-15' },
  { id: 'u2', name: 'Arjun Patel', email: 'arjun.patel@yahoo.com', phone: '+91 87654 32109', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun', address: { street: '15, Green Park Colony', city: 'Delhi', state: 'Delhi', pincode: '110001' }, memberSince: '2024-01-20' },
  { id: 'u3', name: 'Sneha Reddy', email: 'sneha.reddy@outlook.com', phone: '+91 76543 21098', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha', address: { street: '7, Jubilee Hills Road', city: 'Hyderabad', state: 'Telangana', pincode: '500033' }, memberSince: '2024-06-01' },
  { id: 'u4', name: 'Rohit Verma', email: 'rohit.verma@gmail.com', phone: '+91 65432 10987', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit', address: { street: '88, Indira Nagar', city: 'Bangalore', state: 'Karnataka', pincode: '560038' }, memberSince: '2023-11-10' },
  { id: 'u5', name: 'Ananya Gupta', email: 'ananya.gupta@rediffmail.com', phone: '+91 54321 09876', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya', address: { street: '23, Ballygunge Circular Road', city: 'Kolkata', state: 'West Bengal', pincode: '700019' }, memberSince: '2024-08-05' },
  { id: 'u6', name: 'Vikram Singh', email: 'vikram.singh@gmail.com', phone: '+91 43210 98765', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram', address: { street: '56, Civil Lines', city: 'Jaipur', state: 'Rajasthan', pincode: '302006' }, memberSince: '2024-02-14' },
  { id: 'u7', name: 'Neha Joshi', email: 'neha.joshi@yahoo.com', phone: '+91 32109 87654', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha', address: { street: '12, FC Road', city: 'Pune', state: 'Maharashtra', pincode: '411004' }, memberSince: '2024-07-22' },
  { id: 'u8', name: 'Amit Kumar', email: 'amit.kumar@gmail.com', phone: '+91 21098 76543', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit', address: { street: '9, Gomti Nagar', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226010' }, memberSince: '2023-09-30' },
  { id: 'u9', name: 'Kavya Nair', email: 'kavya.nair@outlook.com', phone: '+91 10987 65432', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya', address: { street: '34, Panampilly Nagar', city: 'Kochi', state: 'Kerala', pincode: '682036' }, memberSince: '2024-04-18' },
  { id: 'u10', name: 'Rahul Desai', email: 'rahul.desai@gmail.com', phone: '+91 19876 54321', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', address: { street: '71, Satellite Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015' }, memberSince: '2024-10-01' },
  { id: 'u11', name: 'Isha Agarwal', email: 'isha.agarwal@yahoo.com', phone: '+91 18765 43210', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isha', address: { street: '5, MG Road', city: 'Indore', state: 'Madhya Pradesh', pincode: '452001' }, memberSince: '2024-05-12' },
  { id: 'u12', name: 'Karan Mehta', email: 'karan.mehta@gmail.com', phone: '+91 17654 32109', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan', address: { street: '29, Rajaji Puram', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226017' }, memberSince: '2024-01-05' },
];

function generateOrdersForUser(user: SampleUser, userIdx: number): SampleOrder[] {
  const baseIdx = userIdx * 4;
  const orders: SampleOrder[] = [];

  // Completed order (delivered)
  const p1 = pickProducts(2);
  const items1: SampleOrderItem[] = p1.map((p) => ({
    productId: p.id,
    productName: p.name,
    quantity: Math.floor(Math.random() * 2) + 1,
    price: p.price,
    imageUrl: p.imageUrl,
  }));
  const sub1 = items1.reduce((s, i) => s + i.price * i.quantity, 0);
  const order1: SampleOrder = {
    id: `ord-${baseIdx}`,
    orderNumber: randomOrderNumber(baseIdx),
    userId: user.id,
    userName: user.name,
    items: items1,
    subtotal: sub1,
    shipping: sub1 > 5000 ? 0 : 299,
    total: sub1 + (sub1 > 5000 ? 0 : 299),
    status: 'delivered',
    statusHistory: generateStatusHistory('delivered', formatDate(45 + userIdx * 2)),
    placedAt: formatDate(45 + userIdx * 2),
    estimatedDelivery: formatDate(38 + userIdx * 2),
    deliveredAt: formatDate(36 + userIdx * 2),
    shippingAddress: `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}`,
    paymentMethod: userIdx % 2 === 0 ? 'UPI (Google Pay)' : 'Credit Card (Visa)',
    feedback: ['Amazing toys! My kids love them 🎉', 'Great quality and fast delivery!', 'Perfect birthday gifts, very happy!', 'Excellent product as described', 'Will order again for sure!'][userIdx % 5],
    rating: [5, 5, 4, 5, 4][userIdx % 5],
  };
  orders.push(order1);

  // Completed order
  const p2 = pickProducts(1);
  const items2: SampleOrderItem[] = p2.map((p) => ({
    productId: p.id,
    productName: p.name,
    quantity: 1,
    price: p.price,
    imageUrl: p.imageUrl,
  }));
  const sub2 = items2.reduce((s, i) => s + i.price * i.quantity, 0);
  orders.push({
    id: `ord-${baseIdx + 1}`,
    orderNumber: randomOrderNumber(baseIdx + 1),
    userId: user.id,
    userName: user.name,
    items: items2,
    subtotal: sub2,
    shipping: sub2 > 3000 ? 0 : 299,
    total: sub2 + (sub2 > 3000 ? 0 : 299),
    status: 'delivered',
    statusHistory: generateStatusHistory('delivered', formatDate(30 + userIdx)),
    placedAt: formatDate(30 + userIdx),
    estimatedDelivery: formatDate(23 + userIdx),
    deliveredAt: formatDate(21 + userIdx),
    shippingAddress: `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}`,
    paymentMethod: userIdx % 3 === 0 ? 'Debit Card' : 'Cash on Delivery',
    feedback: ['Very good toy, sturdy build', 'My son plays with it daily!', '', '', 'Good value for money'][userIdx % 5],
    rating: [5, 4, undefined, undefined, 4][userIdx % 5] as number | undefined,
  });

  // Pending/processing order
  const p3 = pickProducts(3);
  const items3: SampleOrderItem[] = p3.map((p) => ({
    productId: p.id,
    productName: p.name,
    quantity: Math.floor(Math.random() * 2) + 1,
    price: p.price,
    imageUrl: p.imageUrl,
  }));
  const sub3 = items3.reduce((s, i) => s + i.price * i.quantity, 0);
  const pendingStatuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped'];
  const ps = pendingStatuses[userIdx % 4];
  orders.push({
    id: `ord-${baseIdx + 2}`,
    orderNumber: randomOrderNumber(baseIdx + 2),
    userId: user.id,
    userName: user.name,
    items: items3,
    subtotal: sub3,
    shipping: sub3 > 4000 ? 0 : 299,
    total: sub3 + (sub3 > 4000 ? 0 : 299),
    status: ps,
    statusHistory: generateStatusHistory(ps, formatDate(5 + userIdx)),
    placedAt: formatDate(5 + userIdx),
    estimatedDelivery: formatDate(12 + userIdx),
    shippingAddress: `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}`,
    paymentMethod: 'UPI (PhonePe)',
  });

  // Cancelled order (some users)
  if (userIdx % 3 === 0) {
    const p4 = pickProducts(2);
    const items4: SampleOrderItem[] = p4.map((p) => ({
      productId: p.id,
      productName: p.name,
      quantity: 1,
      price: p.price,
      imageUrl: p.imageUrl,
    }));
    const sub4 = items4.reduce((s, i) => s + i.price * i.quantity, 0);
    orders.push({
      id: `ord-${baseIdx + 3}`,
      orderNumber: randomOrderNumber(baseIdx + 3),
      userId: user.id,
      userName: user.name,
      items: items4,
      subtotal: sub4,
      shipping: 0,
      total: sub4,
      status: 'cancelled',
      statusHistory: generateStatusHistory('cancelled', formatDate(60 + userIdx)),
      placedAt: formatDate(60 + userIdx),
      estimatedDelivery: formatDate(53 + userIdx),
      shippingAddress: `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}`,
      paymentMethod: 'Credit Card',
    });
  }

  return orders;
}

export const sampleOrders: SampleOrder[] = sampleUsers.flatMap((user, i) => generateOrdersForUser(user, i));

export const sampleReviews: SampleReview[] = sampleOrders
  .filter((o) => o.status === 'delivered' && o.rating)
  .map((o, i) => ({
    id: `rev-${i}`,
    userId: o.userId,
    userName: o.userName,
    userAvatar: sampleUsers.find((u) => u.id === o.userId)?.avatar || '',
    productId: o.items[0].productId,
    rating: o.rating || 5,
    title: ['Absolutely love it!', 'Great quality toy', 'Perfect gift', 'Highly recommend', 'Worth every penny', 'Super fun!', 'My kid is obsessed!', 'Excellent purchase'][i % 8],
    comment: o.feedback || 'Great product, fast shipping!',
    createdAt: o.deliveredAt || o.placedAt,
  }));

export function getOrdersByUser(userId: string): SampleOrder[] {
  return sampleOrders.filter((o) => o.userId === userId);
}

export function getOrderByNumber(orderNumber: string): SampleOrder | undefined {
  return sampleOrders.find((o) => o.orderNumber === orderNumber);
}

export function getOrdersByStatus(status: OrderStatus): SampleOrder[] {
  return sampleOrders.filter((o) => o.status === status);
}

export function getUserById(userId: string): SampleUser | undefined {
  return sampleUsers.find((u) => u.id === userId);
}
