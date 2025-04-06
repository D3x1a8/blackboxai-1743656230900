import React, { useEffect, useState } from 'react';
import ProductCatalog from '../components/seller/ProductCatalog';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Welcome to Yaalgo</h1>
      <p>Your AI-Powered E-commerce Automation Platform</p>
      <ProductCatalog products={products} loading={loading} onProductSelect={(product) => console.log(product)} />
    </div>
  );
};

export default HomePage;
