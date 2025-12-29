
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: Number,
  description: String,
  category: { type: String, required: true },
  images: [String],
  videoUrl: String,
  stock: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: true },
  slug: { type: String, required: true, unique: true },
  tags: [String],
  reviews: [ReviewSchema]
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
