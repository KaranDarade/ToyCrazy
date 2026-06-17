import { Router, Request, Response } from 'express';
import { prisma } from '@toycraze/database';

export const productRoutes = Router();

// GET /api/products — List products with filtering, sorting, pagination
productRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const {
      category,
      search,
      sort = 'createdAt',
      page = '1',
      pageSize = '12',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const pageSizeNum = Math.min(50, Math.max(1, parseInt(pageSize as string)));

    const where: any = { isActive: true };
    if (category) where.category = { slug: category as string };
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { tags: { has: search as string } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip: (pageNum - 1) * pageSizeNum,
        take: pageSizeNum,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSizeNum);

    res.json({
      success: true,
      data,
      meta: {
        total,
        page: pageNum,
        pageSize: pageSizeNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id — Single product
productRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true, reviews: { include: { user: { select: { id: true, name: true, image: true } } } } },
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});
