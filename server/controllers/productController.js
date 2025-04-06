const Product = require('../models/Product');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.findByCategory(req.params.categoryId);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = [
  authenticateJWT,
  authorizeRoles('admin', 'seller'),
  async (req, res) => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.updateProduct = [
  authenticateJWT,
  authorizeRoles('admin', 'seller'),
  async (req, res) => {
    try {
      const product = await Product.update(req.params.id, req.body);
      res.json(product);
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.deleteProduct = [
  authenticateJWT,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      await Product.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
];
