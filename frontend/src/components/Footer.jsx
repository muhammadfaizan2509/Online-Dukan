import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, RotateCcw, Headphones, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      marginTop: '4rem',
      padding: '4rem 0 2rem'
    }}>
      <div className="container">
        {/* Value Proposition Banners */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
              <Truck size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Express Worldwide Delivery</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Trackable real-time shipping on all orders</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--accent-success)' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Stripe Secure Payment</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>256-bit SSL encrypted checkout protection</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: 'var(--accent-gold)' }}>
              <RotateCcw size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>30-Day Easy Returns</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Money back guarantee no questions asked</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', color: '#ec4899' }}>
              <Headphones size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>24/7 Dedicated Support</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live chat & priority email resolution</p>
            </div>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
              }}>
                <Sparkles size={18} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AuraStore
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              The ultimate next-generation e-commerce destination featuring 100+ curated products, instant payments, and 3D live shipping tracking.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/shop" style={{ color: 'inherit' }}>Shop 100 Products</Link></li>
              <li><Link to="/track" style={{ color: 'inherit' }}>Live Shipping Tracker</Link></li>
              <li><Link to="/wishlist" style={{ color: 'inherit' }}>My Saved Wishlist</Link></li>
              <li><Link to="/cart" style={{ color: 'inherit' }}>Shopping Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Product Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/shop?category=1" style={{ color: 'inherit' }}>Electronics & Tech (20)</Link></li>
              <li><Link to="/shop?category=2" style={{ color: 'inherit' }}>Fashion & Apparel (20)</Link></li>
              <li><Link to="/shop?category=3" style={{ color: 'inherit' }}>Home & Kitchen (20)</Link></li>
              <li><Link to="/shop?category=4" style={{ color: 'inherit' }}>Beauty & Personal Care (15)</Link></li>
              <li><Link to="/shop?category=5" style={{ color: 'inherit' }}>Fitness & Outdoor (15)</Link></li>
              <li><Link to="/shop?category=6" style={{ color: 'inherit' }}>Accessories & Watches (10)</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Newsletter & Perks</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Subscribe to unlock 15% OFF your first order and priority flash sale notifications.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("🎉 Thank you for subscribing! Check your email for your 15% OFF coupon code."); }} style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="email" placeholder="Your email address..." required style={{
                flex: 1, padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-color)',
                background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem'
              }} />
              <button type="submit" style={{
                background: 'var(--accent-gradient)', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright & Payment Badges */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} AuraStore Inc. Powered by React, Python Flask & MySQL. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontWeight: 600 }}>
            <span style={{ padding: '0.2rem 0.5rem', background: 'var(--bg-input)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>💳 Stripe</span>
            <span style={{ padding: '0.2rem 0.5rem', background: 'var(--bg-input)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>💳 Visa</span>
            <span style={{ padding: '0.2rem 0.5rem', background: 'var(--bg-input)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>💳 Mastercard</span>
            <span style={{ padding: '0.2rem 0.5rem', background: 'var(--bg-input)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>📦 FedEx</span>
            <span style={{ padding: '0.2rem 0.5rem', background: 'var(--bg-input)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>⚡ DHL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
