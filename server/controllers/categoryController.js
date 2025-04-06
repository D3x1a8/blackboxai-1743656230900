const Category = require('../models/Category'); // Assuming a similar model exists for categories
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findBySlug(req.params.slug); // Assuming a method exists in the model
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    console.error('Error fetching category by slug:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createCategory = [
  authenticateJWT,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const category = await Category.create(req.body);
      res.status(201).json(category);
    } catch (err) {
      console.error('Error creating category:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.updateCategory = [
  authenticateJWT,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const category = await Category.update(req.params.id, req.body);
      res.json(category);
    } catch (err) {
      console.error('Error updating category:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.deleteCategory = [
  authenticateJWT,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      await Category.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      console.error('Error deleting category:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
];
