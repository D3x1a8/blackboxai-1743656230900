import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProductSkeleton from '../../components/ProductSkeleton';

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productRes = await fetch(`/api/products/${slug}`);
        const productData = await productRes.json();
        setProduct(productData);

        const relatedRes = await fetch(`/api/products/related/${productData.id}`);
        const relatedData = await relatedRes.json();
        setRelatedProducts(relatedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading product: {error}
        </div>
      </div>
    );
  }

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="md:w-1/2 space-y-4">
            <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image_url,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{product.meta_title || `${product.name} | Yaalgo`}</title>
        <meta name="description" content={product.meta_description || product.description.substring(0, 160)} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description.substring(0, 160)} />
        <meta property="og:image" content={product.image_url} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      </Head>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img 
            src={product.image_url || 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'} 
            alt={product.name}
            className="w-full rounded-lg shadow-md"
            loading="lazy"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-blue-600 mb-6">${product.price.toFixed(2)}</p>
          <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: product.description }} />
          
          {relatedProducts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Related Products</h2>
              <div className="grid grid-cols-2 gap-4">
                {relatedProducts.map(related => (
                  <a key={related.id} href={`/products/${related.slug}`} className="block">
                    <img 
                      src={related.image_url || 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'} 
                      alt={related.name}
                      className="w-full h-32 object-cover rounded"
                      loading="lazy"
                    />
                    <p className="mt-2 text-sm font-medium">{related.name}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}