import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'grid' },
    { name: 'Products', path: '/admin/products', icon: 'box' },
    { name: 'Categories', path: '/admin/categories', icon: 'tag' },
    { name: 'Users', path: '/admin/users', icon: 'users' },
    { name: 'Orders', path: '/admin/orders', icon: 'shopping-cart' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center p-2 rounded-md ${router.pathname === item.path ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button 
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              Menu
            </button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="mr-2">Admin User</span>
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}