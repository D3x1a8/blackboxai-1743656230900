const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route example
router.get('/me', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;