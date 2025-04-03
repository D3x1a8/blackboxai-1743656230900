import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SellerLayout from '../../components/seller/SellerLayout';
import ProductCatalog from '../../components/seller/ProductCatalog';
import OrderList from '../../components/seller/OrderList';
import { getSellerCatalog, getSellerOrders } from '../../lib/api';

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [catalog, setCatalog] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'catalog') {
          const data = await getSellerCatalog();
          setCatalog(data);
        } else {
          const data = await getSellerOrders();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <SellerLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'catalog' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('catalog')}
          >
            Product Catalog
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'orders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('orders')}
          >
            My Orders
          </button>
        </div>

        {activeTab === 'catalog' ? (
          <ProductCatalog 
            products={catalog} 
            loading={loading} 
            onProductSelect={(product) => router.push(`/seller/order/new?productId=${product.id}`)}
          />
        ) : (
          <OrderList orders={orders} loading={loading} />
        )}
      </div>
    </SellerLayout>
  );
}