// ... (keep all existing imports and other API functions)

export const getNotifications = async ({ page = 1, limit = 20, filter = 'all' } = {}) => {
  const url = `/api/notifications?page=${page}&limit=${limit}&filter=${filter}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return await res.json();
};

export const markAsRead = async (notificationId) => {
  const res = await fetch(`/api/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return await res.json();
};

export const markAllAsRead = async () => {
  const res = await fetch('/api/notifications/mark-all-read', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return await res.json();
};

// ... (keep all remaining existing API functions)