import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { products, categories } from '../../data/mockData';
import ProductCard from '../../components/shop/ProductCard';
import Layout from '../../components/layout/Layout';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState([]);

  // Sync URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    if (cat) setActiveCategory(cat);
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const toggleBadge = (badge) => {
    setSelectedBadges(prev =>
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.nepali.includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Stock filter
    if (showOnlyInStock) result = result.filter(p => p.inStock);

    // Badge filter
    if (selectedBadges.length > 0) {
      result = result.filter(p => selectedBadges.every(b => p.badges.includes(b)));
    }

    // Sort
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'featured': result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
      default: break;
    }

    return result;
  }, [activeCategory, searchQuery, sortBy, priceRange, showOnlyInStock, selectedBadges]);

  return (
    <Layout>
      {/* ── Page Header ── */}
      <div className="bg-hero-pattern py-14 px-4">
        <div className="max-w-7xl mx-auto text-white text-center">
          <h1 className="text-4xl font-bold mb-2">Organic Shop</h1>
          <p className="text-white/70">Fresh from Nepal's farms to your table</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Top Controls ── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search vegetables, fruits, spices..."
              className="input-field pl-11"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="input-field pr-10 appearance-none min-w-[180px] cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-400 pointer-events-none" />
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 btn-outline"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* ── Sidebar Filters ── */}
          <aside className={`${showFilters ? 'block' : 'hidden'} sm:block w-full sm:w-64 flex-shrink-0`}>
            <div className="glass-card rounded-2xl p-6 sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-bold text-forest-800 mb-3">Category</h3>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${activeCategory === cat.id
                          ? 'bg-primary-600 text-white font-semibold'
                          : 'text-forest-700 hover:bg-primary-50'
                        }`}
                    >
                      <span>{cat.icon} {cat.name}</span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-forest-100 text-forest-600'
                        }`}>{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-bold text-forest-800 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([0, Number(e.target.value)])}
                    className="w-full accent-primary-600"
                  />
                  <div className="flex justify-between text-sm text-forest-600">
                    <span>रू 0</span>
                    <span className="font-semibold text-primary-700">रू {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h3 className="font-bold text-forest-800 mb-3">Type</h3>
                <div className="flex flex-wrap gap-2">
                  {['organic', 'fresh', 'sale', 'new'].map(badge => (
                    <button
                      key={badge}
                      onClick={() => toggleBadge(badge)}
                      className={`badge capitalize transition-colors ${selectedBadges.includes(badge)
                          ? 'bg-primary-600 text-white'
                          : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                        }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyInStock}
                    onChange={e => setShowOnlyInStock(e.target.checked)}
                    className="w-4 h-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-forest-700 font-medium">In Stock Only</span>
                </label>
              </div>

              {/* Reset */}
              {(activeCategory !== 'all' || searchQuery || priceRange[1] < 1000 || showOnlyInStock || selectedBadges.length > 0) && (
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                    setPriceRange([0, 1000]);
                    setShowOnlyInStock(false);
                    setSelectedBadges([]);
                  }}
                  className="w-full text-sm text-red-600 hover:text-red-700 font-medium py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </aside>

          {/* ── Products Grid ── */}
          <div className="flex-1 min-w-0">
            {/* Results info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-forest-600">
                Showing <span className="font-semibold text-forest-800">{filteredProducts.length}</span> products
              </p>
              {activeCategory !== 'all' && (
                <button
                  onClick={() => setActiveCategory('all')}
                  className="flex items-center gap-1 text-xs text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full hover:bg-primary-100 transition-colors"
                >
                  {categories.find(c => c.id === activeCategory)?.name}
                  <X size={12} />
                </button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-bold text-forest-700 text-xl mb-2">No products found</h3>
                <p className="text-forest-500 mb-6">Try adjusting your filters or search query.</p>
                <button
                  onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                  className="btn-outline"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
