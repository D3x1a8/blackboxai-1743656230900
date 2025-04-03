const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);

// Protected routes
router.post('/', 
  productController.createProduct[0], 
  productController.createProduct[1], 
  productController.createProduct[2]
);

router.put('/:id', 
  productController.updateProduct[0], 
  productController.updateProduct[1], 
  productController.updateProduct[2]
);

router.delete('/:id', 
  productController.deleteProduct[0], 
  productController.deleteProduct[1], 
  productController.deleteProduct[2]
);

module.exports = router;