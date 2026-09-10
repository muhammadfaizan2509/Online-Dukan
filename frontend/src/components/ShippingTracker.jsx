import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, Truck, PackageCheck, MapPin, 
  Home, RefreshCw, Copy, Check, ExternalLink, ShieldCheck, ChevronRight
} from 'lucide-react';

export default function ShippingTracker({ order, onAdvanceStatus }) {
  const [copied, setCopied] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const STAGES = [
    { title: "Order Placed", icon: Clock, desc: "Payment verified & order created" },
    { title: "Processing", icon: PackageCheck, desc: "Packed & quality inspected" },
    { title: "Shipped", icon: Truck, desc: "Departed sorting facility in transit" },
    { title: "Out for Delivery", icon: MapPin, desc: "With local courier driver" },
    { title: "Delivered", icon: Home, desc: "Package delivered & signed" }
  ];

  const getCurrentStepIndex = () => {
    const currentStatus = order?.shipping_status || "Order Placed";
    const idx = STAGES.findIndex(s => s.title.toLowerCase() === currentStatus.toLowerCase());
    return idx >= 0 ? idx : 0;
  };

  const currentStep = getCurrentStepIndex();

  const handleCopyTracking = () => {
    if (order?.tracking_number) {
      navigator.clipboard.writeText(order.tracking_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAdvanceClick = async () => {
    setAdvancing(true);
    await onAdvanceStatus(order.id);
    setAdvancing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Tracking Header Card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-featured">{order.carrier || 'FedEx Express'}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status:</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                {order.shipping_status}
              </span>
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Tracking #{order.tracking_number}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={handleCopyTracking} style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                {copied ? <Check size={14} color="var(--accent-success)" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Placed on: {order.created_at || 'Just now'}
              </span>
            </div>
          </div>

          {/* Delivery Date & Simulation Trigger */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.75rem'
          }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Estimated Delivery
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {order.estimated_delivery || 'In 3-5 Days'}
              </div>
            </div>

            {/* Live Simulation Trigger Button */}
            {currentStep < STAGES.length - 1 && (
              <button onClick={handleAdvanceClick} disabled={advancing} style={{
                background: 'var(--accent-gradient)',
                color: '#fff',
                border: 'none',
                padding: '0.55rem 1rem',
                borderRadius: '50px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: 'var(--shadow-glow)'
              }}>
                <RefreshCw size={14} className={advancing ? "spin" : ""} style={{ animation: advancing ? 'spin 1s linear infinite' : 'none' }} />
                <span>Simulate Next Step ({STAGES[currentStep + 1].title})</span>
              </button>
            )}
          </div>
        </div>

        {/* 5-Stage Interactive Milestone Progress Bar */}
        <div style={{ position: 'relative', margin: '2.5rem 1rem 1rem' }}>
          {/* Connector Line Background */}
          <div style={{
            position: 'absolute',
            top: '22px',
            left: '30px',
            right: '30px',
            height: '4px',
            background: 'var(--bg-input)',
            zIndex: 1
          }} />

          {/* Active Colored Connector Line */}
          <div style={{
            position: 'absolute',
            top: '22px',
            left: '30px',
            width: `calc(${(currentStep / (STAGES.length - 1)) * 100}% - 40px)`,
            height: '4px',
            background: 'var(--accent-gradient)',
            zIndex: 2,
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />

          {/* Stages Circles */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 3
          }}>
            {STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStep;
              const isCurrent = idx === currentStep;
              const StageIcon = stage.icon;

              return (
                <div key={idx} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '120px'
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: isCurrent 
                      ? 'var(--accent-gradient)' 
                      : isCompleted 
                        ? 'var(--accent-success)' 
                        : 'var(--bg-input)',
                    border: isCurrent 
                      ? '3px solid rgba(255,255,255,0.4)' 
                      : '2px solid var(--border-color)',
                    color: isCurrent || isCompleted ? '#fff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isCurrent ? 'var(--shadow-glow)' : 'none',
                    transition: 'var(--transition-smooth)'
                  }}>
                    {isCompleted ? <CheckCircle2 size={22} /> : <StageIcon size={20} />}
                  </div>

                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: isCurrent ? 800 : 600,
                    color: isCurrent ? 'var(--accent-primary)' : isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                    marginTop: '0.65rem',
                    textAlign: 'center'
                  }}>
                    {stage.title}
                  </span>

                  <span style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                    marginTop: '0.2rem'
                  }}>
                    {stage.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid Layout for Live Route Visualizer & Detailed Timeline */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {/* Visual Map Route Simulation Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} color="var(--accent-primary)" /> Live Shipment Route Visualizer
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Package GPS dispatch updates provided by {order.carrier}.
            </p>
          </div>

          {/* SVG Map Graphic Representation */}
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Background Grid Pattern */}
            <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.15 }}>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Dashed Route Line */}
            <svg width="80%" height="60" style={{ position: 'relative', zIndex: 2 }}>
              <path d="M 10 30 Q 120 5 230 30 T 350 30" fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeDasharray="6 6"/>
            </svg>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              position: 'relative',
              zIndex: 3,
              marginTop: '1rem',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                <MapPin size={14} color="var(--accent-gold)" /> Dispatch Center (NY)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-primary)' }}>
                <Home size={14} color="var(--accent-success)" /> Destination Address
              </div>
            </div>
          </div>

          {/* Shipping Address Summary */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.85rem'
          }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              Shipping To: {order.customer_name}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              {order.shipping_address?.address}, {order.shipping_address?.city}, {order.shipping_address?.zip_code}, {order.shipping_address?.country}
            </div>
          </div>
        </div>

        {/* Detailed Status Logs Timeline */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem'
        }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--accent-gold)" /> Shipping Status Activity Log
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {order.shipping_timeline && order.shipping_timeline.map((update, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                <div style={{
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: i === order.shipping_timeline.length - 1 ? 'var(--accent-primary)' : 'var(--text-muted)',
                  marginTop: '0.35rem', flexShrink: 0
                }} />
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {update.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      • {update.location}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>
                    {update.message}
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {update.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
