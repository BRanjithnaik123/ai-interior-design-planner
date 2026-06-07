'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, Check, ArrowLeft, Loader2, ArrowRight, Zap } from 'lucide-react';
import { createCheckoutSession, isLoggedIn } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const PLANS = [
  {
    name: 'Starter', price: '$13', period: '/month', annualNote: 'billed annually',
    description: 'For individuals getting started',
    credits: '300 Credits / month',
    features: ['$0.21 per Design', 'Access to all (100+) styles', 'Interior & exterior styles', '10 seconds turnaround', 'Unlimited cloud storage', 'Watermark'],
    highlight: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || 'starter',
  },
  {
    name: 'Professional', price: '$24', period: '/month', annualNote: 'billed annually',
    description: 'For flippers, solo agents & brokers',
    credits: '700 Credits / month',
    features: ['$0.18 per Design', 'Everything in Starter', 'Commercial Spaces & Styles', 'Early access to features', 'Commercial License', '10 seconds turnaround', 'No Watermark'],
    highlight: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL || 'professional',
  },
  {
    name: 'Business', price: '$99', period: '/month', annualNote: 'billed annually',
    description: 'For teams and agencies',
    credits: '3000 Credits / month',
    features: ['$0.17 per Design', 'Everything in Professional', 'Ultra Quality 4K Renders', 'Priority Support & Coaching', 'API Access on Request', 'Dedicated GPU Server', 'Custom Watermark'],
    highlight: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS || 'business',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      refreshUser();
      router.replace('/pricing');
    }
  }, [searchParams, router, refreshUser]);

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    setLoading(planName);
    try {
      const result = await createCheckoutSession(priceId, planName);
      if (result.url) window.location.href = result.url;
    } catch (error: any) {
      alert(error.message || 'Failed to create checkout session');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── HEADER ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
          <ArrowLeft style={{ width: 18, height: 18 }} /> Back
        </Link>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--gradient-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles style={{ width: 18, height: 18, color: '#fff' }} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800 }}>DESIGNAI</span>
        </Link>
        <Link href="/login" style={{
          padding: '8px 20px', borderRadius: 8, fontSize: 14,
          border: '1px solid var(--border-light)', color: 'var(--text-secondary)',
        }}>Log in</Link>
      </header>

      {/* ── SUCCESS BANNER ── */}
      {showSuccess && (
        <div style={{
          maxWidth: 600, margin: '20px auto', padding: 16, borderRadius: 12,
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
          color: '#10b981', textAlign: 'center', fontSize: 14, fontWeight: 500,
        }}>
          🎉 Thank you for subscribing! Your account has been upgraded.
        </div>
      )}

      {/* ── CONTENT ── */}
      <main style={{ padding: '60px 24px 100px' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 48px' }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 500,
              background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
              color: 'var(--primary-light)',
            }}>
              <Zap style={{ width: 14, height: 14 }} />
              Simple, transparent pricing
            </span>
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 800, marginBottom: 12, letterSpacing: '-1.5px' }}>
            There&apos;s a plan for everyone
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
            Easily start renovating your space with our advanced AI technology
          </p>

          {/* Billing Toggle */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 32,
            padding: 4, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)',
          }}>
            {(['monthly', 'annual'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: '10px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                border: 'none', cursor: 'pointer',
                background: billing === b ? 'var(--gradient-brand)' : 'transparent',
                color: billing === b ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}>
                {b === 'monthly' ? 'Monthly' : 'Annual'}
                {b === 'annual' && <span style={{ fontSize: 11, marginLeft: 6, color: billing === b ? 'rgba(255,255,255,0.8)' : 'var(--success)' }}>Save 20%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* CARDS */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 24, maxWidth: 1050, margin: '0 auto', alignItems: 'start',
        }}>
          {PLANS.map((plan, i) => (
            <div key={i} className="card" style={{
              padding: 36, position: 'relative',
              border: plan.highlight ? '1px solid var(--primary)' : undefined,
              boxShadow: plan.highlight ? 'var(--shadow-glow)' : undefined,
              transform: plan.highlight ? 'scale(1.03)' : 'none',
            }}>
              {plan.highlight && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--gradient-brand)', color: '#fff',
                  padding: '5px 20px', borderRadius: 9999, fontSize: 12, fontWeight: 700,
                }}>Most Popular</div>
              )}

              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{plan.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>{plan.description}</p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 48, fontWeight: 800 }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{plan.annualNote}</p>
              <p style={{ fontSize: 13, color: 'var(--primary-light)', marginBottom: 24, fontWeight: 600 }}>{plan.credits}</p>

              <button
                onClick={() => handleSubscribe(plan.priceId, plan.name)}
                disabled={loading === plan.name}
                className={plan.highlight ? 'btn-primary' : 'btn-secondary'}
                style={{
                  width: '100%', marginBottom: 28,
                  opacity: loading === plan.name ? 0.7 : 1,
                }}
              >
                {loading === plan.name ? (
                  <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Processing...</>
                ) : (
                  <>Buy Now <ArrowRight style={{ width: 16, height: 16 }} /></>
                )}
              </button>

              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Cancel anytime</p>

              <ul style={{ listStyle: 'none', padding: 0 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                    fontSize: 14, color: 'var(--text-secondary)',
                  }}>
                    <Check style={{ width: 16, height: 16, color: 'var(--success)', flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
