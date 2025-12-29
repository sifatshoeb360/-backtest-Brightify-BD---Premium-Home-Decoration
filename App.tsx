
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link, useParams } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { Navbar, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Admin } from './pages/Admin';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { ProductDetail } from './pages/ProductDetail';
import { ScrollToTop } from './components/ScrollToTop';
import { BookOpen, Calendar, User, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Defined at the top to ensure it's initialized before usage in subsequent components
// Fixed error where 'children' was required but seen as missing in some JSX contexts by making it optional
const AnimatedPage = ({ children }: { children?: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const BlogSkeleton = () => (
  <div className="bg-white rounded-[2rem] border border-slate-100 flex flex-col h-full overflow-hidden">
    <div className="aspect-[16/10] bg-slate-100 animate-pulse" />
    <div className="p-6 flex-1 flex flex-col gap-4">
      <div className="h-6 bg-slate-200 rounded-lg w-3/4 animate-pulse" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full animate-pulse" />
        <div className="h-3 bg-slate-100 rounded w-full animate-pulse" />
        <div className="h-3 bg-slate-100 rounded w-2/3 animate-pulse" />
      </div>
      <div className="mt-auto h-4 bg-slate-100 rounded w-1/4 animate-pulse" />
    </div>
  </div>
);

const About = () => {
  const { t } = useApp();
  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto py-24 px-4 text-center text-slate-800">
        <h1 className="text-4xl font-bold mb-6">{t('aboutTitle')}</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
          {t('aboutText')}
        </p>
      </div>
    </AnimatedPage>
  );
};

const Blog = () => {
  const { blogPosts, t } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black mb-4 tracking-tight text-slate-900">{t('blog')}</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">{t('inspirationSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <BlogSkeleton key={i} />)
          ) : blogPosts.length > 0 ? blogPosts.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group overflow-hidden h-full"
            >
              {/* 1. Photo: Show only if post has a photo */}
              {post.images && post.images.length > 0 && (
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img 
                    src={post.images[0]} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={post.title} 
                  />
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col">
                {/* 2. Title */}
                <h2 className="text-xl font-bold text-slate-900 mb-3 leading-snug line-clamp-2 group-hover:text-violet-600 transition-colors">
                  {post.title}
                </h2>
                
                {/* 3. Short Description */}
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6">
                  {post.excerpt}
                </p>
                
                {/* 4. Read More Link */}
                <Link 
                  to={`/blog/${post.slug}`} 
                  className="mt-auto inline-flex items-center gap-2 text-violet-600 font-bold text-sm hover:translate-x-1 transition-transform"
                >
                  {t('readMore')} <ChevronRight size={16} />
                </Link>
              </div>
            </article>
          )) : (
            <div className="col-span-full text-center py-32 bg-slate-50 rounded-[3.5rem] border-2 border-dashed border-slate-200">
               <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <BookOpen size={40} />
               </div>
               <p className="text-slate-500 font-bold text-lg">{t('noStories')}</p>
               <p className="text-slate-400 text-sm">{t('noStoriesSub')}</p>
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

const BlogPostDetail = () => {
  const { slug } = useParams();
  const { blogPosts, t } = useApp();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto py-24 px-4 text-center">
        <h1 className="text-3xl font-bold">Post Not Found</h1>
        <Link to="/blog" className="text-violet-600 font-bold underline mt-4 inline-block">Back to Blog</Link>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 mb-8 font-medium transition-colors">
          <ArrowLeft size={18} /> Back to Blog
        </Link>
        
        <article className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          {post.images && post.images.length > 0 && (
            <div className="aspect-video overflow-hidden bg-slate-100">
               <img src={post.images[0]} className="w-full h-full object-cover" alt={post.title} />
            </div>
          )}
          
          <div className="p-8 md:p-16">
            <div className="flex items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">
                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full"><Calendar size={14} /> {post.date}</span>
                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full"><User size={14} /> {post.author}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-tight">
              {post.title}
            </h1>
            
            <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-[1.8] whitespace-pre-wrap text-lg">
              {post.content}
            </div>

            {post.images && post.images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-16">
                {post.images.slice(1).map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-100">
                    <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-20 pt-12 border-t border-slate-100 flex justify-center">
              <Link to="/contact" className="bg-violet-600 text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-violet-600/20 hover:bg-violet-700 transition-all flex items-center gap-3">
                 <BookOpen size={20} /> {t('consultDesigners')}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </AnimatedPage>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/shop" element={<AnimatedPage><Shop /></AnimatedPage>} />
            <Route path="/product/:slug" element={<AnimatedPage><ProductDetail /></AnimatedPage>} />
            <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />
            <Route path="/wishlist" element={<AnimatedPage><Wishlist /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
            <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
