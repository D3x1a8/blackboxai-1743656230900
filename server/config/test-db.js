const { Pool } = require('pg');

// Test database configuration
const pool = new Pool({
  user: 'testuser',
  host: 'localhost',
  database: 'test_notifications',
  password: 'testpassword',
  port: 5432,
});

// Replace entire pool with mock object in test mode
const mockPool = {
  query: async () => {
    console.log('Using mock data - database disabled in test mode');
    throw new Error('Database disabled in test mode - using mock data');
  },
  connect: () => Promise.reject(new Error('Database disabled in test mode')),
  end: () => Promise.resolve(),
  on: () => mockPool
};

// Replace the actual pool with mock
module.exports = mockPool;
