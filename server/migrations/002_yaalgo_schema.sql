-- Add supplier/seller relationships
ALTER TABLE users ADD COLUMN business_name VARCHAR(255);
ALTER TABLE users ADD COLUMN contact_info JSONB;

-- Create supplier profiles
CREATE TABLE supplier_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  business_registration VARCHAR(255),
  bank_details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create seller profiles
CREATE TABLE seller_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  ecommerce_platforms JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Modify products table
ALTER TABLE products ADD COLUMN supplier_id INTEGER REFERENCES users(id);
ALTER TABLE products ADD COLUMN cost_price DECIMAL(10,2);
ALTER TABLE products ADD COLUMN margin_percent DECIMAL(5,2) DEFAULT 0.20;

-- Create orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  seller_id INTEGER REFERENCES users(id),
  supplier_id INTEGER REFERENCES users(id),
  quantity INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  tracking_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  amount DECIMAL(10,2),
  payment_gateway VARCHAR(50),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);