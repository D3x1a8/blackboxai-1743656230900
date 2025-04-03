const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  supplier_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  stock: { 
    type: Number, 
    required: true,
    min: 0
  },
  low_stock_threshold: {
    type: Number,
    default: 5
  },
  last_updated: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Add index for faster queries
inventorySchema.index({ product_id: 1, supplier_id: 1 }, { unique: true });

// Static method to get low stock items
inventorySchema.statics.getLowStock = async function(supplierId) {
  return this.find({ 
    supplier_id: supplierId,
    stock: { $lte: '$low_stock_threshold' }
  }).populate('product_id', 'name sku');
};

module.exports = mongoose.model('Inventory', inventorySchema);