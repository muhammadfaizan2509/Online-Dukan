import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Eye, Check } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }) {
  const [added, setAdded] = React.useState(false);

  const discountPercent = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      transition: 'var(--transition-smooth)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--shadow-sm)'
    }} 
    className="product-card"
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.borderColor = 'var(--border-color-hover)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'var(--border-color)';
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    }}>
      {/* Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '80%', /* 4:3 Aspect ratio */
        background: 'var(--bg-input)',
        overflow: 'hidden'
      }}>
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image_url} 
            alt={product.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1.0)'}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';
            }}
          />
        </Link>

        {/* Badges Container */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          zIndex: 2
        }}>
          {product.is_featured && <span className="badge badge-featured">Featured</span>}
          {product.is_trending && <span className="badge badge-trending">Hot Deal</span>}
          {discountPercent > 0 && <span className="badge badge-discount">-{discountPercent}% OFF</span>}
        </div>

        {/* Action Buttons Overlay */}
        <button onClick={handleWishlistClick} style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(17, 24, 39, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-color)',
          color: isWishlisted ? '#ef4444' : 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          transition: 'var(--transition-fast)'
        }}>
          <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} />
        </button>
      </div>

      {/* Product Content Details */}
      <div style={{
        padding: '1.1rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--accent-primary)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.3rem'
          }}>
            {product.category_name}
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              lineHeight: 1.35,
              color: 'var(--text-primary)',
              marginBottom: '0.4rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              height: '2.7em'
            }}>
              {product.name}
            </h3>
          </Link>

          {/* Ratings */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                  stroke="currentColor" 
                />
              ))}
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {product.rating}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({product.review_count})
            </span>
          </div>
        </div>

        {/* Price & Add to Cart Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.5rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--text-primary)'
              }}>
                ₨ {product.discount_price ? product.discount_price.toLocaleString() : product.price.toLocaleString()}
              </span>
              {product.discount_price && (
                <span style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through'
                }}>
                  ₨ {product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button onClick={handleAddToCartClick} style={{
            background: added ? 'var(--accent-success)' : 'var(--accent-gradient)',
            color: '#fff',
            border: 'none',
            padding: '0.55rem 0.95rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'var(--transition-fast)'
          }}>
            {added ? <Check size={16} /> : <ShoppingBag size={16} />}
            <span>{added ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
