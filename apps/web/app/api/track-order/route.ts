import { NextRequest, NextResponse } from 'next/server';
import { getOrderByNumber } from '@/data/sample-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('orderNumber');

  if (!orderNumber) {
    return NextResponse.json({ error: 'Order number required' }, { status: 400 });
  }

  const order = getOrderByNumber(orderNumber);

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json(order);
}
