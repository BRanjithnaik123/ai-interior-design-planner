'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight, ExternalLink, Zap, Users, Palette, Clock, Upload,
  Sparkles, Shield, Globe, Cpu,
} from 'lucide-react';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AIRedesign from '@/components/AIRedesign';
import AIToolkit from '@/components/AIToolkit';
import Testimonials from '@/components/Testimonials';
import PricingAndFAQ from '@/components/PricingAndFAQ';
import Footer from '@/components/Footer';
import GalleryFilter from '@/components/GalleryFilter';
import ContactSection from '@/components/ContactSection';

/* ═══════ ANIMATION HELPER ═══════ */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
});

/* ═══════ DESIGN STYLES ═══════ */
const STYLES = [
  { name: 'Modern', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80' },
  { name: 'Minimalist', img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=80' },
  { name: 'Luxury', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80' },
  { name: 'Scandinavian', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80' },
  { name: 'Rustic', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80' },
  { name: 'Contemporary', img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&q=80' },
  { name: 'Industrial', img: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400&q=80' },
  { name: 'Traditional', img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80' },
];

/* ═══════ PAGE ═══════ */
export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header />
      <HeroSection />

      {/* ═══════ SECTION DIVIDER ═══════ */}
      <div className="section-divider" />

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="how-it-works" style={{ padding: '110px 24px', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 800, height: 800,
          background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>
              <Sparkles size={12} /> Simple Process
            </span>
            <h2 className="section-heading" style={{ marginBottom: 14 }}>
              Three steps to your<br />
              <span className="gradient-text">dream space.</span>
            </h2>
            <p className="section-subtext">
              No design skills needed. Our AI handles the heavy lifting.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Upload Your Photo', desc: 'Capture or upload a photo of any room. Our AI analyzes the space, layout, and dimensions instantly.', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80', icon: Upload },
              { step: '02', title: 'Choose Your Style', desc: 'Browse 100+ curated design styles — Modern, Scandinavian, Industrial, Japandi, and more.', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&q=80', icon: Palette },
              { step: '03', title: 'Get AI Results', desc: 'AI generates photorealistic renders of your renovated space in under 10 seconds.', img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&q=80', icon: Zap },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} {...fadeUp(i * 0.12)} style={{
                  borderRadius: 22, overflow: 'hidden', position: 'relative',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(124,58,237,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
                    <Image src={item.img} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(20,20,30,0.85) 0%, rgba(20,20,30,0.2) 50%, transparent 100%)',
                    }} />
                    <div style={{
                      position: 'absolute', bottom: 18, left: 22,
                      fontSize: 56, fontWeight: 900, color: 'rgba(255,255,255,0.06)',
                      lineHeight: 1,
                    }}>{item.step}</div>
                  </div>
                  <div style={{ padding: '24px 28px 32px' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '6px 14px', borderRadius: 10,
                      background: 'rgba(124,58,237,0.1)', marginBottom: 14,
                      fontSize: 12, fontWeight: 600, color: 'var(--primary-light)',
                    }}>
                      <Icon size={13} /> STEP {item.step}
                    </div>
                    <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.3px' }}>{item.title}</h3>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ AI ROOM REDESIGN ═══════ */}
      <AIRedesign />

      {/* ═══════ FEATURES / AI TOOLKIT ═══════ */}
      <div id="features">
        <AIToolkit />
      </div>

      {/* ═══════ DESIGN STYLES SHOWCASE ═══════ */}
      <section style={{ padding: '100px 24px', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div {...fadeUp()} style={{ marginBottom: 48 }}>
            <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>
              <Palette size={12} /> 100+ Styles
            </span>
            <h2 className="section-heading" style={{ marginBottom: 14 }}>
              Find your perfect <span className="gradient-text">design style</span>
            </h2>
            <p className="section-subtext">From minimalist to maximalist — every aesthetic, one platform</p>
          </motion.div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))',
            gap: 14,
          }}>
            {STYLES.map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.04)}
                whileHover={{ y: -6, scale: 1.03 }}
                style={{
                  borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
                  position: 'relative', aspectRatio: '3/4',
                  border: '1px solid var(--border)',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Image src={s.img} alt={s.name} fill sizes="(max-width: 768px) 50vw, 150px"
                  style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(8,8,12,0.9) 0%, rgba(8,8,12,0.1) 50%, transparent 100%)',
                }} />
                <div style={{
                  position: 'absolute', bottom: 14, left: 0, right: 0,
                  textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#fff',
                  letterSpacing: '0.3px',
                }}>{s.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY ROOMSGPT ═══════ */}
      <section style={{ padding: '100px 24px', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>
              <Shield size={12} /> Why RoomsGPT
            </span>
            <h2 className="section-heading" style={{ marginBottom: 14 }}>
              Built for <span className="gradient-text">professionals</span>
            </h2>
            <p className="section-subtext">
              Enterprise-grade AI with consumer-friendly simplicity
            </p>
          </motion.div>
 
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 20 }}>
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Get photorealistic renders in under 10 seconds. No waiting, no rendering queues.', color: '#f59e0b' },
              { icon: Shield, title: 'Enterprise Security', desc: 'SOC 2 compliant. Your designs and photos are encrypted and never shared.', color: '#10b981' },
              { icon: Globe, title: 'Works Everywhere', desc: 'Desktop, tablet, or mobile — design anywhere with our responsive platform.', color: '#3b82f6' },
              { icon: Cpu, title: 'Latest AI Models', desc: 'Powered by GPT-5.2 Vision and gpt-image-2 for structure-preserving realism.', color: '#a855f7' },
              { icon: Palette, title: 'Curated Styles', desc: 'Sleek Modern, cozy Scandinavian, warm Rustic, and more at your fingertips.', color: '#ec4899' },
              { icon: Users, title: 'Team Collaboration', desc: 'Share projects, collect votes, and collaborate with clients in real-time.', color: '#06b6d4' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={i} {...fadeUp(i * 0.06)} style={{
                  padding: 32, borderRadius: 20,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${feature.color}40`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.25), 0 0 30px ${feature.color}08`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: `${feature.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                  }}>
                    <Icon size={22} style={{ color: feature.color }} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.3px' }}>{feature.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ GALLERY ═══════ */}
      <div id="gallery">
        <GalleryFilter />
      </div>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <div id="testimonials">
        <Testimonials />
      </div>

      {/* ═══════ PRICING & FAQ ═══════ */}
      <PricingAndFAQ />

      {/* ═══════ CONTACT ═══════ */}
      <div id="contact">
        <ContactSection />
      </div>

      {/* ═══════ FINAL CTA ═══════ */}
      <section style={{
        padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 60%)',
          borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '30%', left: '20%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 60%)',
          borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <motion.div {...fadeUp()} style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
          <span className="badge" style={{ marginBottom: 20, display: 'inline-flex' }}>
            <Sparkles size={12} /> Start Free Today
          </span>
          <h2 style={{
            fontSize: 'clamp(34px, 5vw, 54px)', fontWeight: 800,
            letterSpacing: '-1.5px', marginBottom: 18, lineHeight: 1.1,
          }}>
            Ready to transform<br />
            <span className="gradient-text">your space?</span>
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', marginBottom: 36, lineHeight: 1.75 }}>
            Join 50,000+ homeowners, designers, and professionals
            already using RoomsGPT to bring their vision to life.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/studio" className="btn-primary" style={{
              fontSize: 17, padding: '18px 44px', borderRadius: 14,
              boxShadow: '0 8px 32px rgba(124,58,237,0.35)',
            }}>
              Get Started Free <ArrowRight style={{ width: 20, height: 20 }} />
            </Link>
            <Link href="/pricing" className="btn-secondary" style={{
              fontSize: 17, padding: '18px 36px', borderRadius: 14,
            }}>
              View Pricing
            </Link>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 18 }}>
            No credit card required · 5 free renders · Cancel anytime
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
