const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Mock products data
const products = [
  {
    id: 1,
    name: "Premium Smartphone",
    slug: "premium-smartphone",
    description: "Latest model with advanced camera features",
    price: 799.99,
    stock: 50,
    image_url: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg",
    category: "electronics"
  },
  {
    id: 2,
    name: "Wireless Headphones", 
    slug: "wireless-headphones",
    description: "Noise cancelling wireless headphones with 30hr battery",
    price: 199.99,
    stock: 100,
    image_url: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
    category: "electronics"
  },
  {
    id: 3,
    name: "Organic Cotton T-shirt",
    slug: "organic-cotton-tshirt",
    description: "100% organic cotton crew neck t-shirt",
    price: 29.99,
    stock: 200,
    image_url: "https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg",
    category: "clothing"
  }
];

const categories = [
  { slug: "electronics", name: "Electronics" },
  { slug: "clothing", name: "Clothing" }
];

// Routes
app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/slug/:slug', (req, res) => {
  const product = products.find(p => p.slug === req.params.slug);
  res.json(product || {});
});

app.get('/products/related/:id', (req, res) => {
  // Return all products except the one with matching ID
  const related = products.filter(p => p.id !== parseInt(req.params.id));
  res.json(related);
});

app.get('/categories', (req, res) => {
  res.json(categories);
});

app.get('/categories/:slug', (req, res) => {
  const category = categories.find(c => c.slug === req.params.slug);
  res.json(category || {});
});

app.get('/products/category/:category', (req, res) => {
  const categoryProducts = products.filter(p => p.category === req.params.category);
  res.json(categoryProducts);
});

// Start server
app.listen(port, () => {
  console.log(`Mock API running on port ${port}`);
});