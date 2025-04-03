const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');
const { 
  getSupplierProfile, 
  updateSupplierProfile,
  getSupplierOrders,
  updateOrderStatus,
  getInventory,
  updateInventory
} = require('../controllers/sellerController');

// Profile routes
router.get('/profile', authenticateJWT, authorizeRoles('supplier'), getSupplierProfile);
router.put('/profile', authenticateJWT, authorizeRoles('supplier'), updateSupplierProfile);

// Order routes
router.get('/orders', authenticateJWT, authorizeRoles('supplier'), getSupplierOrders);
router.put('/orders/:id/status', authenticateJWT, authorizeRoles('supplier'), updateOrderStatus);

// Inventory routes
router.get('/inventory', authenticateJWT, authorizeRoles('supplier'), getInventory);
router.put('/inventory/:productId', authenticateJWT, authorizeRoles('supplier'), updateInventory);

// Product routes
router.get('/products', authenticateJWT, authorizeRoles('supplier'), getSupplierProducts);
router.post('/products', authenticateJWT, authorizeRoles('supplier'), createSupplierProduct);
router.put('/products/:id', authenticateJWT, authorizeRoles('supplier'), updateSupplierProduct);

module.exports = router;
