const db = require('../config/test-db');

async function checkDbConnection() {
  try {
    await db.query('SELECT 1');
    return true;
  } catch (err) {
    console.error('Database connection check failed:', err);
    return false;
  }
}

async function withDbFallback(dbQuery, mockMethod, ...args) {
  const isDbHealthy = await checkDbConnection();
  
  if (isDbHealthy) {
    try {
      return await dbQuery();
    } catch (queryError) {
      console.error('Database query failed, falling back to mock:', queryError);
      return mockMethod(...args);
    }
  }
  
  console.log('Using mock data due to database connection issues');
  return mockMethod(...args);
}

module.exports = {
  checkDbConnection,
  withDbFallback
};