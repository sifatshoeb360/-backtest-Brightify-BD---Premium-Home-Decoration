
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ProductCard } from './Home';

const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full">
    <div className="aspect-square bg-slate-100 animate-pulse" />
    <div className="p-4 space-y-4">
      <div className="h-3 bg-slate-100 rounded w-1/4 animate-pulse" />
      <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse" />
      <div className="h-6 bg-slate-100 rounded w-1/2 animate-pulse" />
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="h-10 bg-slate-50 rounded-lg animate-pulse" />
        <div className="h-10 bg-slate-50 rounded-lg animate-pulse" />
      </div>
    </div>
  </div>
);

export const Shop: React.FC = () => {
  const { products, categories, t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [searchParams, search, sortBy]);

  const activeCategory = searchParams.get('category');

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory) {
      result = result.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));

    return result;
  }, [products, activeCategory, search, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t('ourCollection')}</h1>
          <p className="text-slate-500">{t('discoveryText')}</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-8">
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2 text-slate-900">
              <SlidersHorizontal size={18} /> {t('categories')}
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => setSearchParams({})}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${!activeCategory ? 'bg-violet-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                {t('allProducts')}
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.slug })}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${activeCategory === cat.slug ? 'bg-violet-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-slate-900">{t('sortBy')}</h4>
            <select
              className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 text-slate-700"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">{t('newest')}</option>
              <option value="price-asc">{t('priceLowHigh')}</option>
              <option value="price-desc">{t('priceHighLow')}</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-xl text-slate-500 font-medium">{t('noProductsFound')}</p>
              <button onClick={() => { setSearch(''); setSearchParams({}); }} className="mt-4 text-violet-600 font-bold underline">
                {t('clearFilters')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
