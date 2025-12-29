
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle, Wallet, MapPin, Loader2, CreditCard } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Order } from '../types';
import { BANGLADESH_DISTRICTS } from '../constants';

const BkashLogo = () => (
  <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="12" fill="#E2136E"/>
    <path d="M75.6 24.4H24.4V75.6H75.6V24.4Z" fill="#E2136E"/>
    <path d="M43.7 63.3C44.8 63.3 45.8 62.9 46.5 62.1C47.3 61.4 47.7 60.4 47.7 59.3C47.7 58.2 47.3 57.2 46.5 56.4C45.8 55.6 44.8 55.2 43.7 55.2H35.4V63.3H43.7ZM43.7 48.3C44.7 48.3 45.6 47.9 46.3 47.2C47 46.5 47.4 45.6 47.4 44.6C47.4 43.6 47 42.7 46.3 42C45.6 41.3 44.7 40.9 43.7 40.9H35.4V48.3H43.7ZM64.6 63.3V40.9H56.3V63.3H64.6Z" fill="white"/>
  </svg>
);

const NagadLogo = () => (
  <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="12" fill="#F7941D"/>
    <path d="M50 20L80 50L50 80L20 50L50 20Z" fill="white"/>
    <text x="50" y="58" font-family="Arial" font-size="28" font-weight="bold" text-anchor="middle" fill="#F7941D">N</text>
  </svg>
);

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, settings, clearCart, addOrder, t, language, currentUser } = useApp();
  const [isOrdered, setIsOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState<'inside' | 'outside'>('inside');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: '',
    email: currentUser?.email || '',
    district: 'Dhaka',
    address: '',
    paymentNumber: '',
    trxId: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
  const shipping = deliveryLocation === 'inside' ? 70 : 120;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    // Simulate database delay
    setTimeout(() => {
      const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const newOrder: Order = {
        id: orderId,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: [...cart],
        total: total,
        status: 'pending',
        date: new Date().toLocaleDateString(),
        shippingAddress: `${formData.address}, ${formData.district}`,
        paymentMethod: paymentMethod.toUpperCase(),
        paymentDetails: paymentMethod === 'cod' ? 'Cash on Delivery' : `No: ${formData.paymentNumber}, TrxID: ${formData.trxId}`
      };

      addOrder(newOrder);
      setIsOrdered(true);
      clearCart();
      setIsSubmitting(false);
    }, 1000);
  };

  if (isOrdered) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">{t('orderPlaced')}</h2>
          <p className="text-slate-500 mb-8">{t('orderPlacedText')}</p>
          <div className="bg-slate-50 p-6 rounded-2xl w-full mb-8 text-left space-y-2 border border-slate-100">
            <p className="text-sm font-bold text-slate-800">{t('paymentMethod')}: <span className="text-violet-600 font-bold uppercase">{paymentMethod === 'cod' ? t('cod') : t(paymentMethod as any)}</span></p>
            {paymentMethod !== 'cod' && (
              <p className="text-sm text-slate-600">Trx ID: <span className="font-mono font-bold">{formData.trxId}</span></p>
            )}
            <p className="text-xs text-slate-500 italic mt-2">
              {paymentMethod === 'cod' 
                ? 'Please keep the exact amount ready upon delivery.' 
                : t('verifyTransaction')}
            </p>
          </div>
          <Link to="/shop" className="bg-violet-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-violet-700 transition-all">
            {t('startShopping')}
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-white p-16 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <ShoppingBag size={64} className="text-slate-200 mb-6" />
          <h2 className="text-2xl font-bold mb-4">{t('emptyCart')}</h2>
          <p className="text-slate-500 mb-8 max-w-sm">{t('emptyCartText')}</p>
          <Link to="/shop" className="bg-violet-600 text-white px-8 py-3 rounded-full font-bold hover:bg-violet-700 transition-all">
            {t('startShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 mb-8 font-medium transition-colors">
        <ArrowLeft size={18} /> {t('backToShop')}
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold mb-8">{t('shoppingCart')}</h1>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 divide-y divide-slate-100">
              {cart.map(item => (
                <div key={item.id} className="py-6 flex gap-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{item.category}</p>
                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2 hover:bg-slate-200 text-slate-500 transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-slate-200 text-slate-500 transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-bold text-violet-600">৳{(item.salePrice || item.price) * item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-violet-50 p-6 rounded-3xl border border-violet-100">
            <h3 className="font-bold text-violet-900 mb-4 flex items-center gap-2">
              <MapPin size={20} /> {t('shippingInfo')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDeliveryLocation('inside')}
                className={`p-4 rounded-2xl border-2 transition-all text-left group ${deliveryLocation === 'inside' ? 'border-violet-600 bg-white shadow-md' : 'border-transparent bg-slate-100 hover:bg-slate-200'}`}
              >
                <p className="font-bold text-sm text-slate-900 group-hover:text-violet-600 transition-colors">{t('insideDhaka')}</p>
                <p className="text-xs text-slate-500">Charge: ৳70</p>
              </button>
              <button
                onClick={() => setDeliveryLocation('outside')}
                className={`p-4 rounded-2xl border-2 transition-all text-left group ${deliveryLocation === 'outside' ? 'border-violet-600 bg-white shadow-md' : 'border-transparent bg-slate-100 hover:bg-slate-200'}`}
              >
                <p className="font-bold text-sm text-slate-900 group-hover:text-violet-600 transition-colors">{t('outsideDhaka')}</p>
                <p className="text-xs text-slate-500">Charge: ৳120</p>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CreditCard size={20} className="text-violet-600" /> {t('orderDetails')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('fullName')}</label>
                  <input required type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 text-sm" placeholder={t('namePlaceholder')} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('phoneNumber')}</label>
                  <input required type="tel" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 text-sm font-mono" placeholder={t('phonePlaceholder')} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('district')}</label>
                  <div className="relative">
                    <select required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 text-sm appearance-none cursor-pointer" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})}>
                      <option value="" disabled>{t('districtPlaceholder')}</option>
                      {BANGLADESH_DISTRICTS.map(d => (
                        <option key={d.en} value={d.en}>
                          {language === 'bn' ? d.bn : d.en}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                       <Plus size={14} className="rotate-45" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('fullAddress')}</label>
                  <textarea required rows={2} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 text-sm resize-none" placeholder={t('addressPlaceholder')} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">{t('paymentMethod')}</label>
                <div className="grid grid-cols-1 gap-2">
                  <button type="button" onClick={() => setPaymentMethod('cod')} className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${paymentMethod === 'cod' ? 'border-violet-600 bg-violet-50 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}>
                    <Wallet size={20} className={paymentMethod === 'cod' ? 'text-violet-600' : 'text-slate-400'} />
                    <span className="text-sm font-bold">{t('cod')}</span>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('bkash')} className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${paymentMethod === 'bkash' ? 'border-[#e2136e] bg-[#fdf2f7] shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}>
                    <BkashLogo />
                    <span className="text-sm font-bold">Bkash</span>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('nagad')} className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${paymentMethod === 'nagad' ? 'border-[#f7941d] bg-[#fffbf5] shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}>
                    <NagadLogo />
                    <span className="text-sm font-bold">Nagad</span>
                  </button>
                </div>
              </div>

              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-2 mb-1">
                     <p className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                       {t('sendMoneyTo')}:
                     </p>
                     <span className="text-violet-600 font-bold text-sm font-mono">{paymentMethod === 'bkash' ? settings.bkashNumber : settings.nagadNumber}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('paymentMethod')} No.</label>
                      <input required type="tel" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-violet-500/10" placeholder={t('paymentNumberPlaceholder')} value={formData.paymentNumber} onChange={e => setFormData({...formData, paymentNumber: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('trxPlaceholder')}</label>
                      <input required type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-violet-500/10" placeholder={t('trxPlaceholder')} value={formData.trxId} onChange={e => setFormData({...formData, trxId: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 space-y-3 px-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">{t('subtotal')}</span>
                  <span className="font-bold text-slate-800">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">{t('shipping')}</span>
                  <span className="font-bold text-slate-800">৳{shipping}</span>
                </div>
                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span className="font-bold text-lg text-slate-900">{t('orderTotal')}</span>
                  <span className="font-bold text-2xl text-violet-600">৳{total}</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-violet-600 text-white py-5 rounded-2xl font-bold shadow-xl shadow-violet-600/30 hover:bg-violet-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : <><CheckCircle size={20} /> {t('confirmOrder')}</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
