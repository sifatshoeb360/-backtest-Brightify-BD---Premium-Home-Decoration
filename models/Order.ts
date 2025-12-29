
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  id: String, // Keep the product reference string for legacy compat
  name: String,
  price: Number,
  salePrice: Number,
  quantity: Number,
  images: [String],
  slug: String
});

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentDetails: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
