'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCartStore, useTotalAmount } from '@/store/cart';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Confetti } from '@/components/animations/Confetti';

type Step = 'shipping' | 'payment' | 'review' | 'confirmation';

const steps: { id: Step; label: string; icon: string }[] = [
  { id: 'shipping', label: 'Address', icon: '📍' },
  { id: 'payment', label: 'Payment', icon: '💳' },
  { id: 'review', label: 'Review', icon: '👀' },
  { id: 'confirmation', label: 'Done!', icon: '🎉' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const totalAmount = useTotalAmount();
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const [payment, setPayment] = useState({
    cardNumber: '',
    expDate: '',
    cvc: '',
    nameOnCard: '',
  });

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    setCurrentStep('confirmation');
    setLoading(false);
    toast.success('Order placed successfully! 🎉');
  };

  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <span className="text-6xl block mb-4">🛒</span>
        <h1 className="font-display text-3xl mb-2">Your cart is empty</h1>
        <p className="font-body text-gray-600 mb-6">Add some toys before checking out!</p>
        <Link href="/products" className="btn-crayon inline-block">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl md:text-4xl mb-8 wobbly">
        🎁 Checkout
      </h1>

      {/* Progress Road */}
      <div className="relative mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`w-12 h-12 rounded-full border-3 border-ink flex items-center justify-center font-display text-lg transition-all ${
                  i <= currentIndex
                    ? 'bg-crayon-yellow scale-110'
                    : 'bg-white'
                }`}
              >
                {i < currentIndex ? '✓' : step.icon}
              </div>
              <span className="font-body text-xs mt-1 text-center font-semibold">
                {step.label}
              </span>
            </div>
          ))}
        </div>
        {/* Road line */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-ink/20 -z-0 rounded-full">
          <div
            className="h-full bg-crayon-green rounded-full transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 'shipping' && (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <div className="sticker p-6 rounded-[24px_10px_24px_10px] border-3 border-ink bg-white">
              <h2 className="font-display text-2xl mb-6">📍 Delivery Address</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="font-body font-semibold text-sm">Full Name</label>
                  <input
                    id="fullName"
                    required
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="street" className="font-body font-semibold text-sm">Street Address</label>
                  <input
                    id="street"
                    required
                    value={shipping.street}
                    onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                    className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body"
                    placeholder="123 Toy Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="font-body font-semibold text-sm">City</label>
                    <input
                      id="city"
                      required
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="font-body font-semibold text-sm">State</label>
                    <input
                      id="state"
                      required
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body"
                      placeholder="State"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pincode" className="font-body font-semibold text-sm">Pincode</label>
                    <input
                      id="pincode"
                      required
                      value={shipping.pincode}
                      onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })}
                      className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body"
                      placeholder="12345"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="font-body font-semibold text-sm">Phone</label>
                    <input
                      id="phone"
                      required
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-crayon w-full text-lg !py-3 mt-4">
                  Continue to Payment →
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {currentStep === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <div className="sticker p-6 rounded-[24px_10px_24px_10px] border-3 border-ink bg-white">
              <h2 className="font-display text-2xl mb-6">💳 Payment</h2>
              <p className="font-body text-sm text-gray-500 mb-4">
                Your payment is securely processed by Stripe. We never store card details.
              </p>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nameOnCard" className="font-body font-semibold text-sm">Name on Card</label>
                  <input
                    id="nameOnCard"
                    required
                    value={payment.nameOnCard}
                    onChange={(e) => setPayment({ ...payment, nameOnCard: e.target.value })}
                    className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="cardNumber" className="font-body font-semibold text-sm">Card Number</label>
                  <input
                    id="cardNumber"
                    required
                    value={payment.cardNumber}
                    onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body"
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expDate" className="font-body font-semibold text-sm">Expiry Date</label>
                    <input
                      id="expDate"
                      required
                      value={payment.expDate}
                      onChange={(e) => setPayment({ ...payment, expDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="font-body font-semibold text-sm">CVC</label>
                    <input
                      id="cvc"
                      required
                      value={payment.cvc}
                      onChange={(e) => setPayment({ ...payment, cvc: e.target.value })}
                      className="w-full px-4 py-3 rounded-full border-3 border-ink bg-paper font-body"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('shipping')}
                    className="btn-crayon-ghost flex-1 !py-3"
                  >
                    ← Back
                  </button>
                  <button type="submit" className="btn-crayon flex-1 !py-3">
                    Review Order →
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {currentStep === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <div className="sticker p-6 rounded-[24px_10px_24px_10px] border-3 border-ink bg-white">
              <h2 className="font-display text-2xl mb-6">👀 Order Review</h2>

              {/* Items */}
              <div className="space-y-3 mb-6">
                <h3 className="font-display text-lg">Items</h3>
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center py-2 border-b-2 border-ink/10">
                    <div>
                      <span className="font-body font-semibold">{item.product.name}</span>
                      <span className="font-body text-sm text-gray-500 ml-2">×{item.quantity}</span>
                    </div>
                    <span className="font-number">₹{(item.product.price * item.quantity / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Shipping */}
              <div className="mb-6">
                <h3 className="font-display text-lg">Shipping To</h3>
                <div className="font-body text-sm text-gray-700 mt-1">
                  <p>{shipping.fullName}</p>
                  <p>{shipping.street}</p>
                  <p>{shipping.city}, {shipping.state} {shipping.pincode}</p>
                  <p>{shipping.phone}</p>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t-3 border-ink pt-4 space-y-2">
                <div className="flex justify-between font-body">
                  <span>Subtotal</span>
                  <span className="font-number">₹{(totalAmount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-body">
                  <span>Shipping</span>
                  <span className="font-number text-crayon-green">FREE</span>
                </div>
                <div className="flex justify-between font-display text-xl mt-2 pt-2 border-t-2 border-ink/20">
                  <span>Total</span>
                  <span className="font-number text-crayon-red text-2xl">
                    ₹{(totalAmount / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setCurrentStep('payment')}
                  className="btn-crayon-ghost flex-1 !py-3"
                >
                  ← Edit Payment
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-crayon-green flex-1 !py-3 disabled:opacity-50"
                >
                  {loading ? '🎁 Placing Order...' : '🎉 Place Order'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 'confirmation' && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Confetti trigger={true} />
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-7xl mb-6"
            >
              🎉
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl mb-2">
              Order Confirmed!
            </h1>
            <p className="font-body text-lg text-gray-600 mb-2">
              Your toys are being wrapped with love 🎁
            </p>
            <p className="font-body text-sm text-gray-500 mb-8">
              You&apos;ll receive a confirmation email shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/account/orders" className="btn-crayon">
                📦 Track Order
              </Link>
              <Link href="/products" className="btn-crayon-secondary">
                🛍️ Shop More
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
