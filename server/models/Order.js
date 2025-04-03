const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  seller_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  supplier_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: [
      'pending', 
      'payment_pending', 
      'payment_completed', 
      'processing', 
      'shipped', 
      'delivered', 
      'cancelled'
    ],
    default: 'pending' 
  },
  payment_id: { 
    type: String 
  },
}, { 
  timestamps: true 
});

// Static method to update order status
orderSchema.statics.updateStatus = async function(orderId, status) {
  return this.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
};

module.exports = mongoose.model('Order', orderSchema);