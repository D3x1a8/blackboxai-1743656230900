const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

// Protected admin routes
router.post('/', 
  categoryController.createCategory[0], 
  categoryController.createCategory[1], 
  categoryController.createCategory[2]
);

router.put('/:id', 
  categoryController.updateCategory[0], 
  categoryController.updateCategory[1], 
  categoryController.updateCategory[2]
);

router.delete('/:id', 
  categoryController.deleteCategory[0], 
  categoryController.deleteCategory[1], 
  categoryController.deleteCategory[2]
);

module.exports = router;