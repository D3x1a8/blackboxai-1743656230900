import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProductSkeleton from '../../../components/ProductSkeleton';

export default function CategoryPage() {
  const router = useRouter();
  const { category: categorySlug } = router.query;
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoryRes, productsRes] = await Promise.all([
          fetch(`/api/categories/${categorySlug}`),
          fetch(`/api/products/category/${categorySlug}`)
        ]);
        
        if (!categoryRes.ok) throw new Error('Category not found');
        if (!productsRes.ok) throw new Error('Failed to load products');

        setCategory(await categoryRes.json());
        setProducts(await productsRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) fetchData();
  }, [categorySlug]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  if (loading || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-8 animate-pulse"></div>
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
        <title>{category.meta_title || `${category.name} Products | Yaalgo`}</title>
        <meta name="description" content={category.meta_description || `Browse our ${category.name} products with automated fulfillment`} />
        <meta property="og:title" content={`${category.name} Products`} />
        <meta property="og:description" content={`Find the best ${category.name} products with Yaalgo's AI-powered platform`} />
      </Head>

      <h1 className="text-3xl font-bold mb-2">{category.name} Products</h1>
      <p className="text-gray-600 mb-8">{category.description || `Explore our selection of ${category.name} products`}</p>

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