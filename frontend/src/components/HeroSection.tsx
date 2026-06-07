'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Palette, Clock, Users, Play } from 'lucide-react';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] },
});

function useCounter(target: number, duration = 2000, suffix = '') {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { ref, display: `${count.toLocaleString()}${suffix}` };
}

const STATS = [
  { icon: Zap, target: 50000, suffix: '+', label: 'Rooms Transformed' },
  { icon: Palette, target: 100, suffix: '+', label: 'Design Styles' },
  { icon: Clock, target: 10, suffix: 's', label: 'Average Render' },
  { icon: Users, target: 98, suffix: '%', label: 'Satisfaction Rate' },
];

/* ── Pre-computed particles (deterministic to avoid SSR hydration mismatch) ── */
const PARTICLES = [
  { left: 12, top: 8,  opacity: 0.35, dur: 7.2, delay: -1.3 },
  { left: 87, top: 23, opacity: 0.28, dur: 5.8, delay: -3.7 },
  { left: 34, top: 61, opacity: 0.42, dur: 9.1, delay: -0.5 },
  { left: 56, top: 14, opacity: 0.31, dur: 6.4, delay: -2.9 },
  { left: 78, top: 72, opacity: 0.38, dur: 8.3, delay: -4.1 },
  { left: 5,  top: 45, opacity: 0.25, dur: 5.2, delay: -1.8 },
  { left: 92, top: 55, opacity: 0.44, dur: 7.7, delay: -3.2 },
  { left: 41, top: 89, opacity: 0.33, dur: 6.9, delay: -0.9 },
  { left: 23, top: 33, opacity: 0.29, dur: 9.5, delay: -4.6 },
  { left: 66, top: 4,  opacity: 0.40, dur: 5.6, delay: -2.1 },
  { left: 48, top: 78, opacity: 0.36, dur: 8.0, delay: -3.5 },
  { left: 15, top: 92, opacity: 0.27, dur: 7.1, delay: -1.1 },
  { left: 73, top: 41, opacity: 0.43, dur: 6.2, delay: -4.8 },
  { left: 30, top: 18, opacity: 0.32, dur: 9.8, delay: -2.4 },
  { left: 95, top: 67, opacity: 0.37, dur: 5.4, delay: -0.2 },
  { left: 8,  top: 75, opacity: 0.26, dur: 8.6, delay: -3.9 },
  { left: 59, top: 50, opacity: 0.41, dur: 7.5, delay: -1.6 },
  { left: 82, top: 12, opacity: 0.30, dur: 6.7, delay: -4.3 },
  { left: 19, top: 58, opacity: 0.45, dur: 9.3, delay: -2.7 },
  { left: 50, top: 35, opacity: 0.34, dur: 5.9, delay: -0.7 },
];

const TRUST_LOGOS = [
  'Architectural Digest', 'Houzz', 'Dezeen', 'Dwell',
  'Better Homes', 'House Beautiful', 'HGTV', 'Real Simple',
];

