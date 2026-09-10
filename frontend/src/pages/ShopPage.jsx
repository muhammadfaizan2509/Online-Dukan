import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, Search, SlidersHorizontal, ChevronLeft, ChevronRight, 
  Sparkles, Grid, X, RotateCcw, Package 
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function ShopPage({ onAddToCart, onToggleWishlist, wishlist }) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State variables for filters
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_items: 100, limit: 16 });
  const [loading, setLoading] = useState(true);

  // Filter criteria
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'default';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300000);
  const [minRating, setMinRating] = useState(0);
  const [searchInput, setSearchInput] = useState(searchParam);

  // Sync state with URL params
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Load categories taxonomy
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Error loading categories:", err));
  }, []);

  // Fetch products from backend whenever filters/page change
  useEffect(() => {
    setLoading(true);

    const query = new URLSearchParams();
    if (categoryParam !== 'all') query.set('category', categoryParam);
    if (searchParam) query.set('search', searchParam);
    if (sortParam !== 'default') query.set('sort', sortParam);
    if (pageParam > 1) query.set('page', pageParam);
    if (minPrice > 0) query.set('min_price', minPrice);
    if (maxPrice < 300000) query.set('max_price', maxPrice);
    if (minRating > 0) query.set('rating', minRating);
    query.set('limit', 16);

    fetch(`/api/products?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.products) setProducts(data.products);
        if (data.pagination) setPagination(data.pagination);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [categoryParam, searchParam, sortParam, pageParam, minPrice, maxPrice, minRating]);

  // Update query params helper
  const updateParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.keys(newParams).forEach(key => {
      if (newParams[key] === null || newParams[key] === '' || newParams[key] === 'all') {
        updated.delete(key);
      } else {
        updated.set(key, newParams[key]);
      }
    });
    setSearchParams(updated);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim(), page: 1 });
  };

  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(300000);
    setMinRating(0);
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        marginBottom: '2.5rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Package size={20} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Full Catalog
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Explore 100+ Products</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Showing items for Electronics, Fashion, Home, Beauty, Fitness & Accessories.
          </p>
        </div>

        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '0.75rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          textAlign: 'right'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Items Available</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {pagination.total_items} Items
          </div>
        </div>
      </div>

      {/* Main Layout Grid (Sidebar Filters + Products Grid) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '2.5rem',
        alignItems: 'start'
      }} className="shop-layout">
        
        {/* Sidebar Filters Column */}
        <aside style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          position: 'sticky',
          top: '95px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} color="var(--accent-primary)" /> Filter Catalog
            </h3>
            <button onClick={handleResetFilters} style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '0.25rem'
            }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Search Box Filter */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              Keyword Search
            </label>
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Filter catalog..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  width: '100%', padding: '0.6rem 0.8rem 0.6rem 2.2rem', borderRadius: '8px',
                  border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem'
                }}
              />
              <Search size={14} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </form>
          </div>

          {/* Categories Selector */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.75rem' }}>
              Product Categories
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <button onClick={() => updateParams({ category: 'all', page: 1 })} style={{
                background: categoryParam === 'all' ? 'var(--accent-gradient)' : 'transparent',
                color: categoryParam === 'all' ? '#fff' : 'var(--text-primary)',
                border: 'none', padding: '0.55rem 0.85rem', borderRadius: '8px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem', fontWeight: 600
              }}>
                <span>All Categories</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({pagination.total_items})</span>
              </button>

              {categories.map((cat) => {
                const isActive = categoryParam === String(cat.id) || categoryParam === cat.slug;
                return (
                  <button key={cat.id} onClick={() => updateParams({ category: cat.id, page: 1 })} style={{
                    background: isActive ? 'var(--accent-gradient)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    border: 'none', padding: '0.55rem 0.85rem', borderRadius: '8px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem', fontWeight: isActive ? 700 : 500
                  }}>
                    <span>{cat.name}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>({cat.product_count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Filter Slider */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              Price Range (₨ {minPrice.toLocaleString()} - ₨ {maxPrice.toLocaleString()})
            </label>
            <input 
              type="range" 
              min="0" 
              max="300000" 
              step="5000" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <span>₨ 0</span>
              <span>₨ 150,000</span>
              <span>₨ 300,000</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              Minimum Rating
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[0, 4.0, 4.5].map((r) => (
                <button key={r} onClick={() => setMinRating(r)} style={{
                  flex: 1, padding: '0.4rem', borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: minRating === r ? 'var(--accent-gradient)' : 'var(--bg-input)',
                  color: minRating === r ? '#fff' : 'var(--text-primary)',
                  fontSize: '0.78rem', fontWeight: 700
                }}>
                  {r === 0 ? 'All' : `${r}+ ★`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div>
          {/* Controls Bar (Sort & Page Indicator) */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Showing Page <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{pagination.current_page}</span> of {pagination.total_pages} ({products.length} Products)
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sort By:</label>
              <select 
                value={sortParam} 
                onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
                style={{
                  padding: '0.45rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600
                }}
              >
                <option value="default">Featured & Default</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Savings</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              Loading 100 products catalog...
            </div>
          ) : products.length === 0 ? (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
              padding: '4rem 2rem', textAlign: 'center'
            }}>
              <X size={48} color="var(--accent-danger)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Products Found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Try adjusting your search query, price range, or category filter.
              </p>
              <button onClick={handleResetFilters} className="btn-primary">Reset Filters</button>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.some(w => w.id === product.id)}
                />
              ))}
            </div>
          )}

          {/* Tabbed Pagination Control Bar */}
          {pagination.total_pages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '3rem'
            }}>
              <button 
                disabled={!pagination.has_prev}
                onClick={() => updateParams({ page: pagination.current_page - 1 })}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                  padding: '0.6rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem',
                  opacity: pagination.has_prev ? 1 : 0.4, cursor: pagination.has_prev ? 'pointer' : 'not-allowed'
                }}
              >
                <ChevronLeft size={18} /> Prev
              </button>

              {[...Array(pagination.total_pages)].map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === pagination.current_page;
                return (
                  <button 
                    key={pageNum}
                    onClick={() => updateParams({ page: pageNum })}
                    style={{
                      width: '40px', height: '40px', borderRadius: '8px',
                      background: isActive ? 'var(--accent-gradient)' : 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      color: isActive ? '#fff' : 'var(--text-primary)',
                      fontWeight: 700, fontSize: '0.9rem'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button 
                disabled={!pagination.has_next}
                onClick={() => updateParams({ page: pagination.current_page + 1 })}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                  padding: '0.6rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem',
                  opacity: pagination.has_next ? 1 : 0.4, cursor: pagination.has_next ? 'pointer' : 'not-allowed'
                }}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
