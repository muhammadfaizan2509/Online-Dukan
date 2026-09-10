import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, AlertCircle, Sparkles, Loader2 } from 'lucide-react';

export default function PaymentModal({ amount, onPaymentSuccess, onCancel }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  // Format Expiration Date (MM/YY)
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setExpiry(val);
  };

  // Autofill Test Stripe Card
  const fillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardHolder('ALEX R. JOHNSON');
    setExpiry('12/28');
    setCvv('789');
    setErrorMsg('');
  };

  // Card Type Detector
  const getCardType = () => {
    const num = cardNumber.replace(/\s/g, '');
    if (num.startsWith('4')) return 'VISA';
    if (num.startsWith('5')) return 'MASTERCARD';
    if (num.startsWith('3')) return 'AMEX';
    return 'CARD';
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const rawCard = cardNumber.replace(/\s/g, '');
    if (rawCard.length < 16) {
      setErrorMsg('Please enter a valid 16-digit credit card number.');
      return;
    }
    if (!cardHolder.trim()) {
      setErrorMsg('Please enter cardholder full name.');
      return;
    }
    if (expiry.length < 5) {
      setErrorMsg('Please enter valid expiration date (MM/YY).');
      return;
    }
    if (cvv.length < 3) {
      setErrorMsg('Please enter a valid 3-digit CVV security code.');
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          currency: 'usd',
          card_number: rawCard,
          card_holder: cardHolder
        })
      });

      const data = await response.json();

      if (data.success) {
        setTimeout(() => {
          setProcessing(false);
          onPaymentSuccess(data);
        }, 1200);
      } else {
        setProcessing(false);
        setErrorMsg(data.error || 'Payment authorization failed.');
      }
    } catch (err) {
      setProcessing(false);
      setErrorMsg('Network error connecting to payment gateway server.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '480px',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative'
      }} className="animate-fade">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={22} color="var(--accent-success)" />
              <h3 style={{ fontSize: '1.25rem' }}>Stripe Secure Checkout</h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              256-Bit Bank Level Encryption
            </span>
          </div>

          <button onClick={fillTestCard} type="button" style={{
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: 'var(--accent-primary)',
            padding: '0.35rem 0.75rem',
            borderRadius: '50px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Sparkles size={14} /> Auto-Fill Test Card
          </button>
        </div>

        {/* Holographic Credit Card Graphic Visualizer */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          borderRadius: '16px',
          padding: '1.4rem',
          color: '#fff',
          marginBottom: '1.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Card Shine */}
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.15), transparent 70%)'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '42px', height: '30px', background: 'gold', borderRadius: '6px',
              border: '1px solid rgba(0,0,0,0.2)', opacity: 0.85
            }} />
            <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.1em' }}>
              {getCardType()}
            </span>
          </div>

          <div style={{
            fontSize: '1.25rem',
            fontFamily: 'monospace',
            letterSpacing: '0.18em',
            marginBottom: '1.2rem',
            wordSpacing: '0.3em'
          }}>
            {cardNumber || '•••• •••• •••• ••••'}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.85 }}>
            <div>
              <div style={{ fontSize: '0.6rem', opacity: 0.7 }}>CARDHOLDER</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{cardHolder || 'FULL NAME'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', opacity: 0.7 }}>EXPIRES</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{expiry || 'MM/YY'}</div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmitPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Card Number
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem 0.7rem 2.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontFamily: 'monospace',
                  fontSize: '0.95rem'
                }}
              />
              <CreditCard size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Cardholder Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. Alex Johnson"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              required
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Expiration Date
              </label>
              <input 
                type="text" 
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                CVV Code
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  placeholder="123"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem 0.7rem 2.2rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace'
                  }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onCancel} disabled={processing} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={processing} className="btn-primary" style={{ flex: 2 }}>
              {processing ? (
                <>
                  <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Processing...
                </>
              ) : (
                <>
                  <Lock size={16} /> Pay ₨ {amount.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
