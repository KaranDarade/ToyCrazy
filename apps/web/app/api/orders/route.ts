import { NextRequest, NextResponse } from 'next/server';

// In-memory order store
const orders: any[] = [];

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 },
    );
  }

  const userOrders = orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ success: true, data: userOrders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, items, shippingAddress } = body;

    if (!userId || !items?.length) {
      return NextResponse.json(
        { success: false, error: 'Invalid order data' },
        { status: 400 },
      );
    }

    const subtotalAmount = items.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0,
    );
    const shippingAmount = subtotalAmount > 5000 ? 0 : 599;
    const taxAmount = Math.round(subtotalAmount * 0.08);
    const totalAmount = subtotalAmount + shippingAmount + taxAmount;

    const orderNumber = `TC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const order = {
      id: `ord_${orders.length + 1}`,
      orderNumber,
      userId,
      status: 'CONFIRMED',
      subtotalAmount,
      shippingAmount,
      taxAmount,
      totalAmount,
      paymentStatus: 'SUCCEEDED',
      items,
      shippingAddress,
      createdAt: new Date().toISOString(),
    };

    orders.push(order);

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 },
    );
  }
}
