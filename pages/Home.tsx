
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Heart, ShoppingBag, Zap, Sparkles } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Home: React.FC = () => {
  const { products, categories, testimonials, settings, t } = useApp();
  
  // Filtering products for different sections
  const featured = products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);

  // --- Hero Slider Data & Logic ---
  const heroSlides = [
    {
      image: settings.heroImage,
      title: t('heroTitle'),
      subtitle: t('heroSubtitle'),
      badge: t('heroBadge')
    },
    {
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop",
      title: "Minimalist Aesthetic",
      subtitle: "Clean lines and soft textures for a calming home environment. Elevate your lifestyle with our modern collection.",
      badge: "Modern Living"
    },
    {
      image: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=2000&auto=format&fit=crop",
      title: "Exquisite Craftsmanship",
      subtitle: "Every piece is hand-selected for quality and timeless design. Discover decoration that tells a story.",
      badge: "Designer's Choice"
    },
    {
      image: "https://images.unsplash.com/photo-1615873968403-89e068628265?q=80&w=2000&auto=format&fit=crop",
      title: "Ambient Atmosphere",
      subtitle: "Transform your space with our signature lighting collection. Create the perfect mood for every occasion.",
      badge: "Premium Decor"
    }
  ];

  const [heroIndex, setHeroIndex] = useState(0);

  const nextHero = useCallback(() => {
    setHeroIndex((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  useEffect(() => {
    const timer = setInterval(nextHero, 7000);
    return () => clearInterval(timer);
  }, [nextHero]);

  // --- Infinite Testimonial Carousel Logic ---
  const totalItems = testimonials.length;
  const extendedItems = [
    testimonials[totalItems - 1],
    ...testimonials,
    testimonials[0]
  ];
  
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextSlide = useCallback(() => {
    if (!isTransitioning && currentIndex === extendedItems.length - 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, extendedItems.length, isTransitioning]);

  useEffect(() => {
    if (currentIndex === extendedItems.length - 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }, 500);
      return () => clearTimeout(timer);
    }
    if (currentIndex === 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(totalItems);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, extendedItems.length, totalItems]);

  useEffect(() => {
    autoPlayRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [nextSlide]);

  const activeDotIndex = ((currentIndex - 1 + totalItems) % totalItems);

  // One-way forward slide variants
  const slideVariants = {
    enter: {
      x: '100%',
      opacity: 0,
      filter: 'blur(10px)'
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring', stiffness: 100, damping: 20 },
        opacity: { duration: 0.8 },
        filter: { duration: 1 }
      }
    },
    exit: {
      zIndex: 0,
      x: '-100%',
      opacity: 0,
      filter: 'blur(10px)',
      transition: {
        x: { type: 'spring', stiffness: 100, damping: 20 },
        opacity: { duration: 0.8 }
      }
    }
  };

  return (
    <div className="space-y-24 pb-24">
      {/* 1. Hero Section: Sliding Infinite Forward Loop */}
      <section className="relative h-[85vh] overflow-hidden bg-slate-950">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={heroIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image */}
            <img
              src={heroSlides[heroIndex].image}
              alt={heroSlides[heroIndex].title}
              className="w-full h-full object-cover scale-105"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent" />
            
            {/* Dynamic Sliding Content Layer */}
            <div className="absolute inset-0 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-start text-white">
               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4, duration: 0.8 }}
                 className="max-w-2xl"
               >
                  <span className="inline-block px-4 py-1.5 bg-violet-600/30 backdrop-blur-md border border-violet-400/30 rounded-full text-violet-200 text-xs font-black tracking-widest uppercase mb-6">
                    {heroSlides[heroIndex].badge}
                  </span>
                  <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] drop-shadow-2xl">
                     {heroSlides[heroIndex].title}
                  </h1>
                  <p className="text-lg md:text-xl mb-10 text-slate-100/80 leading-relaxed drop-shadow-lg font-medium">
                    {heroSlides[heroIndex].subtitle}
                  </p>
               </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Static Content Layer (Buttons stay fixed) */}
        <div className="absolute inset-0 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-start z-20 pointer-events-none">
          <div className="pt-[22rem] md:pt-[24rem] flex flex-wrap gap-4 pointer-events-auto">
            <Link to="/shop" className="bg-violet-600 hover:bg-violet-700 px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-2xl shadow-violet-600/40 flex items-center gap-2 text-white text-sm md:text-base">
              {t('shopNow')} <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-10 py-4 rounded-full font-bold transition-all border border-white/20 text-white text-sm md:text-base">
              {t('ourStory')}
            </Link>
          </div>
        </div>

        {/* Hero Navigation Controls (Dots) */}
        <div className="absolute inset-x-0 bottom-12 flex justify-center gap-3 z-30">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${heroIndex === idx ? 'bg-white w-12 shadow-lg shadow-white/20' : 'bg-white/20 w-6 hover:bg-white/40'}`}
              aria-label={`Go to hero slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Categories Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-slate-900 tracking-tight">{t('categories')}</h2>
            <p className="text-slate-500">Find the perfect match for your style</p>
          </div>
          <Link to="/shop" className="text-violet-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            {t('viewAll')} <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
                <h3 className="text-white font-bold text-xl">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Section */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                <Star size={24} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t('bestSellers')}</h2>
                <p className="text-slate-500">Most loved pieces by our community</p>
              </div>
            </div>
            <Link to="/shop?filter=featured" className="hidden sm:flex items-center gap-2 text-amber-600 font-bold hover:translate-x-1 transition-transform">
              {t('viewAll')} <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t('newArrivals')}</h2>
                <p className="text-slate-500">Freshly added pieces for your collection</p>
              </div>
            </div>
            <Link to="/shop?filter=newest" className="hidden sm:flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform">
              {t('viewAll')} <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Client Reviews (Infinite Slider) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 relative">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 inline-block relative">
              {t('whatClientsSay')}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-violet-600 rounded-full" />
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden relative rounded-[2.5rem] bg-white">
              <motion.div 
                className="flex"
                animate={{ x: `-${currentIndex * 100}%` }}
                transition={isTransitioning ? { duration: 0.5, ease: [0.32, 0.72, 0, 1] } : { duration: 0 }}
                onAnimationComplete={() => setIsTransitioning(false)}
              >
                {extendedItems.map((testimonial, idx) => (
                  <div 
                    key={`${testimonial.id}-${idx}`}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="bg-white p-8 md:p-14 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/10 flex flex-col h-full min-h-[350px]">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="relative flex-shrink-0">
                          <div className="absolute -inset-1.5 rounded-full border-[3px] border-violet-600" />
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name} 
                            className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover p-1 relative z-10 bg-white shadow-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{testimonial.name}</h4>
                          <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">{testimonial.role}</p>
                        </div>
                      </div>

                      <div className="flex-1 mb-8">
                        <p className="text-slate-600 text-lg md:text-xl leading-relaxed italic font-medium">
                          "{testimonial.content}"
                        </p>
                      </div>

                      <div className="flex gap-1.5 text-violet-600">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={22} fill={i < testimonial.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-16">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(idx + 1);
                }}
                className={`h-2 rounded-full transition-all duration-500 ${activeDotIndex === idx ? 'bg-violet-600 w-12 shadow-md shadow-violet-600/30' : 'bg-slate-200 w-8 hover:bg-slate-300'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="purple-gradient rounded-[3rem] p-12 md:p-20 text-center text-white overflow-hidden relative shadow-2xl shadow-violet-500/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative tracking-tight">{t('readyToTransform')}</h2>
          <p className="text-violet-100 text-lg mb-10 max-w-xl mx-auto relative">
            Join thousands of happy homeowners and start your decoration journey with us today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <Link to="/shop" className="bg-white text-violet-600 px-10 py-4 rounded-full font-bold shadow-xl hover:bg-slate-50 transition-colors">
              {t('browseCollection')}
            </Link>
            <Link to="/contact" className="border-2 border-white/40 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
              {t('getInTouch')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, t } = useApp();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 relative">
      <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-slate-50 p-2">
        <div className={`w-full h-full bg-slate-100 animate-pulse absolute inset-0 transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-contain transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
              {t('newArrival')}
            </span>
          )}
          {product.salePrice && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
              {t('offer')}
            </span>
          )}
        </div>
      </Link>
      
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
        className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all border shadow-sm ${isFavorited ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/70 text-slate-400 border-white/20 hover:text-rose-500 hover:bg-white'}`}
      >
        <Heart size={16} className={isFavorited ? 'fill-current' : ''} />
      </button>

      <div className="p-3 space-y-2">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{product.category}</p>
        <Link to={`/product/${product.slug}`} className="block font-bold text-slate-800 hover:text-violet-600 transition-colors line-clamp-1 text-sm">
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-base font-bold text-violet-600">৳{product.salePrice}</span>
              <span className="text-[10px] text-slate-400 line-through">৳{product.price}</span>
            </>
          ) : (
            <span className="text-base font-bold text-slate-900">৳{product.price}</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => addToCart(product)}
            className="flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 px-1.5 rounded-lg transition-all text-[10px]"
          >
            <ShoppingBag size={12} />
            {t('cart')}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-1.5 rounded-lg transition-all shadow-md text-[10px]"
          >
            <Zap size={12} />
            {t('buyNow')}
          </button>
        </div>
      </div>
    </div>
  );
};
