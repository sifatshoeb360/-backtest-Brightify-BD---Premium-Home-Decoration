
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'moderator', 'customer'], 
    default: 'customer' 
  },
  createdAt: { type: Date, default: Date.now },
  // Cart/Wishlist persistence in DB
  savedCart: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  savedWishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
