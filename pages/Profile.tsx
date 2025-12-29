
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Package, CheckCircle, Loader2, Save, ShoppingBag, Clock } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const Profile: React.FC = () => {
  const { currentUser, orders, updateUser, t } = useApp();
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: currentUser?.password || ''
  });

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const customerOrders = orders.filter(o => o.customerEmail === currentUser.email);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMsg('');

    setTimeout(() => {
      updateUser(currentUser.id, formData);
      setIsUpdating(false);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Profile Settings */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-violet-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-violet-600/20">
                <User size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 leading-tight">My Profile</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Manage your info</p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('fullName')}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required 
                    type="text" 
                    className="w-full pl-12 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 text-sm font-medium" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('email')}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required 
                    type="email" 
                    className="w-full pl-12 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 text-sm font-medium" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('password')}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required 
                    type="password" 
                    className="w-full pl-12 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/10 text-sm font-mono" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {successMsg && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold bg-emerald-50 p-3 rounded-xl animate-in fade-in">
                  <CheckCircle size={14} /> {successMsg}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isUpdating}
                className="w-full purple-gradient text-white py-4 rounded-2xl font-bold shadow-xl shadow-violet-600/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isUpdating ? 'Saving...' : 'Update Information'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 min-h-[500px]">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Clock size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">Order History</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Past purchases</p>
              </div>
            </div>

            {customerOrders.length > 0 ? (
              <div className="space-y-6">
                {customerOrders.map(order => (
                  <div key={order.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-violet-50 transition-colors">
                          <Package className="text-slate-400 group-hover:text-violet-600" size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {order.id}</p>
                          <p className="font-bold text-slate-900">৳{order.total}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 w-full md:w-auto justify-between">
                         <div className="text-right hidden md:block">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                            <p className="text-xs font-bold text-slate-700">{order.date}</p>
                         </div>
                         <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                           order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                           order.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                         }`}>
                           {order.status}
                         </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-2">
                       {order.items.slice(0, 3).map((item, idx) => (
                         <div key={idx} className="w-10 h-10 rounded-lg overflow-hidden border border-white shadow-sm">
                           <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                         </div>
                       ))}
                       {order.items.length > 3 && (
                         <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                           +{order.items.length - 3}
                         </div>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                 <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={48} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">No orders found</h3>
                 <p className="text-slate-500 text-sm max-w-xs mb-8">You haven't made any purchases yet. Start shopping to fill your history!</p>
                 <Link to="/shop" className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-colors">
                    Browse Collection
                 </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
