const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Verify user exists in database
    const result = await query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = {
      id: decoded.userId,
      role: decoded.role
    };
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(403).json({ message: 'Forbidden' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = {
  authenticateJWT,
  authorizeRoles
};