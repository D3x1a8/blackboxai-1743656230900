const db = process.env.NODE_ENV === 'test' 
  ? require('../config/test-db') 
  : require('../config/db');
const { withDbFallback } = require('../utils/dbMonitor');
const mockNotifications = require('../mock-api/notifications');
const { getIO } = require('../services/socketService');

exports.getUserNotifications = async (req, res) => {
  try {
    const result = await withDbFallback(
      async () => {
        const { page = 1, limit = 20, filter = 'all' } = req.query;
        const offset = (page - 1) * limit;
        let whereClause = 'WHERE user_id = $1';
        const params = [req.user.id];
        
        if (filter === 'unread') {
          whereClause += ' AND read = false';
        } else if (filter !== 'all') {
          whereClause += ' AND type = $2';
          params.push(filter);
        }

        const notificationsQuery = `
          SELECT * FROM notifications
          ${whereClause}
          ORDER BY created_at DESC
          LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `;
        const notifications = await db.query(notificationsQuery, [...params, limit, offset]);

        const [total, unread] = await Promise.all([
          db.query(`SELECT COUNT(*) FROM notifications ${whereClause}`, params),
          db.query(
            'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read = false',
            [req.user.id]
          )
        ]);

        return {
          notifications: notifications.rows,
          total: parseInt(total.rows[0].count),
          unread: parseInt(unread.rows[0].count)
        };
      },
      () => mockNotifications.getNotifications({
        userId: req.user.id,
        page: req.query.page,
        limit: req.query.limit,
        filter: req.query.filter
      })
    );

    const io = getIO();
    io.to(req.user.id).emit('notification:count', result.unread);
    
    res.json(result);
  } catch (err) {
    console.error('Error in getUserNotifications:', err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const result = await withDbFallback(
      async () => {
        const dbResult = await db.query(
          `UPDATE notifications SET read = true 
           WHERE id = $1 AND user_id = $2 RETURNING *`,
          [req.params.id, req.user.id]
        );
        
        if (dbResult.rows.length === 0) {
          return null;
        }

        const unread = await db.query(
          'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read = false',
          [req.user.id]
        );
        
        return {
          notification: dbResult.rows[0],
          unread: parseInt(unread.rows[0].count)
        };
      },
      async () => {
        const notification = await mockNotifications.markAsRead(
          req.params.id, 
          req.user.id
        );
        const unread = await mockNotifications.getUnreadCount(req.user.id);
        return { notification, unread };
      }
    );

    if (!result) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const io = getIO();
    io.to(req.user.id).emit('notification:count', result.unread);
    
    res.json(result.notification);
  } catch (err) {
    console.error('Error in markNotificationAsRead:', err);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const result = await withDbFallback(
      async () => {
        await db.query(
          'UPDATE notifications SET read = true WHERE user_id = $1 AND read = false',
          [req.user.id]
        );
        return { unread: 0 };
      },
      async () => {
        await mockNotifications.markAllAsRead(req.user.id);
        return { unread: 0 };
      }
    );

    const io = getIO();
    io.to(req.user.id).emit('notification:count', result.unread);

    res.json({ success: true });
  } catch (err) {
    console.error('Error in markAllAsRead:', err);
    res.status(500).json({ message: 'Error marking all notifications as read' });
  }
};

exports.createNotification = async (userId, title, message, type, metadata = {}) => {
  return withDbFallback(
    async () => {
      const result = await db.query(
        `INSERT INTO notifications 
         (user_id, title, message, type, metadata) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [userId, title, message, type, metadata]
      );

      const unread = await db.query(
        'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read = false',
        [userId]
      );

      const io = getIO();
      io.to(userId.toString()).emit('notification:new', result.rows[0]);
      io.to(userId.toString()).emit('notification:count', parseInt(unread.rows[0].count));

      return result.rows[0];
    },
    async () => {
      return mockNotifications.createNotification({
        user_id: userId,
        title,
        message,
        type,
        metadata
      });
    }
  );
};
