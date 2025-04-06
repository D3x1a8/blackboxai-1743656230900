export const getCategories = async () => {
    const res = await fetch('http://localhost:3001/api/categories', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return await res.json();
};

// New functions added
export const updateOrderStatus = async (orderId, status) => {
    const res = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
    });
    return await res.json();
};

export const updateProduct = async (productId, productData) => {
    const res = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
    });
    return await res.json();
};

export const getProducts = async () => {
    const res = await fetch('http://localhost:3001/api/products', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return await res.json();
};

export const getSupplierOrders = async () => {
    const res = await fetch('http://localhost:3001/api/supplier/orders', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return await res.json();
};

export const getProduct = async (productId) => {
    const res = await fetch(`http://localhost:3001/api/products/${productId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return await res.json();
};

export const getSellerCatalog = async () => {
    const res = await fetch('http://localhost:3001/api/seller/catalog', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return await res.json();
};

export const getSellerOrders = async () => {
    const res = await fetch('http://localhost:3001/api/seller/orders', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return await res.json();
};

// New functions added
export const markAllAsRead = async () => {
    const res = await fetch('http://localhost:3001/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return await res.json();
};

export const getNotifications = async () => {
    const res = await fetch('http://localhost:3001/api/notifications', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return await res.json();
};

// ... (keep all existing imports and other API functions)
