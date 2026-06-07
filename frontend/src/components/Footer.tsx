'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowUp, Send, Heart } from 'lucide-react';

/* Inline social SVG icons — brand icons removed from lucide-react */
const SocialX = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768" /><path d="M13.277 10.723l6.723 -6.723" />
  </svg>
);
const SocialLinkedIn = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);
const SocialInstagram = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const SocialYouTube = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <>
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '80px 24px 36px',
        background: 'var(--bg-secondary)',
        position: 'relative',
      }}>
        {/* Subtle ambient glow */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          {/* Newsletter Banner */}
          <div style={{
            padding: '44px 48px', borderRadius: 24, marginBottom: 64,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.05) 100%)',
            border: '1px solid rgba(124,58,237,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 36, flexWrap: 'wrap',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -50, right: -50, width: 200, height: 200,
              background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)',
              borderRadius: '50%', pointerEvents: 'none',
            }} />
            <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>
                Stay ahead of design trends
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Get weekly AI design tips, inspiration, and product updates.
              </p>
            </div>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 10, flex: '0 0 auto', position: 'relative' }}>
              {subscribed ? (
                <div style={{
                  padding: '14px 28px', borderRadius: 14,
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                  color: 'var(--success)', fontSize: 14, fontWeight: 600,
                }}>
                  ✓ Subscribed successfully!
                </div>
              ) : (
                <>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{
                      padding: '14px 20px', borderRadius: 14, fontSize: 14,
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      color: 'var(--text)', outline: 'none', width: 260,
                      transition: 'border-color 0.25s, box-shadow 0.25s',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '14px 26px', gap: 6, borderRadius: 14 }}>
                    <Send size={16} /> Subscribe
                  </button>
                </>
              )}
            </form>
          </div>

          {/* Footer Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 40, marginBottom: 56,
          }}>
            {/* Brand */}
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: 'var(--gradient-brand)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.25)',
                }}>
                  <Sparkles style={{ width: 16, height: 16, color: '#fff' }} />
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }}>DESIGNAI</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 240, marginBottom: 22 }}>
                AI-powered interior design platform. Transform any space with photorealistic renders in seconds.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { icon: SocialX, href: '#', label: 'X (Twitter)' },
                  { icon: SocialLinkedIn, href: '#', label: 'LinkedIn' },
                  { icon: SocialInstagram, href: '#', label: 'Instagram' },
                  { icon: SocialYouTube, href: '#', label: 'YouTube' },
                ].map((s, i) => (
                  <a key={i} href={s.href} aria-label={s.label} style={{
                    width: 38, height: 38, borderRadius: 11,
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', transition: 'all 0.25s',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.color = 'var(--primary-light)';
                      e.currentTarget.style.background = 'rgba(124,58,237,0.08)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <s.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {[
              { title: 'Product', links: [
                { l: 'Features', h: '/features' }, { l: 'Studio', h: '/studio' },
                { l: 'Pricing', h: '/pricing' }, { l: 'Mobile App', h: '/mobile' },
                { l: 'API', h: '#' },
              ]},
              { title: 'Company', links: [
                { l: 'About Us', h: '/about' }, { l: 'Blog', h: '/blog' },
                { l: 'Careers', h: '#' }, { l: 'Enterprise', h: '/enterprise' },
                { l: 'Contact', h: '/contact' },
              ]},
              { title: 'Resources', links: [
                { l: 'Help Center', h: '#' }, { l: 'Design Guide', h: '#' },
                { l: 'Tutorials', h: '#' }, { l: 'Community', h: '#' },
              ]},
              { title: 'Legal', links: [
                { l: 'Privacy Policy', h: '#' }, { l: 'Terms of Service', h: '#' },
                { l: 'Cookie Policy', h: '#' },
              ]},
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{
                  fontSize: 12, fontWeight: 700, marginBottom: 18,
                  textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-secondary)',
                }}>{col.title}</h4>
                {col.links.map((link, j) => (
                  <Link key={j} href={link.h} style={{
                    display: 'block', fontSize: 14, color: 'var(--text-muted)',
                    marginBottom: 14, transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.transform = 'translateX(3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                  >{link.l}</Link>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div style={{
            paddingTop: 28, borderTop: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16,
          }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} DesignAI Studio. All rights reserved.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              Made with <Heart size={12} style={{ color: '#ef4444', fill: '#ef4444' }} /> and AI
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top - animated visibility */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 50,
          width: 46, height: 46, borderRadius: 14,
          background: 'rgba(14,14,20,0.9)', backdropFilter: 'blur(12px)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-muted)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: showBackToTop ? 1 : 0,
          transform: showBackToTop ? 'translateY(0)' : 'translateY(16px)',
          pointerEvents: showBackToTop ? 'auto' : 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.color = 'var(--primary-light)';
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4), 0 0 20px rgba(124,58,237,0.1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.transform = showBackToTop ? 'translateY(0)' : 'translateY(16px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
        }}
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
}
