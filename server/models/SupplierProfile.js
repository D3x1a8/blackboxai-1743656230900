const { query } = require('../config/db');

class SupplierProfile {
  static async create({ userId, businessRegistration, bankDetails }) {
    const result = await query(
      'INSERT INTO supplier_profiles(user_id, business_registration, bank_details) VALUES($1, $2, $3) RETURNING *',
      [userId, businessRegistration, bankDetails]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await query(
      'SELECT * FROM supplier_profiles WHERE user_id = $1',
      [userId]
    );
    return result.rows[0];
  }

  static async update(userId, updates) {
    const { businessRegistration, bankDetails } = updates;
    const result = await query(
      'UPDATE supplier_profiles SET business_registration = $1, bank_details = $2 WHERE user_id = $3 RETURNING *',
      [businessRegistration, bankDetails, userId]
    );
    return result.rows[0];
  }

  static async getProducts(userId) {
    const result = await query(
      'SELECT * FROM products WHERE supplier_id = $1',
      [userId]
    );
    return result.rows;
  }
}

module.exports = SupplierProfile;