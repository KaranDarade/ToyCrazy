import { NextResponse } from 'next/server';
import { allProducts } from '@/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');
  const page = parseInt(searchParams.get('page') ?? '1');
  const pageSize = parseInt(searchParams.get('pageSize') ?? '12');

  let filtered = [...allProducts];

  if (category) {
    filtered = filtered.filter((p) => p.categorySlug === category);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return NextResponse.json({
    success: true,
    data: data.map(({ categoryId, categorySlug, categoryName, imageUrl, ...p }) => ({
      ...p,
      imageUrls: [imageUrl],
      category: { id: categoryId, name: categoryName, slug: categorySlug },
    })),
    meta: { total, page, pageSize, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
  });
}
