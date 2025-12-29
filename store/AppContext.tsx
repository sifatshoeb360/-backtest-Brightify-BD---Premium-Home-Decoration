
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, Category, BlogPost, Testimonial, AppSettings, CartItem, Order, FormSubmission, Language, User, Review, UserRole, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BLOG_POSTS, INITIAL_TESTIMONIALS, INITIAL_SETTINGS, TRANSLATIONS } from '../constants';

interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  testimonials: Testimonial[];
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  submissions: FormSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<FormSubmission[]>>;
  addSubmission: (type: 'contact' | 'newsletter', data: any) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
  // User Management
  currentUser: User | null;
  users: User[];
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string, role?: UserRole) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  logout: () => void;
  deleteUser: (id: string) => void;
  addReview: (productId: string, rating: number, comment: string) => void;
  sendMockEmail: (to: string, subject: string, body: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('site_users');
    if (saved) return JSON.parse(saved);
    return [{
      id: 'admin-001',
      name: 'Super Admin',
      email: 'admin@brightify.com',
      password: 'admin',
      role: 'admin',
      createdAt: new Date().toLocaleDateString()
    }];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('current_site_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('blogPosts');
    return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // User-specific Cart and Wishlist Logic
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // Ref to track the initial mount or user switches to prevent accidental wipes
  const isInitialMount = useRef(true);

  // Sync Cart/Wishlist when user changes
  useEffect(() => {
    const userSuffix = currentUser ? currentUser.id : 'guest';
    const savedCart = localStorage.getItem(`cart_${userSuffix}`);
    const savedWishlist = localStorage.getItem(`wishlist_${userSuffix}`);
    
    setCart(savedCart ? JSON.parse(savedCart) : []);
    setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    
    // Allow saving after states have been refreshed from storage for the new user
    isInitialMount.current = false;
  }, [currentUser?.id]);

  // Persist Cart/Wishlist whenever they change
  useEffect(() => {
    if (!isInitialMount.current) {
      const userSuffix = currentUser ? currentUser.id : 'guest';
      localStorage.setItem(`cart_${userSuffix}`, JSON.stringify(cart));
    }
  }, [cart, currentUser?.id]);

  useEffect(() => {
    if (!isInitialMount.current) {
      const userSuffix = currentUser ? currentUser.id : 'guest';
      localStorage.setItem(`wishlist_${userSuffix}`, JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser?.id]);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [submissions, setSubmissions] = useState<FormSubmission[]>(() => {
    const saved = localStorage.getItem('submissions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('blogPosts', JSON.stringify(blogPosts)), [blogPosts]);
  useEffect(() => localStorage.setItem('settings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('submissions', JSON.stringify(submissions)), [submissions]);
  useEffect(() => localStorage.setItem('language', language), [language]);
  useEffect(() => localStorage.setItem('site_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('current_site_user', JSON.stringify(currentUser)), [currentUser]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => wishlist.some(item => item.id === productId);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    sendMockEmail(order.customerEmail, "Order Confirmation - " + order.id, "Thank you for your order!");
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addSubmission = (type: 'contact' | 'newsletter', data: any) => {
    const newSub: FormSubmission = {
      id: Date.now().toString(),
      type,
      name: data.name || 'Anonymous',
      email: data.email,
      phone: data.phone,
      message: data.message,
      date: new Date().toLocaleString(),
      read: false
    };
    setSubmissions(prev => [newSub, ...prev]);
  };

  const loginUser = (email: string, pass: string): boolean => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const registerUser = (name: string, email: string, pass: string, role: UserRole = 'customer') => {
    const newUser: User = { 
      id: Date.now().toString(), 
      name, 
      email, 
      password: pass, 
      role,
      createdAt: new Date().toLocaleDateString()
    };
    setUsers(prev => [...prev, newUser]);
    if (role === 'customer') setCurrentUser(newUser);
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };
  
  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) setCurrentUser(null);
  };

  const addReview = (productId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const newReview: Review = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      rating,
      comment,
      date: new Date().toLocaleDateString()
    };
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, reviews: [...(p.reviews || []), newReview] } : p));
  };

  const sendMockEmail = (to: string, subject: string, body: string) => {
    console.log(`[BACKEND EMAIL SERVICE] To: ${to} | Subject: ${subject} | Body: ${body}`);
  };

  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    return TRANSLATIONS[language][key] || key;
  };

  return (
    <AppContext.Provider value={{
      products, setProducts, categories, setCategories, blogPosts, setBlogPosts, testimonials: INITIAL_TESTIMONIALS,
      settings, setSettings, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, 
      wishlist, toggleWishlist, isInWishlist, orders, setOrders, addOrder, updateOrderStatus,
      submissions, setSubmissions, addSubmission, language, setLanguage, t,
      currentUser, users, login: loginUser, register: registerUser, updateUser, logout: logoutUser, deleteUser, addReview, sendMockEmail
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