export default function HeroSection() {
  return (
    <section style={{
      paddingTop: 120, paddingBottom: 60, textAlign: 'center',
      position: 'relative', overflow: 'hidden',
      background: 'var(--gradient-hero)',
    }}>
      {/* ── Mesh gradient background ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%', width: 800, height: 800,
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)',
          filter: 'blur(60px)', animation: 'float 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '0%', right: '-5%', width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%)',
          filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite', animationDelay: '-3s',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '25%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 65%)',
          filter: 'blur(60px)', animation: 'float 12s ease-in-out infinite', animationDelay: '-6s',
        }} />
        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 40%, black 20%, transparent 70%)',
        }} />
      </div>

      {/* ── Floating particles (static values — no Math.random() during render) ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {PARTICLES.map((p, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2,
            borderRadius: '50%',
            background: `rgba(${i % 2 === 0 ? '124,58,237' : '6,182,212'}, ${p.opacity})`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animation: `float ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }} />
        ))}
      </div>

      {/* ── Top Badge ── */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 28, position: 'relative' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 13, fontWeight: 600, padding: '10px 22px',
          borderRadius: 9999,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
          border: '1px solid rgba(124,58,237,0.25)',
          color: 'var(--primary-light)',
          boxShadow: '0 0 30px rgba(124,58,237,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
        }}>
          <Sparkles size={14} style={{ color: '#a78bfa' }} />
          #1 AI Interior Design Platform — Powered by GPT-5.2 Vision
        </span>
      </motion.div>

      {/* ── Headline ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <motion.h1 {...fadeUp(0.08)} style={{
          fontSize: 'clamp(38px, 6.5vw, 82px)', fontWeight: 900,
          lineHeight: 1.04, letterSpacing: '-3px', marginBottom: 22,
        }}>
          Redesign any room
          <br />
          <span className="gradient-text" style={{ display: 'inline' }}>
            in seconds with AI.
          </span>
        </motion.h1>
        <motion.p {...fadeUp(0.14)} style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-secondary)',
          lineHeight: 1.75, maxWidth: 580, margin: '0 auto',
        }}>
          Upload a photo of any space, choose a style,
          and get structure-preserving photorealistic renders — powered by GPT-5.2.
        </motion.p>
      </div>

      {/* ── CTA Buttons ── */}
      <motion.div {...fadeUp(0.2)} style={{
        display: 'flex', gap: 14, justifyContent: 'center',
        marginTop: 40, flexWrap: 'wrap', padding: '0 24px',
      }}>
        <a
          href="#ai-redesign"
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById('ai-redesign');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => {
                el.style.transition = 'box-shadow 0.5s ease-in-out';
                el.style.boxShadow = '0 0 0 4px var(--primary), 0 0 40px rgba(124,58,237,0.3)';
                setTimeout(() => { el.style.boxShadow = 'none'; }, 1500);
              }, 500);
            }
          }}
          className="btn-primary"
          style={{
            fontSize: 17, padding: '18px 44px', borderRadius: 14,
            boxShadow: '0 8px 32px rgba(124,58,237,0.35), 0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          Start Designing Free <ArrowRight size={20} />
        </a>
        <Link href="/studio" className="btn-secondary" style={{
          fontSize: 17, padding: '18px 36px', borderRadius: 14,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          backdropFilter: 'blur(10px)',
        }}>
          <Play size={16} /> Watch Demo
        </Link>
      </motion.div>

      <motion.p {...fadeUp(0.25)} style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 18 }}>
        No credit card required · 5 free renders · Cancel anytime
      </motion.p>

      {/* ── Stats Counter Strip ── */}
      <motion.div {...fadeUp(0.28)} style={{
        maxWidth: 820, margin: '52px auto 0', padding: '0 24px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14,
      }}>
        {STATS.map((stat, i) => {
          const counter = useCounter(stat.target, 2000, stat.suffix);
          const Icon = stat.icon;
          return (
            <div key={i} ref={counter.ref} style={{
              padding: '20px 8px', borderRadius: 18,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Icon size={18} style={{ color: 'var(--primary-light)', margin: '0 auto 8px' }} />
              <div style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, letterSpacing: '-1px' }}>
                {counter.display}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
            </div>
          );
        })}
      </motion.div>

      {/* ── Before/After Showcase ── */}
      <motion.div {...fadeUp(0.32)} style={{
        maxWidth: 1080, margin: '56px auto 0', padding: '0 24px',
      }}>
        <div style={{
          borderRadius: 20, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4), 0 0 60px rgba(124,58,237,0.06)',
        }}>
          <BeforeAfterSlider
            leftSrc="/images/hero-after.png"
            rightSrc="/images/hero-before.png"
            leftLabel="AI REDESIGNED"
            rightLabel="ORIGINAL ROOM"
            height={520}
            priority={true}
          />
        </div>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
          ← Drag the slider to see the AI transformation →
        </p>
      </motion.div>

      {/* ── Trusted By Marquee ── */}
      <motion.div {...fadeUp(0.36)} style={{ marginTop: 64, overflow: 'hidden' }}>
        <p style={{
          fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: 3, color: 'var(--text-muted)', marginBottom: 22,
        }}>
          Trusted by 50,000+ design professionals worldwide
        </p>
        <div className="marquee-left" style={{
          maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
        }}>
          <div className="marquee-track">
            {[...TRUST_LOGOS, ...TRUST_LOGOS].map((logo, i) => (
              <span key={i} style={{
                fontSize: 17, fontWeight: 700, color: 'var(--text-muted)',
                opacity: 0.35, whiteSpace: 'nowrap', padding: '0 12px',
                letterSpacing: '-0.3px',
              }}>{logo}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
