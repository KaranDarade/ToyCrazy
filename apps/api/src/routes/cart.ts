import { Router, Request, Response } from 'express';
import { prisma } from '@toycraze/database';

export const cartRoutes: Router = Router();

// GET /api/cart — Get user's cart
cartRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    const totalAmount = items.reduce((sum: number, item: { quantity: number; product: { price: number } }) => sum + item.product.price * item.quantity, 0);
    const itemCount = items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);

    res.json({
      success: true,
      data: { items, totalAmount, itemCount },
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cart' });
  }
});

// POST /api/cart/add — Add item to cart
cartRoutes.post('/add', async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ success: false, error: 'userId and productId required' });
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      });
      return res.json({ success: true, data: updated });
    }

    const created = await prisma.cartItem.create({
      data: { userId, productId, quantity },
      include: { product: true },
    });

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, error: 'Failed to add to cart' });
  }
});

// DELETE /api/cart/:productId — Remove from cart
cartRoutes.delete('/:productId', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    await prisma.cartItem.delete({
      where: { userId_productId: { userId, productId: req.params.productId } },
    });

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, error: 'Failed to remove from cart' });
  }
});
