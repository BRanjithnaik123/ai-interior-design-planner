'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Sparkles, Zap, Crown, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Starter', icon: Zap, color: '#06b6d4',
    monthly: 19, yearly: 13,
    credits: '300 Credits / month',
    features: ['$0.21 per Design', 'Access to all 100+ styles', 'Residential interior & exterior', '10 second turnaround', 'Unlimited cloud storage', 'Watermark on renders'],
  },
  {
    name: 'Professional', icon: Sparkles, popular: true, color: '#a78bfa',
    monthly: 34, yearly: 24,
    credits: '700 Credits / month',
    features: ['$0.18 per Design', 'Everything in Starter, plus:', 'Commercial spaces & styles', 'Early access to new features', 'Commercial license', 'No watermark'],
  },
  {
    name: 'Business', icon: Crown, color: '#f59e0b',
    monthly: 149, yearly: 99,
    credits: '3000 Credits / month',
    features: ['$0.17 per Design', 'Everything in Professional, plus:', 'Ultra Quality 4K renders', 'Priority support & coaching', 'API access on request', 'Custom watermark & branding'],
  },
];

const FAQ = [
  { q: 'What is DesignAI?', a: 'DesignAI uses advanced AI and generative models to help users visualize and plan their home renovation effortlessly, saving time, money, and hassle.' },
  { q: 'Who should use DesignAI?', a: 'Homeowners, renters, interior designers, real estate agents, contractors, and property developers looking to visualize renovation ideas.' },
  { q: 'How does AI help with renovations?', a: 'Upload a room photo. Our AI generates photorealistic renders in different styles within seconds, letting you preview before you commit.' },
  { q: 'How much does it cost?', a: 'We offer 5 free credits on signup. Paid plans start at $13/month (billed annually). No credit card required to start.' },
  { q: 'How fast are results generated?', a: 'Most renders complete within 10 seconds. Complex edits may take up to 30 seconds.' },
  { q: 'What spaces can I renovate?', a: 'Living rooms, bedrooms, kitchens, bathrooms, dining rooms, offices, exteriors, patios, landscapes — virtually any space.' },
  { q: 'Can I cancel anytime?', a: 'Yes! All plans are month-to-month with no contracts. You can cancel anytime from your account settings.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use enterprise-grade encryption and never share your photos or designs with third parties.' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
});

export default function PricingAndFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [yearly, setYearly] = useState(true);

  return (
    <>
      {/* ══════════ PRICING ══════════ */}
      <section id="pricing" style={{ padding: '110px 24px', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="badge" style={{ marginBottom: 16, display: 'inline-flex', gap: 6 }}>
              <Sparkles size={12} /> Transparent Pricing
            </span>
            <h2 className="section-heading" style={{ marginBottom: 14 }}>
              Plans for <span className="gradient-text">everyone</span>
            </h2>
            <p className="section-subtext" style={{ marginBottom: 36 }}>
              Start free, upgrade when you need more power
            </p>

            {/* Toggle */}
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '5px', borderRadius: 16,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
            }}>
              <button onClick={() => setYearly(false)} style={{
                padding: '11px 26px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                border: 'none', cursor: 'pointer',
                background: !yearly ? 'var(--gradient-brand)' : 'transparent',
                color: !yearly ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.3s',
              }}>Monthly</button>
              <button onClick={() => setYearly(true)} style={{
                padding: '11px 26px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                border: 'none', cursor: 'pointer',
                background: yearly ? 'var(--gradient-brand)' : 'transparent',
                color: yearly ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                Yearly
                <span style={{
                  padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                  background: yearly ? 'rgba(255,255,255,0.2)' : 'rgba(16,185,129,0.15)',
                  color: yearly ? '#fff' : 'var(--success)',
                }}>-30%</span>
              </button>
            </div>
          </motion.div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 24, alignItems: 'start',
          }}>
            {PLANS.map((plan, i) => {
              const price = yearly ? plan.yearly : plan.monthly;
              const Icon = plan.icon;
              return (
                <motion.div
                  key={i} {...fadeUp(i * 0.1)}
                  style={{
                    padding: 40, position: 'relative', overflow: 'hidden',
                    borderRadius: 24,
                    background: plan.popular
                      ? 'linear-gradient(145deg, rgba(124,58,237,0.08) 0%, var(--bg-card) 100%)'
                      : 'var(--bg-card)',
                    border: `1px solid ${plan.popular ? 'rgba(124,58,237,0.3)' : 'var(--border)'}`,
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    ...(plan.popular ? { transform: 'scale(1.03)' } : {}),
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.borderColor = `${plan.color}50`;
                    e.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,0.25), 0 0 40px ${plan.color}08`;
                    if (!plan.popular) e.currentTarget.style.transform = 'translateY(-4px)';
                    else e.currentTarget.style.transform = 'scale(1.03) translateY(-4px)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.borderColor = plan.popular ? 'rgba(124,58,237,0.3)' : 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = plan.popular ? 'scale(1.03)' : 'none';
                  }}
                >
                  {plan.popular && (
                    <div style={{
                      position: 'absolute', top: -1, left: 0, right: 0, height: 3,
                      background: 'var(--gradient-brand)',
                    }} />
                  )}
                  {plan.popular && (
                    <div style={{
                      position: 'absolute', top: 20, right: 20,
                      background: 'var(--gradient-brand)', color: '#fff',
                      padding: '5px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                    }}>Most Popular</div>
                  )}
                  <div style={{
                    width: 50, height: 50, borderRadius: 15, marginBottom: 20,
                    background: `${plan.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={22} style={{ color: plan.color }} />
                  </div>
                  <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.3px' }}>{plan.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                    <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-2px' }}>${price}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    per month{yearly ? ', billed annually' : ''}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 30, fontWeight: 600 }}>
                    {plan.credits}
                  </p>
                  <Link href="/register" className={plan.popular ? 'btn-primary' : 'btn-secondary'} style={{
                    width: '100%', textAlign: 'center', marginBottom: 10, borderRadius: 14,
                    padding: '14px 24px',
                  }}>Get Started</Link>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 28 }}>
                    Cancel anytime · No credit card required
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {plan.features.map((f, j) => (
                      <li key={j} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '7px 0', fontSize: 13, color: 'var(--text-secondary)',
                      }}>
                        <Check style={{ width: 16, height: 16, color: plan.color, flexShrink: 0, marginTop: 1 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="badge" style={{ marginBottom: 16, display: 'inline-flex', gap: 6 }}>
              <HelpCircle size={12} /> FAQ
            </span>
            <h2 className="section-heading" style={{ fontSize: 38 }}>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 14 }}>
              Everything you need to know about DesignAI
            </p>
          </motion.div>
          {FAQ.map((faq, i) => (
            <motion.div key={i} {...fadeUp(i * 0.03)} style={{
              borderBottom: '1px solid var(--border)',
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', padding: '22px 0', background: 'none', border: 'none',
                  color: 'var(--text)', fontSize: 15, fontWeight: 600, textAlign: 'left',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', gap: 16, transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-light)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: openFaq === i ? 'var(--primary-light)' : 'var(--text-muted)',
                    transition: 'color 0.3s',
                    minWidth: 22,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {faq.q}
                </span>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: openFaq === i ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s',
                }}>
                  <ChevronDown style={{
                    width: 16, height: 16,
                    color: openFaq === i ? 'var(--primary-light)' : 'var(--text-muted)',
                    transition: 'transform 0.3s',
                    transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                  }} />
                </div>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{
                      padding: '0 0 22px 42px', fontSize: 14,
                      color: 'var(--text-secondary)', lineHeight: 1.85,
                    }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
