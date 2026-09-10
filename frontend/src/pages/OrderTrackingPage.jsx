import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { Search, Truck, ShieldCheck, AlertCircle, PackageCheck, ArrowRight } from 'lucide-react';
import ShippingTracker from '../components/ShippingTracker';

export default function OrderTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const trackingQuery = searchParams.get('tracking') || searchParams.get('order_id') || '';
  const [inputCode, setInputCode] = useState(trackingQuery);
  const [order, setOrder] = useState(location.state?.newOrder || null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Order by Tracking Number or ID
  const fetchOrderTracking = (code) => {
    if (!code.trim()) return;
    setLoading(true);
    setErrorMsg('');

    fetch(`/api/orders/${encodeURIComponent(code.trim())}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setOrder(null);
          setErrorMsg(data.error || `No shipment found matching '${code}'. Please check your tracking number.`);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading order tracking:", err);
        setErrorMsg("Failed to connect to shipping server.");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (trackingQuery) {
      setInputCode(trackingQuery);
      fetchOrderTracking(trackingQuery);
    }
  }, [trackingQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setSearchParams({ tracking: inputCode.trim() });
      fetchOrderTracking(inputCode.trim());
    }
  };

  const handleAdvanceStatus = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error("Status advance error:", err);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      
      {/* Top Banner Header */}
      <div style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2rem',
        textAlign: 'center',
        marginBottom: '3rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)',
          color: 'var(--accent-gold)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
        }}>
          <Truck size={28} />
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Live Order Shipping Tracker
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Track real-time courier milestones, package GPS updates, and carrier dispatch logs for any AuraStore purchase.
        </p>

        {/* Tracking Search Input Form */}
        <form onSubmit={handleSearchSubmit} style={{
          display: 'flex', gap: '0.75rem', maxWidth: '560px', margin: '0 auto'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input 
              type="text" 
              placeholder="Enter Tracking Code (e.g. TRK-89341207 or Order ID)"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              required
              style={{
                width: '100%', padding: '0.9rem 1rem 0.9rem 2.8rem', borderRadius: '50px',
                border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.95rem'
              }}
            />
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '0.9rem 1.75rem', borderRadius: '50px' }}>
            <span>Track Order</span>
          </button>
        </form>
      </div>

      {/* Main Content View */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Fetching order status and route data...
        </div>
      ) : errorMsg ? (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)',
          padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto'
        }}>
          <AlertCircle size={48} color="var(--accent-danger)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Shipment Not Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{errorMsg}</p>
          <Link to="/shop" className="btn-primary">Return to Shop</Link>
        </div>
      ) : order ? (
        <ShippingTracker order={order} onAdvanceStatus={handleAdvanceStatus} />
      ) : (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto'
        }}>
          <PackageCheck size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Enter Your Tracking Number Above</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Check your order email confirmation receipt for your tracking ID (e.g. TRK-89341207).
          </p>
        </div>
      )}
    </div>
  );
}
