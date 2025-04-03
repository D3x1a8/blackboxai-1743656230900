import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TestPayment() {
  const router = useRouter();

  useEffect(() => {
    console.log('Starting test payment flow...');
    
    const testPayment = async () => {
      try {
        console.log('Creating test order...');
        const order = {
          id: 123,
          product_id: 1,
          quantity: 1,
          status: 'payment_pending',
          razorpay_order_id: 'order_test123',
          amount: 12000,
          currency: 'INR',
          key: 'test_key',
          product_name: 'Test Product'
        };

        console.log('Simulating Razorpay payment...');
        const mockPayment = {
          razorpay_payment_id: 'pay_test123',
          razorpay_order_id: order.razorpay_order_id,
          razorpay_signature: 'test_signature_123'
        };

        console.log('Verifying payment...');
        // Mock verification would happen here
        console.log('Payment verified, redirecting to order details');
        router.push(`/seller/orders/${order.id}`);
      } catch (err) {
        console.error('Test payment failed:', err);
      }
    };

    testPayment();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Testing Payment Flow</h1>
        <p>Please wait while we simulate a payment...</p>
      </div>
    </div>
  );
}