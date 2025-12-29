
import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  images: [String],
  slug: { type: String, required: true, unique: true },
  tags: [String],
  date: { type: Date, default: Date.now }
});

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
