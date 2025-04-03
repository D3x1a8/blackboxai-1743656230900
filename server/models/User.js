const { query } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User {
  static async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async create({ name, email, password, role = 'user' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async updateRole(id, newRole) {
    const result = await query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, role',
      [newRole, id]
    );
    return result.rows[0];
  }

  static async updateProfile(id, updates) {
    const { business_name, contact_info } = updates;
    const result = await query(
      'UPDATE users SET business_name = $1, contact_info = $2 WHERE id = $3 RETURNING id, business_name',
      [business_name, contact_info, id]
    );
    return result.rows[0];
  }

  static async comparePasswords(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static generateToken(user) {
    return jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
  }
}

module.exports = User;