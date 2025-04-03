const notifications = [
  {
    id: 1,
    user_id: 1,
    title: 'Welcome',
    message: 'Welcome to our service',
    type: 'system',
    read: false,
    created_at: new Date()
  },
  {
    id: 2, 
    user_id: 1,
    title: 'New feature',
    message: 'Check out our new dashboard',
    type: 'feature',
    read: true,
    created_at: new Date(Date.now() - 86400000)
  }
];

module.exports = {
  getNotifications: ({userId, page = 1, limit = 10}) => {
    const userNotifs = notifications.filter(n => n.user_id === userId);
    const start = (page - 1) * limit;
    return {
      notifications: userNotifs.slice(start, start + limit),
      total: userNotifs.length,
      unread: userNotifs.filter(n => !n.read).length
    };
  },
  markAsRead: (id, userId) => {
    const notif = notifications.find(n => n.id === id && n.user_id === userId);
    if (notif) {
      notif.read = true;
      return {
        notification: notif,
        unread: notifications.filter(n => n.user_id === userId && !n.read).length
      };
    }
    return null;
  }
};