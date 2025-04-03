import { useState, useEffect } from 'react';
import { getProducts } from '../../lib/api';
import Head from 'next/head';
import ProductSkeleton from '../../components/ProductSkeleton';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading products: {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Product Catalog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Yaalgo Product Catalog | AI-Powered E-commerce</title>
        <meta name="description" content="Browse our extensive catalog of products from verified suppliers. Automated fulfillment and competitive pricing." />
        <meta property="og:title" content="Yaalgo Product Catalog" />
        <meta property="og:description" content="AI-powered e-commerce automation platform connecting suppliers and sellers." />
      </Head>

      <h1 className="text-3xl font-bold mb-8">Product Catalog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img 
              src={product.image_url || 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'} 
              alt={product.name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                <a href={`/products/${product.slug}`} className="hover:text-blue-600">
                  {product.name}
                </a>
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
