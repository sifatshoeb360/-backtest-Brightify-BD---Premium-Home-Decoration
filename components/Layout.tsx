
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, User, Facebook, Instagram, Phone, Mail, MapPin, LogOut, ShieldCheck } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart, wishlist, settings, language, setLanguage, t, currentUser, logout } = useApp();
  const location = useLocation();

  // Track scroll position to hide/show the promo banner and toggle nav transparency
  useEffect(() => {
    const handleScroll = () => {
      // Trigger hiding/transparency when scrolled more than 30px
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('shop'), path: '/shop' },
    { name: t('blog'), path: '/blog' },
    { name: t('about'), path: '/about' },
    { name: t('contact'), path: '/contact' },
  ];

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Promotional Banner: Collapses smoothly when scrolled */}
      <AnimatePresence initial={false}>
        {!isScrolled && settings.showPromoBanner && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="bg-violet-600 text-white text-xs py-2.5 text-center font-bold overflow-hidden relative shadow-md z-[60]"
          >
            <div className="max-w-7xl mx-auto px-4">
              {settings.promoText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar: Transitions to transparent with backdrop blur after scroll */}
      <nav 
        className={`transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-white/40 backdrop-blur-xl border-white/20 shadow-lg shadow-slate-900/5' 
            : 'bg-white border-slate-100 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-violet-50 overflow-hidden shadow-sm group-hover:scale-105 transition-transform border border-violet-100 p-1">
                <img 
                  src={settings.logoUrl} 
                  alt={settings.siteName} 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">{settings.siteName}</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold transition-all relative py-1 ${
                    location.pathname === link.path 
                      ? 'text-violet-600' 
                      : 'text-slate-600 hover:text-violet-600'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-violet-600 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Icons & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <div className={`hidden sm:flex items-center gap-1 p-1 rounded-full border transition-colors ${isScrolled ? 'bg-white/50 border-white/40' : 'bg-slate-50 border-slate-100'}`}>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-[10px] font-black rounded-full transition-all ${language === 'en' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage('bn')}
                  className={`px-3 py-1 text-[10px] font-black rounded-full transition-all ${language === 'bn' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  BN
                </button>
              </div>

              {/* User / Login / Profile */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile" className="p-2 text-slate-500 hover:text-violet-600 transition-colors group flex items-center gap-2">
                    <User size={20} />
                    <span className="hidden lg:block text-xs font-bold text-slate-700">{currentUser.name.split(' ')[0]}</span>
                  </Link>
                  <button onClick={() => logout()} className="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="p-2 text-slate-500 hover:text-violet-600 transition-colors">
                  <User size={20} />
                </Link>
              )}
              
              {/* Wishlist Icon */}
              <Link to="/wishlist" className="p-2 text-slate-500 hover:text-rose-500 transition-colors relative">
                <Heart size={20} className={wishlistCount > 0 ? "fill-rose-500 text-rose-500" : ""} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link to="/cart" className="p-2 text-slate-500 hover:text-violet-600 transition-colors relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 text-slate-500" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white/90 backdrop-blur-xl border-t border-slate-100 overflow-hidden"
            >
              <div className="p-6 space-y-6">
                <div className="flex flex-col space-y-4">
                  {navLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`text-lg font-bold ${location.pathname === link.path ? 'text-violet-600' : 'text-slate-800'}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  {currentUser?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-lg font-bold text-slate-400 flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <ShieldCheck size={20} /> {t('adminPortal')}
                    </Link>
                  )}
                  {currentUser && (
                    <Link
                      to="/profile"
                      className="text-lg font-bold text-slate-600 flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={20} /> My Profile
                    </Link>
                  )}
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                   <button 
                     onClick={() => { setLanguage('en'); setIsOpen(false); }}
                     className={`flex-1 py-3 rounded-2xl font-bold text-sm ${language === 'en' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                   >
                     English
                   </button>
                   <button 
                     onClick={() => { setLanguage('bn'); setIsOpen(false); }}
                     className={`flex-1 py-3 rounded-2xl font-bold text-sm ${language === 'bn' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                   >
                     বাংলা
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export const Footer: React.FC = () => {
  const { settings, t } = useApp();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 p-1.5 backdrop-blur-md">
                <img 
                  src={settings.logoUrl} 
                  alt={settings.siteName} 
                  className="w-full h-full object-contain brightness-110"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">{settings.siteName}</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {t('aboutText')}
            </p>
            <div className="flex gap-4">
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-xl hover:bg-violet-600 hover:text-white transition-all text-slate-400">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2.5 bg-white/5 rounded-xl hover:bg-violet-600 hover:text-white transition-all text-slate-400">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-[0.2em]">{t('shop')}</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/shop" className="hover:text-violet-400 transition-colors">{t('allProducts')}</Link></li>
              <li><Link to="/shop?filter=newest" className="hover:text-violet-400 transition-colors">{t('newArrivals')}</Link></li>
              <li><Link to="/shop?filter=featured" className="hover:text-violet-400 transition-colors">{t('bestSellers')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-[0.2em]">{t('about')}</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/about" className="hover:text-violet-400 transition-colors">{t('ourStory')}</Link></li>
              <li><Link to="/blog" className="hover:text-violet-400 transition-colors">{t('blog')}</Link></li>
              <li><Link to="/contact" className="hover:text-violet-400 transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-[0.2em]">{t('contactInfo')}</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-violet-500 flex-shrink-0" />
                <span className="text-slate-400">{settings.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-violet-500 flex-shrink-0" />
                <span className="text-slate-400">{settings.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-violet-500 flex-shrink-0" />
                <span className="text-slate-400">{settings.contactEmail}</span>
              </div>
              <div className="pt-4 border-t border-white/5">
                <Link to="/admin" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold">
                   <ShieldCheck size={14} /> {t('adminPortal')}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          <p>© {year} {settings.siteName}. All rights reserved. Crafted with ✨ in Dhaka.</p>
        </div>
      </div>
    </footer>
  );
};
