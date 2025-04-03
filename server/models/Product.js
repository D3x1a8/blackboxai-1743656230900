const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  category_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  supplier_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  images: [{ 
    type: String 
  }],
  sku: { 
    type: String, 
    unique: true 
  },
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'approved', 'rejected'],
    default: 'draft'
  },
  rejection_reason: { 
    type: String 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
productSchema.index({ supplier_id: 1 });
productSchema.index({ status: 1 });
productSchema.index({ category_id: 1 });
productSchema.index({ sku: 1 }, { unique: true });

// Virtual for formatted price
productSchema.virtual('formatted_price').get(function() {
  return `$${this.price.toFixed(2)}`;
});

module.exports = mongoose.model('Product', productSchema);