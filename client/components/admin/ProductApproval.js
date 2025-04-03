import { useState, useEffect } from 'react';
import { getPendingProducts, reviewProduct } from '../../lib/api';

export default function ProductApproval() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getPendingProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch pending products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleApprove = async (productId) => {
    try {
      await reviewProduct(productId, { status: 'approved' });
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      console.error('Failed to approve product:', err);
    }
  };

  const handleReject = async (productId) => {
    if (!rejectionReason) return;
    try {
      await reviewProduct(productId, { 
        status: 'rejected',
        rejection_reason: rejectionReason
      });
      setProducts(products.filter(p => p._id !== productId));
      setRejectionReason('');
    } catch (err) {
      console.error('Failed to reject product:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Product Approval Queue</h2>
      
      {products.length === 0 ? (
        <p className="text-gray-500">No products pending approval</p>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-16 w-16">
                  <img 
                    className="h-16 w-16 rounded object-cover" 
                    src={product.images[0] || '/placeholder-product.png'} 
                    alt={product.name}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-gray-500">{product.description}</p>
                  <p className="text-gray-900 font-medium">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Submitted by: {product.supplier_id?.name || 'Unknown'}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-4">
                <button
                  onClick={() => handleApprove(product._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <div className="flex-1 flex items-center space-x-2">
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Rejection reason"
                    className="border rounded px-3 py-2 flex-1 text-sm"
                  />
                  <button
                    onClick={() => handleReject(product._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    disabled={!rejectionReason}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}