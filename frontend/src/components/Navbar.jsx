import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Search, Heart, Truck, Moon, Sun, 
  Menu, X, Sparkles, ChevronDown, Package 
} from 'lucide-react';

export default function Navbar({ cart, wishlist, theme, toggleTheme, onOpenCart }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Error loading categories:", err));
  }, []);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-backdrop)',
      WebkitBackdropFilter: 'var(--glass-backdrop)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '75px',
        gap: '1.5rem'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Sparkles size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.45rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              AuraStore
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '-4px' }}>
              100+ Luxury Products
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{
          flex: 1,
          maxWidth: '480px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <input 
            type="text" 
            placeholder="Search 100+ products, electronics, fashion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.6rem',
              borderRadius: '50px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              transition: 'var(--transition-fast)'
            }}
          />
          <Search size={18} style={{
            position: 'absolute',
            left: '1rem',
            color: 'var(--text-muted)'
          }} />
          {searchQuery && (
            <button type="submit" style={{
              position: 'absolute',
              right: '6px',
              background: 'var(--accent-gradient)',
              border: 'none',
              color: '#fff',
              padding: '0.35rem 0.85rem',
              borderRadius: '50px',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              Search
            </button>
          )}
        </form>

        {/* Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }} className="desktop-nav">
          <Link to="/" style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
            Home
          </Link>

          {/* Shop Dropdown */}
          <div style={{ position: 'relative' }} 
               onMouseEnter={() => setShowCatMenu(true)} 
               onMouseLeave={() => setShowCatMenu(false)}>
            <Link to="/shop" style={{ 
              fontWeight: 600, 
              color: 'var(--text-primary)', 
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              Shop <ChevronDown size={14} />
            </Link>

            {showCatMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '240px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
                zIndex: 110,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                <Link to="/shop" style={{
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Package size={16} color="var(--accent-primary)" /> All 100 Products
                </Link>
                <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.25rem 0' }} />
                {categories.map(cat => (
                  <Link key={cat.id} to={`/shop?category=${cat.id}`} style={{
                    padding: '0.5rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'var(--transition-fast)'
                  }}>
                    <span>{cat.name}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>({cat.product_count})</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/track" style={{ 
            fontWeight: 600, 
            color: 'var(--text-primary)', 
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Truck size={16} color="var(--accent-gold)" /> Track Order
          </Link>

          <Link to="/wishlist" style={{ position: 'relative', color: 'var(--text-primary)' }}>
            <Heart size={22} />
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-8px',
                background: 'var(--accent-danger)',
                color: '#fff',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Theme Switcher Button */}
          <button onClick={toggleTheme} style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '0.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-fast)'
          }}>
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {/* Cart Trigger */}
          <button onClick={onOpenCart} style={{
            background: 'var(--accent-gradient)',
            color: '#fff',
            border: 'none',
            padding: '0.55rem 1.1rem',
            borderRadius: '50px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <ShoppingBag size={18} />
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span style={{
                background: '#fff',
                color: 'var(--accent-primary)',
                padding: '0.1rem 0.45rem',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {cartItemCount}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile Toggle Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)'
        }} className="mobile-toggle">
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          padding: '1rem 1.5rem 1.5rem',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop All 100 Products</Link>
          <Link to="/track" onClick={() => setMobileMenuOpen(false)}>Track Shipping Order</Link>
          <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>My Wishlist ({wishlist.length})</Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Theme Mode</span>
            <button onClick={toggleTheme} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
              {theme === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
