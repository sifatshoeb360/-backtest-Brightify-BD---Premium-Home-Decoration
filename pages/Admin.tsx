
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
/* Added Phone and MapPin to the lucide-react imports */
import { 
  LayoutDashboard, ShoppingBag, Settings, Edit, Trash2, Plus, 
  CheckCircle, Package, Lock, LogOut, Eye, EyeOff, Users, 
  UserPlus, ExternalLink, X, Image as ImageIcon, Sparkles, Hash,
  Mail, Key, ShieldAlert, Loader2, BookOpen, FileText, Tags, Wallet, Menu,
  Video, MessageSquare, ChevronDown, Printer, Phone, MapPin
} from 'lucide-react';
import { Product, BlogPost, Category, User, Order, FormSubmission, OrderStatus } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'users' | 'messages' | 'blog' | 'settings'>('dashboard');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { 
    products, setProducts, 
    categories, setCategories, 
    orders, updateOrderStatus,
    submissions, setSubmissions,
    settings, setSettings, 
    blogPosts, setBlogPosts,
    users, currentUser, login, logout, register, updateUser, deleteUser, sendMockEmail
  } = useApp();

  // Account Security state
  const [adminEmail, setAdminEmail] = useState(currentUser?.email || '');
  const [adminPassword, setAdminPassword] = useState(currentUser?.password || '');
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  // Recovery State
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  // Modals State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    name: '', price: 0, salePrice: undefined, description: '', category: '', images: ['', '', '', ''], videoUrl: '', stock: 10, isFeatured: false, isNewArrival: true
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({ name: '', image: '', slug: '' });

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogFormData, setBlogFormData] = useState<Partial<BlogPost>>({ title: '', content: '', images: ['', '', '', ''], excerpt: '' });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({ name: '', email: '', password: '', role: 'moderator' as const });

  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator')) {
      setIsAuthorized(true);
      setAdminEmail(currentUser.email);
      setAdminPassword(currentUser.password || '');
    } else {
      setIsAuthorized(false);
    }
  }, [currentUser]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(loginEmail, loginPassword);
    if (!success) {
      setError('Invalid email or password.');
    } else {
      setError('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateAdminAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsUpdatingAccount(true);
    setTimeout(() => {
      updateUser(currentUser.id, { email: adminEmail, password: adminPassword });
      setIsUpdatingAccount(false);
      alert('Admin account credentials updated successfully.');
    }, 800);
  };

  // Role Filtering for Tabs
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, role: 'any' },
    { id: 'products', label: 'Products', icon: ShoppingBag, role: 'any' },
    { id: 'categories', label: 'Categories', icon: Tags, role: 'any' },
    { id: 'orders', label: 'Orders', icon: Package, role: 'any' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, role: 'any' },
    { id: 'blog', label: 'Blog Posts', icon: BookOpen, role: 'any' },
    { id: 'users', label: 'Staff Management', icon: Users, role: 'admin' },
    { id: 'settings', label: 'Store Settings', icon: Settings, role: 'admin' },
  ].filter(item => item.role === 'any' || (item.role === 'admin' && currentUser?.role === 'admin'));

  // --- CMS Handlers ---

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = productFormData.name?.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '') || Date.now().toString();
    const finalImages = (productFormData.images || []).filter(img => img && img.trim() !== '');
    if (editingProductId) {
      setProducts(prev => prev.map(p => p.id === editingProductId ? { ...p, ...productFormData, slug, images: finalImages } as Product : p));
    } else {
      setProducts(prev => [{ ...productFormData as Product, id: Date.now().toString(), slug, images: finalImages }, ...prev]);
    }
    setIsProductModalOpen(false);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = categoryFormData.name?.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '') || Date.now().toString();
    if (editingCategoryId) {
      setCategories(prev => prev.map(c => c.id === editingCategoryId ? { ...c, ...categoryFormData, slug } as Category : c));
    } else {
      setCategories(prev => [...prev, { ...categoryFormData as Category, id: Date.now().toString(), slug }]);
    }
    setIsCategoryModalOpen(false);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = blogFormData.title?.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '') || Date.now().toString();
    const finalImages = (blogFormData.images || []).filter(img => img && img.trim() !== '');
    if (editingBlogId) {
      setBlogPosts(prev => prev.map(b => b.id === editingBlogId ? { ...b, ...blogFormData, slug, images: finalImages } as BlogPost : b));
    } else {
      const newPost: BlogPost = { 
        ...blogFormData as BlogPost, 
        id: Date.now().toString(), 
        slug, 
        images: finalImages, 
        date: new Date().toLocaleDateString(),
        author: currentUser?.name || 'Admin',
        excerpt: blogFormData.content?.slice(0, 100) + '...'
      };
      setBlogPosts(prev => [newPost, ...prev]);
    }
    setIsBlogModalOpen(false);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecovering(true);
    setTimeout(() => {
      sendMockEmail(recoveryEmail, "Password Reset", "Click here to reset your password.");
      setRecoverySent(true);
      setIsRecovering(false);
    }, 1500);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6 shadow-lg overflow-hidden border border-slate-100">
               <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Portal</h1>
            <p className="text-slate-500">{isRecoveryMode ? 'Account Recovery' : 'Secure Authorization'}</p>
          </div>

          {!isRecoveryMode ? (
            <form onSubmit={handleLogin} className="space-y-6 text-slate-700">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Admin Email</label>
                  <input
                    required type="email"
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20"
                    placeholder="admin@brightify.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Password</label>
                  <div className="relative">
                    <input
                      required type={showPassword ? "text" : "password"}
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-rose-500 text-xs font-medium">{error}</p>}
                <div className="text-right">
                  <button type="button" onClick={() => setIsRecoveryMode(true)} className="text-xs font-bold text-violet-600 hover:underline">Forgot Password?</button>
                </div>
              </div>
              <button type="submit" className="w-full purple-gradient text-white py-4 rounded-2xl font-bold shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <Lock size={18} /> Access Dashboard
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              {recoverySent ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle size={32} /></div>
                  <h3 className="text-xl font-bold">Email Sent!</h3>
                  <p className="text-sm text-slate-500">Check your inbox for reset instructions.</p>
                  <button type="button" onClick={() => { setIsRecoveryMode(false); setRecoverySent(false); }} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Back to Login</button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Confirm Your Email</label>
                    <input required type="email" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20" placeholder="your-admin@email.com" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} />
                  </div>
                  <button type="submit" disabled={isRecovering} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 disabled:opacity-50">
                    {isRecovering ? <Loader2 size={18} className="animate-spin" /> : <ShieldAlert size={18} />}
                    {isRecovering ? 'Processing...' : 'Send Recovery Link'}
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-10">
        <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-3 text-left">
          <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-cover brightness-200" />
          <span className="text-white font-bold text-xl tracking-tight">Admin Console</span>
        </button>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white p-2">
          <X size={24} />
        </button>
      </div>
      <nav className="space-y-2 flex-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
        {/* Go to Store button in Sidebar using internal Link */}
        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-white mt-4 border border-slate-800 border-dashed"
        >
          <ExternalLink size={20} />
          <span className="font-medium text-slate-300">Go to Store</span>
        </Link>
      </nav>
      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="px-4 py-2 mb-4 bg-slate-800/50 rounded-xl">
           <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Operator</p>
           <p className="text-xs font-bold text-white capitalize">{currentUser?.name} ({currentUser?.role})</p>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-bold">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 p-6 hidden md:flex flex-col border-r border-slate-800 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] md:hidden" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-400 p-6 flex flex-col z-[90] md:hidden shadow-2xl">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-auto">
        <header className="md:hidden bg-white border-b border-slate-100 p-4 sticky top-0 z-[70] flex justify-between items-center shadow-sm">
          <span className="text-slate-900 font-bold tracking-tight">Brightify Admin</span>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl">
            <Menu size={24} />
          </button>
        </header>

        <div className="p-4 md:p-8">
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <h1 className="text-3xl font-bold capitalize tracking-tight">{activeTab}</h1>
                <p className="text-sm text-slate-500">Internal Data Management Panel</p>
             </div>
             {/* Go to Store top-nav button internally */}
             <Link
                to="/"
                className="hidden md:flex items-center gap-2 bg-white text-slate-600 px-5 py-2.5 rounded-xl font-bold text-sm border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
             >
               <ExternalLink size={18} /> View Live Site
             </Link>
          </div>

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
              <StatCard title="Local Revenue" value={`৳${orders.reduce((sum, o) => sum + o.total, 0)}`} color="bg-emerald-50 text-emerald-600" />
              <StatCard title="Orders Placed" value={orders.length} color="bg-blue-50 text-blue-600" />
              <StatCard title="User Database" value={users.length} color="bg-violet-50 text-violet-600" />
              <StatCard title="Messages" value={submissions.length} color="bg-amber-50 text-amber-600" />
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
               <div className="p-6 border-b border-slate-100 font-bold flex justify-between items-center">
                 <span>Recent Customer Transactions</span>
                 <p className="text-xs text-slate-400 font-normal">Click view icon to see shipping details</p>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <tr>
                       <th className="px-6 py-4">Order ID</th>
                       <th className="px-6 py-4">Customer</th>
                       <th className="px-6 py-4">Total</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {orders.map(o => (
                       <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 text-xs font-mono text-violet-600">{o.id}</td>
                         <td className="px-6 py-4">
                           <p className="font-bold text-sm">{o.customerName}</p>
                           <p className="text-[10px] text-slate-400">{o.customerPhone}</p>
                         </td>
                         <td className="px-6 py-4 font-bold">৳{o.total}</td>
                         <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${o.status === 'pending' ? 'bg-amber-100 text-amber-700' : o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                             {o.status}
                           </span>
                         </td>
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <button 
                               onClick={() => setViewingOrder(o)}
                               className="p-2 text-violet-600 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
                               title="View Order Details"
                             >
                               <Eye size={18} />
                             </button>
                             <select 
                               className="bg-slate-50 border-none rounded-lg text-[10px] font-bold p-1 pr-6 cursor-pointer"
                               value={o.status}
                               onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                             >
                               <option value="pending">Pending</option>
                               <option value="processing">Processing</option>
                               <option value="shipped">Shipped</option>
                               <option value="delivered">Delivered</option>
                               <option value="cancelled">Cancelled</option>
                             </select>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold">Inventory Vault</h3>
                <button onClick={() => {
                  setEditingProductId(null);
                  setProductFormData({ name: '', price: 0, description: '', category: categories[0]?.name || '', images: ['', '', '', ''], videoUrl: '', stock: 10, isFeatured: false, isNewArrival: true });
                  setIsProductModalOpen(true);
                }} className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm">
                  <Plus size={18} /> Add Product
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5 flex items-center gap-4">
                          <img src={p.images[0]} className="w-12 h-12 rounded-xl object-cover" />
                          <span className="font-bold text-sm">{p.name}</span>
                        </td>
                        <td className="px-6 py-5 font-bold">৳{p.salePrice || p.price}</td>
                        <td className="px-6 py-5 text-sm text-slate-500">{p.stock} units</td>
                        <td className="px-6 py-5 text-right flex justify-end gap-2">
                           <button onClick={() => {
                             setEditingProductId(p.id);
                             setProductFormData({...p});
                             setIsProductModalOpen(true);
                           }} className="p-2 text-slate-400 hover:text-violet-600 transition-colors"><Edit size={18} /></button>
                           <button onClick={() => setProducts(prev => prev.filter(item => item.id !== p.id))} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORIES TAB - MODIFIED TO BE SMALLER */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold">Store Categories</h3>
                <button onClick={() => {
                  setEditingCategoryId(null);
                  setCategoryFormData({ name: '', image: '' });
                  setIsCategoryModalOpen(true);
                }} className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm">
                  <Plus size={18} /> New Category
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-6">
                 {categories.map(cat => (
                   <div key={cat.id} className="group relative aspect-square rounded-xl overflow-hidden shadow-sm border border-slate-100">
                      <img src={cat.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <button onClick={() => {
                           setEditingCategoryId(cat.id);
                           setCategoryFormData({...cat});
                           setIsCategoryModalOpen(true);
                         }} className="p-2 bg-white text-violet-600 rounded-lg hover:scale-110 transition-transform shadow-sm"><Edit size={16} /></button>
                         <button onClick={() => setCategories(prev => prev.filter(c => c.id !== cat.id))} className="p-2 bg-white text-rose-600 rounded-lg hover:scale-110 transition-transform shadow-sm"><Trash2 size={16} /></button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <span className="text-[10px] font-bold text-white truncate block">{cat.name}</span>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* BLOG TAB */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl">Article Engine</h3>
                <button onClick={() => {
                  setEditingBlogId(null);
                  setBlogFormData({ title: '', content: '', images: ['', '', '', ''], excerpt: '' });
                  setIsBlogModalOpen(true);
                }} className="bg-violet-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-violet-600/20 hover:bg-violet-700 transition-all">
                  <Plus size={18} /> Publish Story
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map(post => (
                  <div key={post.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm flex flex-col group">
                     <div className="aspect-video relative overflow-hidden bg-slate-100">
                        <img src={post.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                     </div>
                     <div className="p-6 flex-1 flex flex-col">
                        <h4 className="font-bold text-slate-900 mb-2 line-clamp-1">{post.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4">{post.excerpt}</p>
                        <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
                           <div className="flex gap-2">
                             <button onClick={() => {
                               setEditingBlogId(post.id);
                               const paddedImgs = [...post.images];
                               while(paddedImgs.length < 4) paddedImgs.push('');
                               setBlogFormData({...post, images: paddedImgs});
                               setIsBlogModalOpen(true);
                             }} className="p-2 text-slate-400 hover:text-violet-600"><Edit size={16} /></button>
                             <button onClick={() => setBlogPosts(prev => prev.filter(b => b.id !== post.id))} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAFF MANAGEMENT (ADMIN ONLY) */}
          {activeTab === 'users' && currentUser?.role === 'admin' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="font-bold text-xl">System Accounts</h3>
                   <button onClick={() => setIsUserModalOpen(true)} className="bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                     <UserPlus size={18} /> Add Moderator
                   </button>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                   <div className="overflow-x-auto">
                     <table className="w-full text-left">
                       <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <tr>
                           <th className="px-6 py-4">Name</th>
                           <th className="px-6 py-4">Email</th>
                           <th className="px-6 py-4">Role</th>
                           <th className="px-6 py-4">Joined</th>
                           <th className="px-6 py-4 text-right">Action</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         {users.map(u => (
                           <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                             <td className="px-6 py-4 font-bold text-sm">{u.name}</td>
                             <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                             <td className="px-6 py-4">
                               <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${u.role === 'admin' ? 'bg-violet-100 text-violet-700' : u.role === 'moderator' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                 {u.role}
                               </span>
                             </td>
                             <td className="px-6 py-4 text-xs text-slate-400">{u.createdAt}</td>
                             <td className="px-6 py-4 text-right">
                                {u.id !== currentUser.id && (
                                   <button onClick={() => deleteUser(u.id)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg"><Trash2 size={18} /></button>
                                )}
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>
             </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
               {submissions.length > 0 ? submissions.map(sub => (
                 <div key={sub.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                         <h4 className="font-bold text-lg">{sub.name}</h4>
                         <p className="text-xs text-slate-400">{sub.email} • {sub.date}</p>
                       </div>
                       <span className="text-[10px] font-bold uppercase bg-violet-50 text-violet-600 px-3 py-1 rounded-full">{sub.type}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{sub.message}</p>
                    <div className="mt-4 flex gap-2">
                       <button onClick={() => setSubmissions(prev => prev.filter(s => s.id !== sub.id))} className="text-xs font-bold text-rose-500 hover:underline">Delete Record</button>
                    </div>
                 </div>
               )) : (
                 <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <MessageSquare size={40} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold">Inbox is currently empty.</p>
                 </div>
               )}
            </div>
          )}

          {/* STORE SETTINGS (ADMIN ONLY) */}
          {activeTab === 'settings' && currentUser?.role === 'admin' && (
             <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
                {/* Account Security Section */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                   <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-800">
                     <Lock className="text-rose-500" size={24} /> Admin Account Security
                   </h3>
                   <form onSubmit={handleUpdateAdminAccount} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Super Admin Email</label>
                            <div className="relative">
                               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                               <input 
                                  required 
                                  type="email" 
                                  className="w-full pl-12 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 text-sm" 
                                  value={adminEmail} 
                                  onChange={e => setAdminEmail(e.target.value)} 
                               />
                            </div>
                         </div>
                         <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Super Admin Password</label>
                            <div className="relative">
                               <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                               <input 
                                  required 
                                  type="text" 
                                  className="w-full pl-12 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 text-sm font-mono" 
                                  value={adminPassword} 
                                  onChange={e => setAdminPassword(e.target.value)} 
                               />
                            </div>
                         </div>
                      </div>
                      <button 
                         type="submit" 
                         disabled={isUpdatingAccount}
                         className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                         {isUpdatingAccount ? <Loader2 size={18} className="animate-spin" /> : <ShieldAlert size={18} />}
                         Update Admin Account
                      </button>
                   </form>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                   <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-800">
                     <Sparkles className="text-violet-600" size={24} /> Branding & System Identity
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-4">
                         <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Store Identity (Logo URL)</label>
                            <input className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 text-xs font-mono" value={settings.logoUrl} onChange={e => setSettings({...settings, logoUrl: e.target.value})} />
                         </div>
                         <div className="h-24 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center">
                            <img src={settings.logoUrl} className="max-h-full" alt="logo preview" />
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Hero Showcase Image URL</label>
                            <input className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 text-xs font-mono" value={settings.heroImage} onChange={e => setSettings({...settings, heroImage: e.target.value})} />
                         </div>
                         <div className="h-24 p-4 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center">
                            <img src={settings.heroImage} className="w-full h-full object-cover rounded-lg" alt="hero preview" />
                         </div>
                      </div>
                   </div>
                   
                   <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-800 border-t border-slate-50 pt-8">
                     <Wallet className="text-violet-600" size={24} /> Payment Contact Numbers
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div>
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Bkash Personal Number</label>
                         <input className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 text-sm font-mono" value={settings.bkashNumber} onChange={e => setSettings({...settings, bkashNumber: e.target.value})} />
                      </div>
                      <div>
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Nagad Personal Number</label>
                         <input className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 text-sm font-mono" value={settings.nagadNumber} onChange={e => setSettings({...settings, nagadNumber: e.target.value})} />
                      </div>
                   </div>

                   <button onClick={() => alert('CMS Settings Synchronized.')} className="w-full purple-gradient text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-violet-600/20 hover:scale-[1.01] transition-all">
                     Save Global CMS Configurations
                   </button>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* --- MODALS (Replicated Design) --- */}

      {/* Order Detail View Modal */}
      <AnimatePresence>
        {viewingOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingOrder(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 z-10 text-slate-900">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center">
                     <Package size={20} />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold">Order Details</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {viewingOrder.id}</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                     onClick={() => window.print()}
                     className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                     title="Print Order"
                   >
                     <Printer size={20} />
                   </button>
                   <button onClick={() => setViewingOrder(null)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
                </div>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto text-slate-700 flex-1">
                {/* Shipping info Section */}
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Customer Information</h4>
                    <p className="font-bold text-lg text-slate-900">{viewingOrder.customerName}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                      <Mail size={14} className="text-violet-600" /> {viewingOrder.customerEmail}
                    </div>
                    <div className="flex items-center gap-2 text-lg font-bold text-slate-900 mt-2">
                      <Phone size={18} className="text-violet-600" /> {viewingOrder.customerPhone}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Shipping Address</h4>
                    <div className="flex items-start gap-2">
                       <MapPin size={18} className="text-rose-500 mt-1 flex-shrink-0" />
                       <p className="text-sm font-semibold text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                         {viewingOrder.shippingAddress}
                       </p>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div>
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Ordered Items</h4>
                   <div className="space-y-4">
                     {viewingOrder.items.map((item, idx) => (
                       <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100">
                         <img src={item.images[0]} className="w-14 h-14 rounded-xl object-cover" />
                         <div className="flex-1">
                            <h5 className="font-bold text-sm text-slate-900">{item.name}</h5>
                            <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                         </div>
                         <div className="text-right">
                            <p className="font-bold text-sm">৳{(item.salePrice || item.price) * item.quantity}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Order Summary */}
                <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-6">
                   <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Payment Summary</h4>
                      <p className="text-sm font-bold flex items-center gap-2">
                        Method: <span className="text-violet-600 px-2 py-1 bg-violet-50 rounded-lg">{viewingOrder.paymentMethod}</span>
                      </p>
                      {viewingOrder.paymentDetails && (
                        <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg font-mono">
                          {viewingOrder.paymentDetails}
                        </p>
                      )}
                   </div>
                   <div className="bg-slate-900 text-white p-6 rounded-[2rem] flex flex-col items-center justify-center min-w-[200px]">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Grand Total</p>
                      <p className="text-3xl font-black">৳{viewingOrder.total}</p>
                   </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                       updateOrderStatus(viewingOrder.id, 'shipped');
                       setViewingOrder({...viewingOrder, status: 'shipped'});
                    }}
                    disabled={viewingOrder.status === 'shipped' || viewingOrder.status === 'delivered'}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
                  >
                    Mark as Shipped
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 text-slate-900">
                <h3 className="text-xl font-bold">{editingProductId ? 'Update Record' : 'Add to Inventory'}</h3>
                <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
              </div>
              <form onSubmit={handleSaveProduct} className="p-8 space-y-6 overflow-y-auto text-slate-700 flex-1">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Title</label>
                    <input required className="w-full p-3 bg-slate-50 rounded-xl" value={productFormData.name} onChange={e => setProductFormData({...productFormData, name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                    <select required className="w-full p-3 bg-slate-50 rounded-xl text-sm" value={productFormData.category} onChange={e => setProductFormData({...productFormData, category: e.target.value})}>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                   <textarea rows={3} className="w-full p-3 bg-slate-50 rounded-xl resize-none" value={productFormData.description} onChange={e => setProductFormData({...productFormData, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</label>
                      <input type="number" className="w-full p-3 bg-slate-50 rounded-xl font-mono" value={productFormData.price} onChange={e => setProductFormData({...productFormData, price: Number(e.target.value)})} />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sale Price</label>
                      <input type="number" className="w-full p-3 bg-slate-50 rounded-xl font-mono" value={productFormData.salePrice || ''} onChange={e => setProductFormData({...productFormData, salePrice: e.target.value ? Number(e.target.value) : undefined})} />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock</label>
                      <input type="number" className="w-full p-3 bg-slate-50 rounded-xl font-mono" value={productFormData.stock} onChange={e => setProductFormData({...productFormData, stock: Number(e.target.value)})} />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Video URL (Video replaces Feature Photo)</label>
                   <input className="w-full p-3 bg-slate-50 rounded-xl font-mono" value={productFormData.videoUrl} onChange={e => setProductFormData({...productFormData, videoUrl: e.target.value})} placeholder="https://..." />
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gallery Images</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[0,1,2,3].map(i => (
                      <input key={i} className="p-3 bg-slate-50 rounded-xl text-xs font-mono" placeholder={`Image URL ${i+1}`} value={productFormData.images?.[i] || ''} onChange={e => {
                        const imgs = [...(productFormData.images || [])];
                        imgs[i] = e.target.value;
                        setProductFormData({...productFormData, images: imgs});
                      }} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-6 pt-4">
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={productFormData.isFeatured} onChange={e => setProductFormData({...productFormData, isFeatured: e.target.checked})} />
                      <span className="text-xs font-bold text-slate-600">Best Seller</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={productFormData.isNewArrival} onChange={e => setProductFormData({...productFormData, isNewArrival: e.target.checked})} />
                      <span className="text-xs font-bold text-slate-600">New Arrival</span>
                   </label>
                </div>
                <button type="submit" className="w-full py-5 purple-gradient text-white rounded-2xl font-bold shadow-xl mt-4">Commit to Inventory</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8">
              <h3 className="text-xl font-bold mb-6">{editingCategoryId ? 'Edit Category' : 'New Category'}</h3>
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <input required className="w-full p-4 bg-slate-50 rounded-2xl" placeholder="Category Name" value={categoryFormData.name} onChange={e => setCategoryFormData({...categoryFormData, name: e.target.value})} />
                <input required className="w-full p-4 bg-slate-50 rounded-2xl font-mono text-xs" placeholder="Image URL" value={categoryFormData.image} onChange={e => setCategoryFormData({...categoryFormData, image: e.target.value})} />
                <button type="submit" className="w-full py-4 bg-violet-600 text-white rounded-2xl font-bold shadow-lg mt-4">Save Category</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Blog Modal */}
      <AnimatePresence>
        {isBlogModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsBlogModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 text-slate-900">
                <h3 className="text-xl font-bold">{editingBlogId ? 'Edit Story' : 'Publish Story'}</h3>
                <button onClick={() => setIsBlogModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
              </div>
              <form onSubmit={handleSaveBlog} className="p-8 space-y-6 overflow-y-auto text-slate-700 flex-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Headline</label>
                  <input required className="w-full p-4 bg-slate-50 rounded-2xl" value={blogFormData.title} onChange={e => setBlogFormData({...blogFormData, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Story Content</label>
                  <textarea rows={8} required className="w-full p-4 bg-slate-50 rounded-2xl resize-none" value={blogFormData.content} onChange={e => setBlogFormData({...blogFormData, content: e.target.value})} />
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Media (up to 4 photos)</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[0,1,2,3].map(i => (
                      <input key={i} className="p-3 bg-slate-50 rounded-xl text-xs font-mono" placeholder={`Photo URL ${i+1}`} value={blogFormData.images?.[i] || ''} onChange={e => {
                        const imgs = [...(blogFormData.images || [])];
                        imgs[i] = e.target.value;
                        setBlogFormData({...blogFormData, images: imgs});
                      }} />
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-violet-600 text-white rounded-2xl font-bold shadow-xl mt-4">Go Live with Story</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Staff Management Modal (Admin Only) */}
      <AnimatePresence>
        {isUserModalOpen && currentUser?.role === 'admin' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsUserModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8">
               <h3 className="text-xl font-bold mb-6">Create System User</h3>
               <form onSubmit={(e) => {
                 e.preventDefault();
                 register(userFormData.name, userFormData.email, userFormData.password, userFormData.role);
                 setIsUserModalOpen(false);
               }} className="space-y-4">
                  <input required className="w-full p-3 bg-slate-50 rounded-xl text-sm" placeholder="Full Name" value={userFormData.name} onChange={e => setUserFormData({...userFormData, name: e.target.value})} />
                  <input required type="email" className="w-full p-3 bg-slate-50 rounded-xl text-sm" placeholder="Email Address" value={userFormData.email} onChange={e => setUserFormData({...userFormData, email: e.target.value})} />
                  <input required type="password" className="w-full p-3 bg-slate-50 rounded-xl text-sm" placeholder="Initial Password" value={userFormData.password} onChange={e => setUserFormData({...userFormData, password: e.target.value})} />
                  <select disabled className="w-full p-3 bg-slate-50 rounded-xl text-sm opacity-50" value={userFormData.role}>
                     <option value="moderator">Moderator</option>
                  </select>
                  <p className="text-[10px] text-slate-400 font-bold px-1 uppercase tracking-widest">Moderators have access to products, orders, and blog modules only.</p>
                  <button type="submit" className="w-full py-4 bg-violet-600 text-white rounded-2xl font-bold shadow-lg mt-4">Generate Access</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-b-4 border-b-violet-500/10">
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{title}</p>
    <p className={`text-2xl font-bold ${color.split(' ')[1]}`}>{value}</p>
    <div className={`mt-4 h-1 w-12 rounded-full ${color.split(' ')[0]}`} />
  </div>
);
