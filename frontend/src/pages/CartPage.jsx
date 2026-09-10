import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, 
  ShieldCheck, Truck, Tag, Check, ArrowLeft 
} from 'lucide-react';

export default function CartPage({ cart, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => {
    const price = item.discount_price || item.price;
    return sum + (price * item.quantity);
  }, 0);

  const discountAmount = subtotal * discountPercent;
  const shippingFee = subtotal > 15000 ? 0 : 500.0;
  const estimatedTax = subtotal * 0.05;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee + estimatedTax);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'AURA15' || promoCode.trim().toUpperCase() === 'SAVE15') {
      setDiscountPercent(0.15);
      setPromoMsg('🎉 15% Special Discount Applied!');
    } else {
      alert("Invalid promo code. Try 'AURA15' for 15% OFF!");
    }
  };

  const handleProceedCheckout = () => {
    navigate('/checkout', { state: { discountPercent } });
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)',
          padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto'
        }}>
          <ShoppingBag size={56} strokeWidth={1} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Shopping Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Discover 100+ high quality products across technology, fashion, home, and lifestyle.
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
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Link to="/shop" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>Shopping Cart ({cart.length} Items)</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '2.5rem',
        alignItems: 'start'
      }} className="cart-layout">
        
        {/* Cart Items Table List */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Items in Order</h3>
            <button onClick={onClearCart} style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', fontSize: '0.82rem', fontWeight: 600 }}>
              Clear Cart
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {cart.map((item) => {
              const itemPrice = item.discount_price || item.price;
              return (
                <div key={item.id} style={{
                  display: 'flex',
                  gap: '1.25rem',
                  padding: '1rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  alignItems: 'center'
                }}>
                  <img src={item.image_url} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {item.category_name}
                    </div>
                    <Link to={`/product/${item.id}`} style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
                      {item.name}
                    </Link>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Price: ₨ {itemPrice.toLocaleString()} each
                    </div>
                  </div>

                  {/* Quantity picker */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--bg-card)' }}>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.35rem 0.6rem', background: 'none', border: 'none', color: 'var(--text-primary)' }}>
                      <Minus size={14} />
                    </button>
                    <span style={{ fontWeight: 800, padding: '0 0.5rem' }}>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.35rem 0.6rem', background: 'none', border: 'none', color: 'var(--text-primary)' }}>
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Item total */}
                  <div style={{ width: '120px', textAlign: 'right', fontWeight: 800, fontSize: '1.05rem', color: 'var(--accent-primary)' }}>
                    ₨ {(itemPrice * item.quantity).toLocaleString()}
                  </div>

                  {/* Delete */}
                  <button onClick={() => onRemoveItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Column */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-md)',
          position: 'sticky',
          top: '95px'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
            Order Summary
          </h3>

          {/* Promo code */}
          <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input 
                type="text" 
                placeholder="Promo Code (AURA15)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                style={{
                  width: '100%', padding: '0.65rem 0.8rem 0.65rem 2.2rem', borderRadius: '8px',
                  border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem'
                }}
              />
              <Tag size={16} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            <button type="submit" className="btn-secondary" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
              Apply
            </button>
          </form>

          {promoMsg && (
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-success)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Check size={16} /> {promoMsg}
            </div>
          )}

          {/* Line Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Cart Subtotal</span>
              <span>₨ {subtotal.toLocaleString()}</span>
            </div>

            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-success)', fontWeight: 700 }}>
                <span>Discount Savings</span>
                <span>-₨ {discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping Fee</span>
              <span>{shippingFee === 0 ? <span style={{ color: 'var(--accent-success)', fontWeight: 700 }}>FREE</span> : `₨ ${shippingFee.toLocaleString()}`}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Estimated Tax (5%)</span>
              <span>₨ {estimatedTax.toLocaleString()}</span>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800,
              color: 'var(--text-primary)', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)'
            }}>
              <span>Grand Total</span>
              <span style={{ color: 'var(--accent-primary)' }}>₨ {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <button onClick={handleProceedCheckout} className="btn-primary" style={{ width: '100%', padding: '0.95rem', fontSize: '1rem' }}>
            <span>Proceed to Checkout</span>
            <ArrowRight size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} color="var(--accent-success)" /> Protected by 256-Bit SSL Encryption
          </div>
        </div>
      </div>
    </div>
  );
}
