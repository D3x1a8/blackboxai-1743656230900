const { Pool } = require('pg');
const pool = new Pool({
    user: 'pritesh',
    host: 'localhost',
    database: 'yaalgo_db',
    password: 'admin@123',
    port: 5432,
});

const Product = {
    async findAll() {
        const res = await pool.query('SELECT * FROM products');
        return res.rows;
    },

    async findByCategory(categoryId) {
        const res = await pool.query('SELECT * FROM products WHERE category_id = $1', [categoryId]);
        return res.rows;
    },

    async create(productData) {
        const { name, description, price, category_id, supplier_id, images, sku, status } = productData;
        const res = await pool.query(
            'INSERT INTO products (name, description, price, category_id, supplier_id, images, sku, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, description, price, category_id, supplier_id, images, sku, status]
        );
        return res.rows[0];
    },

    async update(id, productData) {
        const { name, description, price, category_id, supplier_id, images, sku, status } = productData;
        const res = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3, category_id = $4, supplier_id = $5, images = $6, sku = $7, status = $8 WHERE id = $9 RETURNING *',
            [name, description, price, category_id, supplier_id, images, sku, status, id]
        );
        return res.rows[0];
    },

    async delete(id) {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
    }
};

module.exports = Product;
