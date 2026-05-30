'use client';

import { useState } from 'react';

/**
 * ProGate — SecLab Nigeria Pro Upgrade Modal
 * Uses Paystack for Nigerian Naira payments.
 * Variants:
 *   - "compact" — small lock badge that opens modal
 *   - "card" — full feature card with CTA
 *   - "banner" — top-of-page upsell banner (dismissible)
 */
interface ProGateProps {
  variant?: 'compact' | 'card' | 'banner';
  title?: string;
  description?: string;
  feature?: string;
  tier?: 'pro' | 'elite';
  onDismiss?: () => void;
}

const TIERS = {
  pro: {
    name: 'Pro',
    price: '₦10,000',
    period: '/mo',
    color: '#00c9a7',
    bg: 'rgba(0,201,167,0.06)',
    border: 'rgba(0,201,167,0.2)',
    features: [
      '🔒 Access 50+ Private Challenges',
      '💡 Unlimited Hint Unlocks',
      '📊 Advanced Write-up Analytics',
      '🏆 Private CTF Leaderboard',
      '⚡ Early Access to New Labs',
    ],
  },
  elite: {
    name: 'Elite',
    price: '₦25,000',
    period: '/mo',
    color: '#f0a500',
    bg: 'rgba(240,165,0,0.06)',
    border: 'rgba(240,165,0,0.2)',
    features: [
      '🔒 All Pro Features',
      '🎯 Exclusive Elite Challenges',
      '📜 Named Certificate on Completion',
      '💬 Private Discord Community',
      '🚀 Priority Support',
    ],
  },
};

export default function ProGate({
  variant = 'compact',
  title,
  description,
  feature,
  tier = 'pro',
  onDismiss,
}: ProGateProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'pro' | 'elite'>('pro');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const t = TIERS[tier];

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleCheckout() {
    // Get email from user if not set
    const userEmail = email || (typeof window !== 'undefined' ? localStorage.getItem('seclab_user_email') || '' : '');
    if (!validateEmail(userEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setEmailError('');
    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('seclab_user_id') || '' : '';
      const username = typeof window !== 'undefined' ? localStorage.getItem('seclab_username') || '' : '';

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierName: selectedTier === 'pro' ? 'Pro' : 'Elite',
          email: userEmail,
          name: username,
          userId,
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        // Save email for webhook correlation
        if (typeof window !== 'undefined') {
          localStorage.setItem('seclab_user_email', userEmail);
        }
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || 'Failed to create checkout. Please try again.');
      }
    } catch {
      alert('Failed to create checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (variant === 'banner') {
    return (
      <div className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center gap-5"
        style={{ background: t.bg, border: `1px solid ${t.border}`, borderLeft: `4px solid ${t.color}` }}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest" style={{ color: t.color }}>
              ⭐ SecLab Pro
            </span>
          </div>
          <p className="font-display font-bold text-base mb-1" style={{ color: 'var(--text)' }}>
            {title || 'Unlock Private Challenges & Pro Features'}
          </p>
          <p className="font-mono text-xs" style={{ color: 'var(--text-3)' }}>
            {description || 'Get access to exclusive challenges, unlimited hints, and advanced analytics.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onDismiss && (
            <button onClick={onDismiss} className="font-mono text-xs px-3 py-2 rounded-lg"
              style={{ color: 'var(--text-3)', border: '1px solid var(--border)' }}>
              Maybe Later
            </button>
          )}
          <button
            onClick={() => setOpen(true)}
            className="font-mono text-xs px-5 py-2.5 rounded-lg font-semibold transition-all"
            style={{ background: t.color, color: '#000', boxShadow: `0 0 20px ${t.color}33` }}>
            Upgrade for {t.price}{t.period}
          </button>
        </div>
        {open && <UpgradeModal open={open} onClose={() => setOpen(false)} selectedTier={selectedTier} onSelectTier={setSelectedTier} onCheckout={handleCheckout} loading={loading} email={email} setEmail={setEmail} emailError={emailError} setEmailError={setEmailError} />}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <>
<div className="card p-6 rounded-2xl text-center"
          style={{ background: t.bg, border: `1px solid ${t.border}` }}>
          <div className="text-4xl mb-3">🔐</div>
          <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>
            {title || '🔒 Pro Feature Locked'}
          </h3>
          <p className="font-mono text-sm mb-5" style={{ color: 'var(--text-3)' }}>
            {description || `${feature || 'This feature'} is available to SecLab Pro members.`}
          </p>
          <button onClick={() => setOpen(true)}
            className="w-full font-mono text-sm py-3 rounded-xl font-semibold transition-all"
            style={{ background: t.color, color: '#000', boxShadow: `0 0 20px ${t.color}33` }}>
            Unlock Pro — {t.price}{t.period}
          </button>
          <p className="font-mono text-[10px] mt-2" style={{ color: 'var(--text-4)' }}>
            Cancel anytime · Secure payment via Paystack
          </p>
        </div>
        {open && <UpgradeModal open={open} onClose={() => setOpen(false)} selectedTier={selectedTier} onSelectTier={setSelectedTier} onCheckout={handleCheckout} loading={loading} email={email} setEmail={setEmail} emailError={emailError} setEmailError={setEmailError} />}
      </>
    );
  }

  // compact: just a lock badge
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-1 rounded-md"
        style={{ background: t.bg, color: t.color, border: `1px solid ${t.border}` }}>
        <span>🔒</span>
        <span>PRO</span>
      </button>
      {open && <UpgradeModal open={open} onClose={() => setOpen(false)} selectedTier={selectedTier} onSelectTier={setSelectedTier} onCheckout={handleCheckout} loading={loading} email={email} setEmail={setEmail} emailError={emailError} setEmailError={setEmailError} />}
    </>
  );
}

