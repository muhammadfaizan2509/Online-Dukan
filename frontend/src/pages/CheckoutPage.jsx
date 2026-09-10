import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, CreditCard, Truck, User, MapPin, 
  Mail, Phone, Lock, ArrowRight, CheckCircle2 
} from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

export default function CheckoutPage({ cart, onClearCart }) {
  const location = useLocation();
  const navigate = useNavigate();

  const discountPercent = location.state?.discountPercent || 0;

  // Form State
  const [customer, setCustomer] = useState({
    name: 'Faizan Muhammad',
    email: 'faizan@example.com',
    address: 'Gulberg III, Main Boulevard',
    city: 'Lahore',
    zip_code: '54000',
    country: 'Pakistan'
  });

  const [shippingMethod, setShippingMethod] = useState('express'); // standard vs express
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.discount_price || item.price;
    return sum + (price * item.quantity);
  }, 0);

  const discountAmount = subtotal * discountPercent;
  const shippingFee = shippingMethod === 'express' ? 500.0 : 0.0;
  const tax = subtotal * 0.05;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee + tax);

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentResult) => {
    setShowPaymentModal(false);
    setIsPlacingOrder(true);

    try {
      // Call Flask Backend Order Creation Endpoint
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customer,
          items: cart,
          total_amount: grandTotal,
          shipping_fee: shippingFee,
          tax: tax,
          payment_method: 'Credit Card (Stripe Gateway)'
        })
      });

      const data = await response.json();

      if (data.success && data.order) {
        onClearCart();
        setIsPlacingOrder(false);
        // Navigate directly to Live Order Tracking Page with generated tracking code!
        navigate(`/track?tracking=${data.order.tracking_number}`, { state: { newOrder: data.order } });
      } else {
        alert(data.error || "Failed to create order.");
        setIsPlacingOrder(false);
      }
    } catch (err) {
      console.error("Order creation error:", err);
      alert("Error placing order. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>No Items to Checkout</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>Please add products to your cart before proceeding.</p>
        <button onClick={() => navigate('/shop')} className="btn-primary">Browse Shop</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Secure Checkout</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Complete shipping details and authorize payment via Stripe sandbox.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '2.5rem',
        alignItems: 'start'
      }} className="checkout-layout">
        
        {/* Shipping & Delivery Information Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Customer Address Details */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="var(--accent-primary)" /> 1. Customer Shipping Address
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={customer.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%', padding: '0.7rem 1rem', borderRadius: '8px',
                    border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={customer.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%', padding: '0.7rem 1rem', borderRadius: '8px',
                    border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Country
                </label>
                <select 
                  name="country"
                  value={customer.country}
                  onChange={handleInputChange}
                  style={{
                    width: '100%', padding: '0.7rem 1rem', borderRadius: '8px',
                    border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)'
                  }}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Street Address
                </label>
                <input 
                  type="text" 
                  name="address"
                  value={customer.address}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%', padding: '0.7rem 1rem', borderRadius: '8px',
                    border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  City
                </label>
                <input 
                  type="text" 
                  name="city"
                  value={customer.city}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%', padding: '0.7rem 1rem', borderRadius: '8px',
                    border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Zip / Postal Code
                </label>
                <input 
                  type="text" 
                  name="zip_code"
                  value={customer.zip_code}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%', padding: '0.7rem 1rem', borderRadius: '8px',
                    border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Shipping Speed Options */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} color="var(--accent-gold)" /> 2. Delivery Options
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem',
                borderRadius: 'var(--radius-sm)', border: shippingMethod === 'express' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                background: 'var(--bg-input)', cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>FedEx Express Shipping (3-5 Business Days)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Includes live 3D tracking & signature confirmation</div>
                  </div>
                </div>
                <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>₨ 500</span>
              </label>

              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem',
                borderRadius: 'var(--radius-sm)', border: shippingMethod === 'standard' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                background: 'var(--bg-input)', cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="radio" name="shipping" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Standard Postal Delivery (5-7 Business Days)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Free shipping on qualifying cart orders</div>
                  </div>
                </div>
                <span style={{ fontWeight: 800, color: 'var(--accent-success)' }}>FREE</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Payment Button */}
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
            Order Items ({cart.length})
          </h3>

          <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <img src={item.image_url} alt={item.name} style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }} />
                <div style={{ flex: 1, fontSize: '0.82rem' }}>
                  <div style={{ fontWeight: 700, lineHeight: 1.2 }}>{item.name}</div>
                  <div style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                  ₨ {((item.discount_price || item.price) * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Items Subtotal</span>
              <span>₨ {subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-success)' }}>
                <span>Discount Savings</span>
                <span>-₨ {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span>₨ {shippingFee.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Tax (5%)</span>
              <span>₨ {tax.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <span>Total Pay</span>
              <span style={{ color: 'var(--accent-primary)' }}>₨ {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
            <CreditCard size={20} />
            <span>Proceed to Payment (₨ {grandTotal.toLocaleString()})</span>
          </button>
        </div>
      </form>

      {/* Stripe Payment Modal Integration */}
      {showPaymentModal && (
        <PaymentModal 
          amount={grandTotal} 
          onPaymentSuccess={handlePaymentSuccess} 
          onCancel={() => setShowPaymentModal(false)} 
        />
      )}
    </div>
  );
}
