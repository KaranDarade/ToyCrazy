import { Router, Request, Response } from 'express';
import { prisma } from '@toycraze/database';

export const orderRoutes = Router();

// GET /api/orders — List user's orders
orderRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// POST /api/orders — Create order from cart
orderRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, items, shippingAddressId } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid order data' });
    }

    // Calculate totals
    let subtotalAmount = 0;
    const orderItems = await Promise.all(
      items.map(async (item: { productId: string; quantity: number }) => {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (product.stockQty < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);

        const unitPrice = product.price;
        subtotalAmount += unitPrice * item.quantity;
        return { productId: item.productId, quantity: item.quantity, unitPrice };
      }),
    );

    const shippingAmount = subtotalAmount > 5000 ? 0 : 599; // free shipping over ₹50 threshold
    const taxAmount = Math.round(subtotalAmount * 0.08); // 8% tax
    const totalAmount = subtotalAmount + shippingAmount + taxAmount;
    const orderNumber = `TC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: 'PENDING',
        subtotalAmount,
        shippingAmount,
        taxAmount,
        totalAmount,
        paymentStatus: 'PENDING',
        shippingAddressId: shippingAddressId || undefined,
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } }, address: true },
    });

    // Decrement stock
    await Promise.all(
      items.map((item: { productId: string; quantity: number }) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stockQty: { decrement: item.quantity } },
        }),
      ),
    );

    res.status(201).json({ success: true, data: order });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(400).json({ success: false, error: error.message || 'Failed to create order' });
  }
});
