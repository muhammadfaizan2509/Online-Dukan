import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Flame, ShieldCheck, Truck, Clock, 
  Star, ChevronRight, Zap, Gift, Award
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function HomePage({ onAddToCart, onToggleWishlist, wishlist }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    // Fetch categories and featured products
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/products?featured=true&limit=8').then(r => r.json()),
      fetch('/api/products?trending=true&limit=8').then(r => r.json())
    ]).then(([catData, featData, trendData]) => {
      if (Array.isArray(catData)) setCategories(catData);
      if (featData.products) setFeaturedProducts(featData.products);
      if (trendData.products) setTrendingProducts(trendData.products);
      setLoading(false);
    }).catch(err => {
      console.error("Home page fetch error:", err);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* Hero Banner Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 4rem',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* Decorative Background Glow Spheres */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px',
          borderRadius: '50%', background: 'rgba(99, 102, 241, 0.25)', filter: 'blur(100px)', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '-50px', left: '-50px', width: '350px', height: '350px',
          borderRadius: '50%', background: 'rgba(236, 72, 153, 0.2)', filter: 'blur(90px)', zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: '50px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: 'var(--accent-primary)',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1.5rem'
              }}>
                <Sparkles size={16} /> 100+ Premium Products In Stock & Ready to Ship
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1.1,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem'
              }}>
                Next-Gen Shopping <br />
                <span className="gradient-text">Redefined For You</span>
              </h1>

              <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                marginBottom: '2rem',
                maxWidth: '540px'
              }}>
                Explore 100 high-end electronics, luxury fashion, smart home essentials, and fitness gear with instant payment authorization & live 3D shipping status updates.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/shop" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                  <span>Shop 100 Products</span>
                  <ArrowRight size={20} />
                </Link>

                <Link to="/track" className="btn-secondary" style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}>
                  <Truck size={20} color="var(--accent-gold)" />
                  <span>Track Any Order</span>
                </Link>
              </div>

              {/* Stats Bar */}
              <div style={{
                display: 'flex',
                gap: '2.5rem',
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '1px solid var(--border-color)'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>100+</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Curated Products</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-success)' }}>99.8%</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Satisfaction Rate</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-gold)' }}>24/7</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Live GPS Tracking</p>
                </div>
              </div>
            </div>

            {/* Visual Hero Feature Image */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)',
                background: 'var(--bg-card)'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80" 
                  alt="AuraStore Headphone Hero"
                  style={{ width: '100%', height: '420px', objectFit: 'cover' }}
                />
              </div>

              {/* Floating Glass Widget Badge */}
              <div className="glass-panel" style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{
                  padding: '0.65rem', borderRadius: '12px', background: 'var(--accent-gradient)', color: '#fff'
                }}>
                  <Zap size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Fast Stripe Checkout</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Instant Authorization & Receipt</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Taxonomy
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Explore By Category</h2>
          </div>

          <Link to="/shop" style={{ color: 'var(--accent-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View All Categories <ChevronRight size={18} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem'
        }}>
          {categories.map((cat) => (
            <Link key={cat.id} to={`/shop?category=${cat.id}`} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-input)',
                overflow: 'hidden', marginBottom: '0.85rem', border: '1px solid var(--border-color)'
              }}>
                <img src={cat.image_url} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>{cat.name}</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{cat.product_count} Items</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale Banner with Countdown */}
      <section className="container">
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #311b92 50%, #4a148c 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2.5rem',
          color: '#fff',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: '50px', background: 'rgba(239, 68, 68, 0.25)', color: '#f87171', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
              <Flame size={16} /> Flash Deal Of The Day
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem', color: '#fff' }}>
              Save Up to 40% OFF <br />On Tech & Fashion Icons
            </h2>
            <p style={{ color: '#c7d2fe', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Limited-time offers on top-tier items. Orders placed today qualify for express priority shipping!
            </p>

            <Link to="/shop?sort=discount" className="btn-primary" style={{ background: '#fff', color: '#1e1b4b', fontWeight: 800 }}>
              <span>Grab Flash Deals</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Countdown Clock Display */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(0,0,0,0.35)', padding: '1.25rem 1rem', borderRadius: '14px', textAlign: 'center', minWidth: '80px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'monospace' }}>{String(timeLeft.hours).padStart(2, '0')}</span>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.7 }}>Hours</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, alignSelf: 'center' }}>:</div>
            <div style={{ background: 'rgba(0,0,0,0.35)', padding: '1.25rem 1rem', borderRadius: '14px', textAlign: 'center', minWidth: '80px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'monospace' }}>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.7 }}>Minutes</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, alignSelf: 'center' }}>:</div>
            <div style={{ background: 'rgba(0,0,0,0.35)', padding: '1.25rem 1rem', borderRadius: '14px', textAlign: 'center', minWidth: '80px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'monospace', color: '#f87171' }}>{String(timeLeft.seconds).padStart(2, '0')}</span>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.7 }}>Seconds</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Staff Pick
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Featured Top Picks</h2>
          </div>

          <Link to="/shop" style={{ color: 'var(--accent-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Explore All 100 <ChevronRight size={18} />
          </Link>
        </div>

        <div className="product-grid">
          {featuredProducts.map((p) => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.some(w => w.id === p.id)}
            />
          ))}
        </div>
      </section>

      {/* Trending Hot Items */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Popular Right Now
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Trending Products</h2>
          </div>

          <Link to="/shop?sort=rating" style={{ color: 'var(--accent-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Top Rated Products <ChevronRight size={18} />
          </Link>
        </div>

        <div className="product-grid">
          {trendingProducts.map((p) => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.some(w => w.id === p.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
