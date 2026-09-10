import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function WishlistPage({ wishlist, onAddToCart, onToggleWishlist }) {
  if (wishlist.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)',
          padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto'
        }}>
          <Heart size={56} strokeWidth={1} style={{ color: 'var(--accent-danger)', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Wishlist is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Tap the heart icon on any product to save it for later.
          </p>
          <Link to="/shop" className="btn-primary">
            Explore 100 Products <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Saved Wishlist ({wishlist.length})</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Your saved items for quick purchase.
        </p>
      </div>

      <div className="product-grid">
        {wishlist.map((p) => (
          <ProductCard 
            key={p.id}
            product={p}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={true}
          />
        ))}
      </div>
    </div>
  );
}
