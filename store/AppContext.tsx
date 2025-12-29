
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
  // --- DATABASE SYNC LOGIC ---
  // Note: These would typically point to /api/products, /api/categories etc.
  // For the sake of this implementation, we preserve the frontend functionality
  // while defining the structure for the backend move.

  const [language, setLanguage] = useState<Language>('en');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);

  // Initial Data Fetch from Mongoose API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Example API structure for a real backend
        const [pRes, cRes, bRes, sRes] = await Promise.all([
          fetch('/api/products').catch(() => null),
          fetch('/api/categories').catch(() => null),
          fetch('/api/blog').catch(() => null),
          fetch('/api/settings').catch(() => null)
        ]);

        if (pRes?.ok) setProducts(await pRes.json());
        if (cRes?.ok) setCategories(await cRes.json());
        if (bRes?.ok) setBlogPosts(await bRes.json());
        if (sRes?.ok) setSettings(await sRes.json());
      } catch (err) {
        console.warn('Backend API not found, using static constants');
      }
    };
    fetchData();
  }, []);

  // Sync Cart & Wishlist when User logs in (Personalized Data)
  useEffect(() => {
    if (currentUser) {
      // Fetch user-specific cart and wishlist from Mongoose
      const syncUserVault = async () => {
        try {
          const res = await fetch(`/api/users/${currentUser.id}/vault`);
          if (res.ok) {
            const data = await res.json();
            setCart(data.cart || []);
            setWishlist(data.wishlist || []);
          }
        } catch (e) {
          // Fallback to memory if API fails
        }
      };
      syncUserVault();
    } else {
      setCart([]);
      setWishlist([]);
    }
  }, [currentUser?.id]);

  // Persist Cart & Wishlist Changes to DB
  useEffect(() => {
    if (currentUser) {
      const persistVault = async () => {
        try {
          await fetch(`/api/users/${currentUser.id}/vault`, {
            method: 'POST',
            body: JSON.stringify({ cart, wishlist })
          });
        } catch (e) {}
      };
      persistVault();
    }
  }, [cart, wishlist, currentUser?.id]);

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

  const addOrder = async (order: Order) => {
    setOrders(prev => [order, ...prev]);
    try {
      await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(order)
      });
    } catch (e) {}
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    } catch (e) {}
  };

  const addSubmission = async (type: 'contact' | 'newsletter', data: any) => {
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
    try {
      await fetch('/api/submissions', {
        method: 'POST',
        body: JSON.stringify(newSub)
      });
    } catch (e) {}
  };

  const loginUser = (email: string, pass: string): boolean => {
    // In a real Mongoose setup, this would be: 
    // const res = await fetch('/api/auth/login', { ... });
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
    
    // API Persistence
    fetch('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(newUser)
    }).catch(() => {});
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }
    fetch(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }).catch(() => {});
  };

  const logoutUser = () => setCurrentUser(null);
  
  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) setCurrentUser(null);
    fetch(`/api/users/${id}`, { method: 'DELETE' }).catch(() => {});
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
    fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(newReview)
    }).catch(() => {});
  };

  const sendMockEmail = (to: string, subject: string, body: string) => {
    console.log(`[MONGODB SYNC] Notification sent to ${to}`);
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
