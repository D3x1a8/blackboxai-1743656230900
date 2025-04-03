import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  return (
    <AdminLayout>
      <Head>
        <title>Yaalgo Admin Dashboard</title>
      </Head>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard 
            title="Products" 
            count="125" 
            onClick={() => router.push('/admin/products')}
          />
          <DashboardCard 
            title="Categories" 
            count="15" 
            onClick={() => router.push('/admin/categories')}
          />
          <DashboardCard 
            title="Users" 
            count="42" 
            onClick={() => router.push('/admin/users')}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

function DashboardCard({ title, count, onClick }) {
  return (
    <div 
      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{count}</p>
    </div>
  );
}