const User = require('../models/User');

async function sendProductStatusEmail(productId, status, reason = '') {
  try {
    // Get product with supplier info
    const product = await Product.findById(productId)
      .populate('supplier_id', 'email name');
    
    if (!product || !product.supplier_id) {
      console.error('Product or supplier not found');
      return;
    }

    const { email, name } = product.supplier_id;
    const subject = `Your product "${product.name}" has been ${status}`;
    
    let message = `Hello ${name},\n\n`;
    message += `Your product "${product.name}" (SKU: ${product.sku}) `;
    
    if (status === 'approved') {
      message += 'has been approved and is now live in our marketplace.\n';
      message += 'You can view it here: [Product Link]\n';
    } else {
      message += `has been rejected for the following reason:\n\n`;
      message += `${reason}\n\n`;
      message += 'Please update your product and resubmit for review.\n';
    }

    // In a real implementation, we would send an actual email here
    console.log('=== EMAIL NOTIFICATION ===');
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message:\n${message}`);
    console.log('==========================');

    return true;
  } catch (err) {
    console.error('Error sending product status email:', err);
    return false;
  }
}

module.exports = { sendProductStatusEmail };