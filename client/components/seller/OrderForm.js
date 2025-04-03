import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getProductDetails, placeOrder } from '../../lib/api';

export default function OrderForm() {
  const router = useRouter();
  const { productId } = router.query;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const data = await getProductDetails(productId);
          setProduct(data);
        } catch (err) {
          setError('Failed to load product details');
        }
      }
    };
    fetchProduct();
  }, [productId]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await placeOrder({
        product_id: productId,
        quantity
      });

      const isRazorpayLoaded = await loadRazorpay();
      if (!isRazorpayLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Yaalgo',
        description: `Payment for Order #${order.id}`,
        order_id: order.razorpay_order_id,
        handler: async (response) => {
          try {
            await verifyPayment({
              order_id: order.id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });
            router.push(`/seller/orders/${order.id}`);
          } catch (err) {
            setError('Payment verification failed');
          }
        },
        prefill: {
          name: 'Seller Name',
          email: 'seller@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Place New Order</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium">{product.name}</h3>
        <p className="text-gray-600">Supplier Price: ${product.price.toFixed(2)}</p>
        <p className="text-gray-600">Your Price: ${(product.price * (1 + (product.margin_percent || 0.2))).toFixed(2)}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}