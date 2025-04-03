const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

function initializeSocket(server) {
  io = socketio(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.userId = user._id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Join user to their own room for private messages
    socket.join(socket.userId);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
}

function getIO() {
  if (process.env.NODE_ENV === 'test') {
    // Return mock socket.io with basic emit functionality
    return {
      emit: () => {},
      to: () => ({ emit: () => {} }),
      in: () => ({ emit: () => {} })
    };
  }
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

module.exports = {
  initializeSocket,
  getIO
};