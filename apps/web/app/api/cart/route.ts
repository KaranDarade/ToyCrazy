import { NextResponse } from 'next/server';

// In-memory cart store (replace with DB in production)
const carts = new Map<string, any[]>();

export async function GET(request: Request) {
  const userId = request.headers.get('x-user-id') ?? 'anonymous';
  const items = carts.get(userId) ?? [];

  const totalAmount = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return NextResponse.json({ success: true, data: { items, totalAmount, itemCount } });
}

export async function POST(request: Request) {
  const userId = request.headers.get('x-user-id') ?? 'anonymous';
  const body = await request.json();
  const { product, quantity = 1 } = body;

  if (!product?.id) {
    return NextResponse.json(
      { success: false, error: 'Product data required' },
      { status: 400 },
    );
  }

  const items = carts.get(userId) ?? [];
  const existingIndex = items.findIndex((i: any) => i.productId === product.id);

  if (existingIndex >= 0) {
    items[existingIndex].quantity += quantity;
  } else {
    items.push({ productId: product.id, product, quantity });
  }

  carts.set(userId, items);

  return NextResponse.json({ success: true, data: items }, { status: 201 });
}

export async function DELETE(request: Request) {
  const userId = request.headers.get('x-user-id') ?? 'anonymous';
  const { productId } = await request.json();

  const items = carts.get(userId) ?? [];
  carts.set(
    userId,
    items.filter((i: any) => i.productId !== productId),
  );

  return NextResponse.json({ success: true, message: 'Item removed' });
}
