
export type Language = 'en' | 'bn';
export type UserRole = 'admin' | 'moderator' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  description: string;
  category: string;
  images: string[];
  videoUrl?: string;
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  variants?: { name: string; options: string[] }[];
  tags: string[];
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: Record<string, string>;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  images: string[];
  slug: string;
  tags: string[];
}

export interface Moderator {
  id: string;
  name: string;
  password: string;
  createdAt: string;
}

export interface AppSettings {
  siteName: string;
  logoUrl: string;
  heroImage: string;
  primaryColor: string;
  contactEmail: string;
  phoneNumber: string;
  bkashNumber: string;
  nagadNumber: string;
  address: string;
  facebookUrl: string;
  showPromoBanner: boolean;
  promoText: string;
  adminPassword?: string;
  moderators: Moderator[];
}

export interface FormSubmission {
  id: string;
  type: 'contact' | 'newsletter';
  name: string;
  email: string;
  phone?: string;
  message?: string;
  date: string;
  read: boolean;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentDetails?: string;
}
