const db = require('../config/test-db');
const EventEmitter = require('events');

class DbMonitor extends EventEmitter {
  constructor() {
    super();
    this.isConnected = process.env.NODE_ENV !== 'test';
    this.reconnectAttempts = 0;
    this.MAX_RECONNECT_ATTEMPTS = process.env.NODE_ENV === 'test' ? 0 : 5;
    this.RECONNECT_INTERVAL = 5000;
    this.checkInterval = 30000; // 30 seconds health checks
    this.monitorInterval = null;
  }

  async checkConnection() {
    try {
      await db.query('SELECT 1');
      if (!this.isConnected) {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connected');
      }
      return true;
    } catch (err) {
      if (this.isConnected) {
        this.isConnected = false;
        this.emit('disconnected', err);
      }
      return false;
    }
  }

  async attemptReconnect() {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) return false;
    
    this.reconnectAttempts++;
    console.log(`Database reconnection attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS}`);
    
    try {
      // Try to reconnect by creating a new pool
      await db.end();
      await db.connect();
      const isHealthy = await this.checkConnection();
      if (isHealthy) return true;
    } catch (err) {
      console.error('Reconnection failed:', err.message);
    }

    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      setTimeout(() => this.attemptReconnect(), this.RECONNECT_INTERVAL);
    }
    return false;
  }

  startMonitoring() {
    // Initial check
    this.checkConnection().then(connected => {
      if (!connected) this.attemptReconnect();
    });

    // Periodic health checks
    this.monitorInterval = setInterval(() => {
      this.checkConnection();
    }, this.checkInterval);

    return this;
  }

  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
  }

  getStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.MAX_RECONNECT_ATTEMPTS,
      lastCheck: new Date().toISOString()
    };
  }
}

// Create singleton instance
const dbMonitor = new DbMonitor();

if (process.env.NODE_ENV !== 'test') {
  dbMonitor.startMonitoring();
}

module.exports = {
  dbMonitor,
  withDbFallback: async (dbQuery, mockMethod, ...args) => {
    if (process.env.NODE_ENV === 'test') {
      console.log('Test mode - using mock data instead of database');
      return mockMethod(...args);
    }

    if (!dbMonitor.isConnected) {
      console.log('Using mock data - database disconnected');
      return mockMethod(...args);
    }

    try {
      return await dbQuery();
    } catch (err) {
      console.error('Database query failed:', err.message);
      dbMonitor.checkConnection(); // Verify connection status
      return mockMethod(...args);
    }
  }
};