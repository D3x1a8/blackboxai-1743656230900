const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authMiddleware');
const {
  getUserNotifications,
  markNotificationAsRead,
  markAllAsRead
} = require('../controllers/notificationController');

// Get paginated notifications with filters
router.get('/', authenticateJWT, getUserNotifications);

// Mark single notification as read
router.put('/:id/read', authenticateJWT, markNotificationAsRead);

// Mark all notifications as read
router.put('/mark-all-read', authenticateJWT, markAllAsRead);

module.exports = router;