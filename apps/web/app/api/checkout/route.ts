import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, paymentInfo } = body;

    if (!items?.length || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required checkout data' },
        { status: 400 },
      );
    }

    // Simulate payment processing
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );
    const shipping = subtotal > 5000 ? 0 : 599;
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + shipping + tax;

    // Mock Stripe payment intent
    const paymentIntent = {
      id: `pi_${Date.now()}`,
      amount: total,
      status: 'succeeded',
      payment_method: 'card',
    };

    return NextResponse.json({
      success: true,
      data: {
        paymentIntent,
        orderId: `ord_${Date.now()}`,
        total,
        receiptUrl: `https://dashboard.stripe.com/test/payments/${paymentIntent.id}`,
      },
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 },
    );
  }
}
