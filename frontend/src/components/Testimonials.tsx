'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, BadgeCheck } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Taber Metcalf', text: "I'm obsessed with DesignAI! I used it to remodel my kitchen, and the AI tools made everything so easy. The results are absolutely stunning!", role: 'Homeowner', color: '#7c3aed' },
  { name: 'Jamie K.', text: "With DesignAI, I was able to visualize renovations instantly. No appointments with designers needed — just upload and go!", role: 'Interior Designer', color: '#06b6d4' },
  { name: 'Adam Pierra', text: "As a new homeowner, DesignAI revolutionized my entire renovation process. The AI suggestions are incredibly accurate.", role: 'New Homeowner', color: '#10b981' },
  { name: 'Jessica M.', text: "The AI-powered design suggestions are spot on. It saved me thousands in design consultation fees. A must-have tool!", role: 'Architect', color: '#f59e0b' },
  { name: 'David Chen', text: "I've tried many design tools, but DesignAI is the only one that produces truly photorealistic results. Game changer.", role: 'Real Estate Agent', color: '#ec4899' },
  { name: 'Sarah L.', text: "Used DesignAI for our entire office renovation. The team loved being able to vote on different style options before committing.", role: 'Project Manager', color: '#8b5cf6' },
  { name: 'Michael R.', text: "The speed is incredible. I can show clients 10 different design options in the time it used to take for one.", role: 'Contractor', color: '#ef4444' },
  { name: 'Emma T.', text: "From Scandinavian to Industrial, every style looks incredibly realistic. My clients are always impressed by the renders.", role: 'Home Stager', color: '#14b8a6' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
});

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div style={{
      minWidth: 340, maxWidth: 380, padding: 30,
      background: 'var(--bg-card)', borderRadius: 22,
      border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: 18,
      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      cursor: 'default', position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${t.color}40`;
        e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.2), 0 0 30px ${t.color}08`;
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Subtle top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${t.color}40, transparent)`,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} style={{ width: 14, height: 14, fill: '#facc15', color: '#facc15' }} />
          ))}
        </div>
        <Quote size={18} style={{ color: t.color, opacity: 0.3 }} />
      </div>
      <p style={{
        fontSize: 14, color: 'var(--text-secondary)',
        lineHeight: 1.85, fontStyle: 'italic', flex: 1,
      }}>
        &ldquo;{t.text}&rdquo;
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13,
          background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17, fontWeight: 700, color: '#fff',
          boxShadow: `0 4px 14px ${t.color}30`,
        }}>{t.name[0]}</div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            {t.name}
            <BadgeCheck size={14} style={{ color: '#3b82f6' }} />
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const row1 = TESTIMONIALS.slice(0, 4);
  const row2 = TESTIMONIALS.slice(4, 8);

  return (
    <section style={{ padding: '110px 0', background: 'var(--bg-secondary)', overflow: 'hidden', position: 'relative' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 800, height: 600,
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.04) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="badge" style={{ marginBottom: 16, display: 'inline-flex', gap: 6 }}>
            <Star size={12} style={{ fill: '#facc15', color: '#facc15' }} /> 4.9/5 from 2,000+ reviews
          </span>
          <h2 className="section-heading" style={{ marginBottom: 14 }}>
            Loved by <span className="gradient-text">thousands</span>
          </h2>
          <p className="section-subtext">
            See what homeowners, designers, and professionals say about DesignAI
          </p>
        </motion.div>
      </div>

      {/* Row 1 — scrolls left */}
      <motion.div {...fadeUp(0.1)} className="marquee-left" style={{
        marginBottom: 20,
        maskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
      }}>
        <div className="marquee-track" style={{ gap: 20 }}>
          {[...row1, ...row1, ...row1].map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </motion.div>

      {/* Row 2 — scrolls right */}
      <motion.div {...fadeUp(0.15)} className="marquee-right" style={{
        maskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
      }}>
        <div className="marquee-track" style={{ gap: 20 }}>
          {[...row2, ...row2, ...row2].map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