// ── Internal Modal ─────────────────────────────────────────────────────

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  selectedTier: 'pro' | 'elite';
  onSelectTier: (t: 'pro' | 'elite') => void;
  onCheckout: () => void;
  loading: boolean;
  email: string;
  setEmail: (e: string) => void;
  emailError: string;
  setEmailError: (e: string) => void;
}

function UpgradeModal({ open, onClose, selectedTier, onSelectTier, onCheckout, loading, email, setEmail, emailError, setEmailError }: UpgradeModalProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl p-6 relative"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>

        <button onClick={onClose} className="absolute top-4 right-4 font-mono text-sm"
          style={{ color: 'var(--text-3)' }}>✕</button>

        <div className="text-center mb-6">
          <div className="text-3xl mb-2">⚡</div>
          <h2 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text)' }}>
            Go <span style={{ color: '#00c9a7' }}>Pro</span>
          </h2>
          <p className="font-mono text-sm" style={{ color: 'var(--text-3)' }}>
            Unlock the full SecLab Nigeria experience
</p>
        </div>

        {/* Tier selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {(['pro', 'elite'] as const).map(key => {
            const tier = TIERS[key];
            const isSelected = selectedTier === key;
            return (
              <button key={key}
                onClick={() => onSelectTier(key)}
                className="p-4 rounded-xl text-left transition-all"
                style={{
                  background: isSelected ? tier.bg : 'var(--surface-3)',
                  border: `2px solid ${isSelected ? tier.color : 'var(--border)'}`,
                }}>
<div className="flex items-center justify-between mb-2">
                  <span className="font-display font-bold" style={{ color: isSelected ? tier.color : 'var(--text)' }}>
                    {tier.name}
                  </span>
                  {isSelected && <span style={{ color: tier.color }}>✓</span>}
                </div>
                <div className="font-mono text-xl font-bold mb-2" style={{ color: isSelected ? tier.color : 'var(--text)' }}>
                  {tier.price}<span className="text-xs font-normal" style={{ color: 'var(--text-3)' }}>{tier.period}</span>
                </div>
                <ul className="space-y-1">
                  {tier.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="font-mono text-[10px]" style={{ color: 'var(--text-3)' }}>{f}</li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Email input */}
        <div className="mb-4">
          <label className="font-mono text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-3)' }}>
            Email for payment receipt
          </label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailError(''); }}
            placeholder="you@example.com"
            className="input w-full"
            style={{ height: '44px' }}
          />
          {emailError && (
            <p className="font-mono text-[10px] mt-1" style={{ color: '#f05252' }}>{emailError}</p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={onCheckout}
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-mono text-sm font-semibold transition-all flex items-center justify-center gap-2"
          style={{
            background: TIERS[selectedTier].color,
            color: '#000',
            boxShadow: `0 0 30px ${TIERS[selectedTier].color}40`,
            opacity: loading ? 0.7 : 1,
          }}>
          {loading ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1V4M8 12V15M1 8H4M12 8H15M3.05 3.05L5.28 5.28M10.72 10.72L12.95 12.95M3.05 12.95L5.28 10.72M10.72 5.28L12.95 3.05"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Redirecting to Paystack...
            </>
          ) : (
            <>Pay {TIERS[selectedTier].price}/mo with Paystack</>
          )}
        </button>

        <p className="text-center font-mono text-[10px] mt-3" style={{ color: 'var(--text-4)' }}>
          🔒 Secured by Paystack · Cancel anytime · NGN payments
        </p>
      </div>
    </div>
  );
}
