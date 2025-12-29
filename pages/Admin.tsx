
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { 
  LayoutDashboard, ShoppingBag, Settings, Edit, Trash2, Plus, 
  CheckCircle, Package, Lock, LogOut, Eye, EyeOff, Users, 
  UserPlus, ExternalLink, X, Image as ImageIcon, Sparkles, Hash,
  Mail, Key, ShieldAlert, Loader2, BookOpen, FileText, Tags, Wallet, Menu,
  Video, MessageSquare
} from 'lucide-react';
import { Product, BlogPost, Category, User, Order, FormSubmission } from '../types';
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
    orders, setOrders,
    submissions, setSubmissions,
    settings, setSettings, 
    blogPosts, setBlogPosts,
    users, currentUser, login, logout, register, deleteUser, sendMockEmail
  } = useApp();

  // Recovery State
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  // Modals State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    name: '', price: 0, description: '', category: '', images: ['', '', '', ''], videoUrl: '', stock: 10, isFeatured: false, isNewArrival: true
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({ name: '', image: '', slug: '' });

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogFormData, setBlogFormData] = useState<Partial<BlogPost>>({ title: '', content: '', images: ['', '', '', ''] });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({ name: '', email: '', password: '', role: 'moderator' as const });

  useEffect(() => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator')) {
      setIsAuthorized(true);
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

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, role: 'any' },
    { id: 'products', label: 'Products', icon: ShoppingBag, role: 'any' },
    { id: 'categories', label: 'Categories', icon: Tags, role: 'admin' },
    { id: 'orders', label: 'Orders', icon: Package, role: 'any' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, role: 'any' },
    { id: 'blog', label: 'Blog Posts', icon: BookOpen, role: 'any' },
    { id: 'users', label: 'User Management', icon: Users, role: 'admin' },
    { id: 'settings', label: 'Store Settings', icon: Settings, role: 'admin' },
  ].filter(item => item.role === 'any' || (item.role === 'admin' && currentUser?.role === 'admin'));

  // Handlers for Products, Categories, Blog, Users...
  const openAddProduct = () => {
    setEditingProductId(null);
    setProductFormData({ name: '', price: 0, description: '', category: categories[0]?.name || '', images: ['', '', '', ''], videoUrl: '', stock: 10, isFeatured: false, isNewArrival: true });
    setIsProductModalOpen(true);
  };

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
        <Link to="/" className="flex items-center gap-3">
          <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-cover brightness-200" />
          <span className="text-white font-bold text-xl tracking-tight">Admin Console</span>
        </Link>
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
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-400 p-6 hidden md:flex flex-col border-r border-slate-800 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
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
          <div className="mb-10">
             <h1 className="text-3xl font-bold capitalize tracking-tight">{activeTab}</h1>
             <p className="text-sm text-slate-500">Internal Data Management Panel</p>
          </div>

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
              <StatCard title="Local Revenue" value={`৳${orders.reduce((sum, o) => sum + o.total, 0)}`} color="bg-emerald-50 text-emerald-600" />
              <StatCard title="Orders Placed" value={orders.length} color="bg-blue-50 text-blue-600" />
              <StatCard title="User Database" value={users.length} color="bg-violet-50 text-violet-600" />
              <StatCard title="Messages" value={submissions.length} color="bg-amber-50 text-amber-600" />
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
               <div className="p-6 border-b border-slate-100 font-bold">Recent Customer Transactions</div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <tr>
                       <th className="px-6 py-4">Order ID</th>
                       <th className="px-6 py-4">Customer</th>
                       <th className="px-6 py-4">Total</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4">Method</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {orders.map(o => (
                       <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 text-xs font-mono text-violet-600">{o.id}</td>
                         <td className="px-6 py-4"><p className="font-bold text-sm">{o.customerName}</p><p className="text-[10px] text-slate-400">{o.customerPhone}</p></td>
                         <td className="px-6 py-4 font-bold">৳{o.total}</td>
                         <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${o.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                             {o.status}
                           </span>
                         </td>
                         <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{o.paymentMethod}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

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
                    <p className="text-slate-500 font-bold">No data in your local message vault.</p>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'users' && currentUser?.role === 'admin' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="font-bold text-xl">System Accounts</h3>
                   <button onClick={() => setIsUserModalOpen(true)} className="bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                     <UserPlus size={18} /> Add Operator
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

          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold">Inventory Vault</h3>
                <button onClick={openAddProduct} className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm">
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
                          <span className="font-bold">{p.name}</span>
                        </td>
                        <td className="px-6 py-5 font-bold">৳{p.salePrice || p.price}</td>
                        <td className="px-6 py-5 text-sm text-slate-500">{p.stock} units</td>
                        <td className="px-6 py-5 text-right flex justify-end gap-2">
                           <button className="p-2 text-slate-400 hover:text-violet-600 transition-colors"><Edit size={18} /></button>
                           <button onClick={() => setProducts(prev => prev.filter(item => item.id !== p.id))} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Tab (Placeholder logic) */}
          {activeTab === 'settings' && currentUser?.role === 'admin' && (
             <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                   <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-800">
                     <Sparkles className="text-violet-600" size={24} /> Branding & System Identity
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div>
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Internal Store Name</label>
                         <input className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 text-sm" value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} />
                      </div>
                      <div>
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Root Admin Alias</label>
                         <input className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 text-sm" placeholder="Owner" />
                      </div>
                   </div>
                   <button onClick={() => alert('Changes committed to database.')} className="w-full purple-gradient text-white py-4 rounded-2xl font-bold shadow-lg hover:opacity-90">
                     Synchronize Database Settings
                   </button>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* Shared Modals */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 text-slate-900">
              <h3 className="text-xl font-bold">{editingProductId ? 'Edit Record' : 'Create New Record'}</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-8 space-y-6 overflow-y-auto text-slate-700">
               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Name</label>
                    <input required className="w-full p-3 bg-slate-50 rounded-xl" value={productFormData.name} onChange={e => setProductFormData({...productFormData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Base Price (৳)</label>
                    <input required type="number" className="w-full p-3 bg-slate-50 rounded-xl" value={productFormData.price} onChange={e => setProductFormData({...productFormData, price: Number(e.target.value)})} />
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Local Image Storage (URLs)</label>
                  <input required className="w-full p-3 bg-slate-50 rounded-xl" placeholder="https://..." value={productFormData.images?.[0]} onChange={e => {
                    const imgs = [...(productFormData.images || [])];
                    imgs[0] = e.target.value;
                    setProductFormData({...productFormData, images: imgs});
                  }} />
               </div>
               <button type="submit" className="w-full py-4 bg-violet-600 text-white rounded-2xl font-bold shadow-lg">Commit to Vault</button>
            </form>
          </div>
        </div>
      )}

      {isUserModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsUserModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8">
             <h3 className="text-xl font-bold mb-6">Create System User</h3>
             <form onSubmit={(e) => {
               e.preventDefault();
               register(userFormData.name, userFormData.email, userFormData.password, userFormData.role);
               setIsUserModalOpen(false);
             }} className="space-y-4">
                <input required className="w-full p-3 bg-slate-50 rounded-xl text-sm" placeholder="Full Name" value={userFormData.name} onChange={e => setUserFormData({...userFormData, name: e.target.value})} />
                <input required type="email" className="w-full p-3 bg-slate-50 rounded-xl text-sm" placeholder="Email Address" value={userFormData.email} onChange={e => setUserFormData({...userFormData, email: e.target.value})} />
                <input required type="password" className="w-full p-3 bg-slate-50 rounded-xl text-sm" placeholder="Initial Password" value={userFormData.password} onChange={e => setUserFormData({...userFormData, password: e.target.value})} />
                <select className="w-full p-3 bg-slate-50 rounded-xl text-sm" value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value as any})}>
                   <option value="moderator">Moderator</option>
                   <option value="admin">Administrator</option>
                </select>
                <button type="submit" className="w-full py-4 bg-violet-600 text-white rounded-2xl font-bold shadow-lg mt-4">Generate Account</button>
             </form>
          </div>
        </div>
      )}
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
