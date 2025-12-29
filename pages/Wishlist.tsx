
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ProductCard } from './Home';

export const Wishlist: React.FC = () => {
  const { wishlist, t } = useApp();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-white p-16 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-300 rounded-3xl flex items-center justify-center mb-6">
            <Heart size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-4">{t('emptyWishlist')}</h2>
          <p className="text-slate-500 mb-8 max-w-sm leading-relaxed">{t('emptyWishlistText')}</p>
          <Link to="/shop" className="bg-violet-600 text-white px-8 py-3 rounded-full font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20">
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
      
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">{t('wishlist')}</h1>
        <p className="text-slate-500">{wishlist.length} items saved for later</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
