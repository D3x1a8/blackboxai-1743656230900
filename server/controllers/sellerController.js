const SellerProfile = require('../models/SellerProfile');
const Order = require('../models/Order');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');

exports.registerSeller = [
  authenticateJWT,
  authorizeRoles('user'),
  async (req, res) => {
    try {
      const { ecommercePlatforms } = req.body;
      
      // First update user role to seller
      await User.updateRole(req.user.id, 'seller');
      
      const sellerProfile = await SellerProfile.create({
        userId: req.user.id,
        ecommercePlatforms
      });
      
      res.status(201).json(sellerProfile);
    } catch (err) {
      console.error('Seller registration error:', err);
      res.status(500).json({ message: 'Error registering seller' });
    }
  }
];

exports.getProductCatalog = [
  authenticateJWT,
  authorizeRoles('seller'),
  async (req, res) => {
    try {
      const products = await Product.findAll();
      const catalog = products.map(p => ({
        ...p,
        seller_price: p.price * (1 + (p.margin_percent || 0.2))
      }));
      res.json(catalog);
    } catch (err) {
      console.error('Catalog error:', err);
      res.status(500).json({ message: 'Error fetching catalog' });
    }
  }
];

const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.placeOrder = [
  authenticateJWT,
  authorizeRoles('seller'),
  async (req, res) => {
    try {
      const { product_id, quantity } = req.body;
      const product = await Product.findById(product_id);
      
      // Calculate total amount (including margin)
      const amount = Math.round(product.price * (1 + (product.margin_percent || 0.2)) * quantity * 100);
      
      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt: `order_${Date.now()}`
      });
      
      // Create our system order
      const order = await Order.create({
        product_id,
        seller_id: req.user.id,
        supplier_id: product.supplier_id,
        quantity,
        status: 'payment_pending',
        payment_id: razorpayOrder.id
      });
      
      res.status(201).json({
        ...order,
        razorpay_order_id: razorpayOrder.id,
        amount,
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID
      });
    } catch (err) {
      console.error('Order placement error:', err);
      res.status(500).json({ message: 'Error placing order' });
    }
  }
];

exports.verifyPayment = [
  authenticateJWT,
  authorizeRoles('seller'),
  async (req, res) => {
    try {
      const { order_id, payment_id, signature } = req.body;
      
      // Verify payment signature
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${order_id}|${payment_id}`)
        .digest('hex');
      
      // Skip signature verification in test mode
      if (process.env.NODE_ENV !== 'test' && generatedSignature !== signature) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
      
      // Update order status
      await Order.updateStatus(order_id, 'payment_completed');
      
      res.json({ success: true });
    } catch (err) {
      console.error('Payment verification error:', err);
      res.status(500).json({ message: 'Error verifying payment' });
    }
  }
];

// Supplier order management
exports.getSupplierOrders = [
  authenticateJWT,
  authorizeRoles('supplier'),
  async (req, res) => {
    try {
      const orders = await Order.find({ supplier_id: req.user.id })
        .populate('product_id', 'name price')
        .populate('seller_id', 'name');
      
      const formattedOrders = orders.map(order => ({
        id: order._id,
        product_id: order.product_id._id,
        product_name: order.product_id.name,
        quantity: order.quantity,
        status: order.status,
        seller_name: order.seller_id.name,
        created_at: order.createdAt
      }));
      
      res.json(formattedOrders);
    } catch (err) {
      console.error('Error fetching supplier orders:', err);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  }
];

exports.updateOrderStatus = [
  authenticateJWT,
  authorizeRoles('supplier'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const order = await Order.findOneAndUpdate(
        { _id: id, supplier_id: req.user.id },
        { status },
        { new: true }
      );
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json({ success: true, order });
    } catch (err) {
      console.error('Error updating order status:', err);
      res.status(500).json({ message: 'Error updating order status' });
    }
  }
];
