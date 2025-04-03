const { query } = require('../config/db');

class Category {
  static async findAll() {
    const result = await query('SELECT * FROM categories');
    return result.rows;
  }

  static async findById(id) {
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findBySlug(slug) {
    const result = await query('SELECT * FROM categories WHERE slug = $1', [slug]);
    return result.rows[0];
  }

  static async create(categoryData) {
    const { name, slug, description } = categoryData;
    const result = await query(
      `INSERT INTO categories(name, slug, description) 
       VALUES($1, $2, $3) RETURNING *`,
      [name, slug, description]
    );
    return result.rows[0];
  }

  static async update(id, categoryData) {
    const { name, slug, description } = categoryData;
    const result = await query(
      `UPDATE categories 
       SET name = $1, slug = $2, description = $3 
       WHERE id = $4 RETURNING *`,
      [name, slug, description, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await query('DELETE FROM categories WHERE id = $1', [id]);
  }
}

module.exports = Category;