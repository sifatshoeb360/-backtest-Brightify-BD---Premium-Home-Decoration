
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, Zap, ArrowLeft, Star, Truck, 
  ShieldCheck, Heart, Plus, Minus, Search, Send, Play
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ProductCard } from './Home';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist, addReview, currentUser, t } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'delivery'>('description');
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  // Zoom state
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const product = useMemo(() => 
    products.find(p => p.slug === slug), 
  [products, slug]);

  const relatedProducts = useMemo(() => 
    products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4),
  [products, product]);

  // If a video exists, show it by default
  useEffect(() => {
    if (product?.videoUrl) {
      setShowVideo(true);
    } else {
      setShowVideo(false);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('productNotFound')}</h2>
        <p className="text-slate-500 mb-8">{t('productNotFoundText')}</p>
        <Link to="/shop" className="bg-violet-600 text-white px-8 py-3 rounded-full font-bold">
          {t('backToShop')}
        </Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || showVideo) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    addReview(product.id, reviewRating, reviewComment);
    setReviewComment('');
    setIsReviewSubmitted(true);
    setTimeout(() => setIsReviewSubmitted(false), 3000);
  };

  const renderDescription = (text: string) => {
    const hasHtml = /<[a-z][\s\S]*>/i.test(text);
    if (hasHtml) {
      return <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: text }} />;
    }
    return <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">{text}</div>;
  };

  const isFavorited = isInWishlist(product.id);
  const reviews = product.reviews || [];
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 mb-8 font-medium transition-colors">
        <ArrowLeft size={18} /> {t('backToBrowsing')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 mb-20">
        <div className="space-y-4 relative">
          <div 
            ref={imageRef}
            onMouseEnter={() => !showVideo && setIsZooming(true)}
            onMouseLeave={() => !showVideo && setIsZooming(false)}
            onMouseMove={handleMouseMove}
            className={`aspect-square rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm relative ${!showVideo ? 'cursor-zoom-in' : ''} flex items-center justify-center`}
          >
            {showVideo && product.videoUrl ? (
              <video 
                key={product.videoUrl}
                controls 
                className="w-full h-full object-contain bg-slate-900"
                poster={product.images[0]}
              >
                <source src={product.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-contain transition-transform duration-300 ease-out pointer-events-none p-8" 
                style={{
                  transform: isZooming ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                }}
              />
            )}
            
            {product.isNewArrival && (
              <span className="absolute top-6 left-6 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg z-10 pointer-events-none">
                {t('newArrival')}
              </span>
            )}
            {!isZooming && !showVideo && (
              <div className="absolute bottom-6 right-6 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-400 opacity-60 pointer-events-none">
                <Search size={16} />
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Video Thumbnail */}
            {product.videoUrl && (
              <button 
                onClick={() => setShowVideo(true)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all relative group flex items-center justify-center bg-slate-900 ${showVideo ? 'border-violet-600 scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={product.images[0]} alt="video thumb" className="w-full h-full object-cover opacity-30" />
                <Play className="absolute text-white" size={24} fill="white" />
              </button>
            )}
            
            {/* Image Thumbnails */}
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => {
                  setActiveImage(idx);
                  setShowVideo(false);
                  setIsZooming(false);
                }} 
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${!showVideo && activeImage === idx ? 'border-violet-600 scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-violet-600 font-bold text-sm uppercase tracking-widest mb-2">{product.category}</p>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
              </div>
              <button 
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-2xl transition-all border shadow-sm ${isFavorited ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-400 border-slate-100 hover:text-rose-500'}`}
                title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={24} className={isFavorited ? 'fill-current' : ''} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.round(Number(avgRating)) ? "currentColor" : "none"} className={i < Math.round(Number(avgRating)) ? "" : "text-slate-200"} />
                ))}
              </div>
              <span className="text-sm text-slate-400">({reviews.length} {t('reviewsCount')})</span>
            </div>
          </div>

          <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Price</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-violet-600">৳{product.salePrice || product.price}</span>
                {product.salePrice && <span className="text-lg text-slate-400 line-through font-medium">৳{product.price}</span>}
              </div>
            </div>
            {product.salePrice && <div className="bg-rose-100 text-rose-600 px-3 py-1 rounded-lg text-sm font-bold">{t('saveMoney')}{product.price - product.salePrice}</div>}
          </div>

          <div className="space-y-6 pt-6 border-t border-slate-100 mb-10">
            <div className="flex items-center gap-6">
              <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-slate-50 text-slate-500 transition-colors"><Minus size={20} /></button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-slate-50 text-slate-500 transition-colors"><Plus size={20} /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => addToCart(product, quantity)} className="flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"><ShoppingBag size={20} /> {t('addToCart')}</button>
              <button onClick={handleBuyNow} className="flex items-center justify-center gap-3 bg-violet-600 text-white py-5 rounded-2xl font-bold hover:bg-violet-700 transition-all shadow-xl shadow-violet-600/30"><Zap size={20} /> {t('buyNow')}</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-10 border-t border-slate-100">
             <div className="text-center">
               <Truck size={20} className="mx-auto text-violet-600 mb-1" />
               <p className="text-[10px] font-bold text-slate-500 uppercase">{t('fastDelivery')}</p>
             </div>
             <div className="text-center">
               <ShieldCheck size={20} className="mx-auto text-emerald-600 mb-1" />
               <p className="text-[10px] font-bold text-slate-500 uppercase">Secure</p>
             </div>
             <div className="text-center">
               <Heart size={20} className="mx-auto text-rose-600 mb-1" />
               <p className="text-[10px] font-bold text-slate-500 uppercase">Premium</p>
             </div>
          </div>
        </div>
      </div>

      <div className="mb-24">
        <div className="flex flex-wrap border-b border-slate-200">
          <button onClick={() => setActiveTab('description')} className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'description' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>{t('description')}</button>
          <button onClick={() => setActiveTab('reviews')} className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'reviews' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>{t('customerReview')}</button>
          <button onClick={() => setActiveTab('delivery')} className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'delivery' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>{t('deliveryInfo')}</button>
        </div>

        <div className="py-12 min-h-[300px]">
          {activeTab === 'description' && renderDescription(product.description)}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">
              <div className="space-y-8">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <h4 className="font-bold text-lg mb-4">{t('writeReview')}</h4>
                  {currentUser ? (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">{t('rating')}</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className={`p-1 transition-colors ${reviewRating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                            >
                              <Star size={24} fill={reviewRating >= star ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">{t('comment')}</label>
                        <textarea
                          required
                          rows={4}
                          className="w-full p-4 bg-white border border-slate-100 rounded-2xl resize-none text-sm"
                          placeholder="What did you like or dislike about this product?"
                          value={reviewComment}
                          onChange={e => setReviewComment(e.target.value)}
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="w-full bg-violet-600 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-violet-700 transition-all"
                      >
                        <Send size={18} /> {t('submitReview')}
                      </button>
                      {isReviewSubmitted && (
                         <p className="text-xs text-emerald-600 font-bold text-center animate-in fade-in">{t('reviewSuccess')}</p>
                      )}
                    </form>
                  ) : (
                    <div className="text-center py-6">
                       <p className="text-slate-500 text-sm mb-4">{t('loginToReview')}</p>
                       <Link to="/login" className="text-violet-600 font-bold underline">{t('login')}</Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                {reviews.length > 0 ? reviews.map(review => (
                  <div key={review.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm">
                            {review.userName.charAt(0)}
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900 text-sm">{review.userName}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{review.date}</p>
                         </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-100"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">"{review.comment}"</p>
                  </div>
                )) : (
                  <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                     <p className="text-slate-400 font-medium">No reviews yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'delivery' && (
            <div className="max-w-4xl space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div><h4 className="font-bold mb-2">{t('insideDhaka')}</h4><p className="text-slate-600">Charge: ৳70</p></div>
                <div><h4 className="font-bold mb-2">{t('outsideDhaka')}</h4><p className="text-slate-600">Charge: ৳120</p></div>
              </div>
              <div className="bg-violet-50 p-6 rounded-2xl border border-violet-100"><p className="text-sm text-violet-800"><strong>{t('note')}:</strong> {t('fragileNote')}</p></div>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-16 border-t border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-12">{t('youMayAlsoLike')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};
