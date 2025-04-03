import { useState } from 'react';
import SupplierLayout from '../../components/supplier/SupplierLayout';
import OrderManagement from '../../components/supplier/OrderManagement';

export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <SupplierLayout>
      <div className="space-y-6">
        {activeTab === 'orders' && <OrderManagement />}
        {activeTab === 'inventory' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Inventory Management</h2>
            <p className="text-gray-500">Inventory features coming soon</p>
          </div>
        )}
        {activeTab === 'products' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Product Management</h2>
            <p className="text-gray-500">Product features coming soon</p>
          </div>
        )}
      </div>
    </SupplierLayout>
  );
}