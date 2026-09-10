import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, Check } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem }) {
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [promoSuccess, setPromoSuccess] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    const p = item.discount_price || item.price;
    return sum + (p * item.quantity);
  }, 0);

  const discountAmount = subtotal * discountApplied;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'AURA15' || promoCode.trim().toUpperCase() === 'SAVE15') {
      setDiscountApplied(0.15);
      setPromoSuccess('15% OFF Promo Discount Applied!');
    } else if (promoCode.trim().length > 0) {
      alert("Invalid promo code. Try using 'AURA15' for 15% OFF!");
    }
  };

  const handleCheckoutClick = () => {
    onClose();
    navigate('/checkout', { state: { discountPercent: discountApplied } });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 200,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-lg)'
      }} className="animate-fade">
        
        {/* Cart Drawer Header */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShoppingBag size={22} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Your Cart ({cart.length})</h3>
            </div>
            <button onClick={onClose} style={{
              background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
              padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <X size={18} />
            </button>
          </div>

          {/* Cart Items List */}
          <div style={{
            maxHeight: 'calc(100vh - 380px)',
            overflowY: 'auto',
            padding: '1rem 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                <ShoppingBag size={48} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p style={{ fontWeight: 600, fontSize: '1rem' }}>Your shopping cart is empty.</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Explore 100+ items in our store!</p>
                <button onClick={() => { onClose(); navigate('/shop'); }} className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                  Explore 100 Products
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = item.discount_price || item.price;
                return (
                  <div key={item.id} style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.85rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    alignItems: 'center'
                  }}>
                    <img src={item.image_url} alt={item.name} style={{
                      width: '65px', height: '65px', borderRadius: '8px', objectFit: 'cover', background: 'var(--bg-input)'
                    }} />

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.3, marginBottom: '0.2rem' }}>
                        {item.name}
                      </h4>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                        ₨ {(itemPrice * item.quantity).toLocaleString()}
                      </div>

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)',
                          borderRadius: '6px', background: 'var(--bg-input)'
                        }}>
                          <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} style={{
                            background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.2rem 0.5rem'
                          }}>
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 0.4rem' }}>
                            {item.quantity}
                          </span>
                          <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} style={{
                            background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.2rem 0.5rem'
                          }}>
                            <Plus size={12} />
                          </button>
                        </div>

                        <button onClick={() => onRemoveItem(item.id)} style={{
                          background: 'none', border: 'none', color: 'var(--text-muted)', padding: '0.2rem'
                        }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Cart Drawer Footer & Checkout */}
        {cart.length > 0 && (
          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input 
                  type="text" 
                  placeholder="Promo Code (Try AURA15)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{
                    width: '100%', padding: '0.55rem 0.8rem 0.55rem 2.2rem', borderRadius: '8px',
                    border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.8rem'
                  }}
                />
                <Tag size={14} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
              <button type="submit" style={{
                background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                padding: '0.55rem 0.9rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600
              }}>
                Apply
              </button>
            </form>

            {promoSuccess && (
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Check size={14} /> {promoSuccess}
              </div>
            )}

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₨ {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-success)' }}>
                  <span>Discount (15%)</span>
                  <span>-₨ {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
                <span>Total</span>
                <span>₨ {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={handleCheckoutClick} className="btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
