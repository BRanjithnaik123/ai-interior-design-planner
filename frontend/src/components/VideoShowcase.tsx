'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
});

export default function VideoShowcase() {
  return (
    <section style={{
      padding: '120px 24px', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-secondary) 100%)',
    }}>
      {/* Ambient Glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 800, height: 500,
        background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
        filter: 'blur(100px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>
            <Play size={14} /> Watch the Magic
          </span>
          <h2 className="section-heading" style={{ marginBottom: 14 }}>
            See stunning <span className="gradient-text">transformations</span>
          </h2>
          <p className="section-subtext">
            Watch real rooms transform with AI — from dull interiors to dream spaces in seconds
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div {...fadeUp(0.15)} style={{
          borderRadius: 24, overflow: 'hidden', position: 'relative',
          border: '1px solid var(--border-accent)',
          boxShadow: '0 30px 100px rgba(124,58,237,0.15), 0 0 0 1px rgba(255,255,255,0.05)',
        }}>
          <div style={{ aspectRatio: '16/9', position: 'relative', background: '#000' }}>
            <iframe
              src="https://www.youtube.com/embed/8Lmp1Ncaa7Y?rel=0&modestbranding=1&color=white"
              title="DesignAI Home Renovation Showcase"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </motion.div>

        {/* Feature Highlights Below Video */}
        <motion.div {...fadeUp(0.25)} style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16, marginTop: 36,
        }}>
          {[
            { emoji: '🎨', title: 'Paint & Color', desc: 'Transform walls instantly' },
            { emoji: '🛋️', title: 'Interior Styling', desc: 'Refurnish any room' },
            { emoji: '🏠', title: 'Exterior Makeover', desc: 'Curb appeal upgrade' },
            { emoji: '📐', title: 'Layout Redesign', desc: 'Reimagine floor plans' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '20px', borderRadius: 16,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              textAlign: 'center', transition: 'all 0.3s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-accent)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.emoji}</div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item.title}</h4>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp(0.35)} style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/studio" className="btn-primary" style={{ padding: '16px 36px', fontSize: 16 }}>
            Try It Yourself <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
