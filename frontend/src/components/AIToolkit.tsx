'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  Wand2, Sofa, Layers, Zap, Mountain, Home,
  Pencil, PaintBucket, Eraser, Paintbrush, Sparkles,
} from 'lucide-react';

const TOOLS = [
  { icon: Wand2, title: 'Renovate', desc: 'Transform any room with AI', color: '#a78bfa' },
  { icon: Sofa, title: 'Virtual Staging', desc: 'Furnish empty spaces instantly', pro: true, color: '#06b6d4' },
  { icon: Layers, title: 'Elevation', desc: '2D plans to 3D renders', color: '#10b981' },
  { icon: Zap, title: 'Upscaling', desc: 'Enhance images up to 4K', color: '#f59e0b' },
  { icon: Mountain, title: 'Exteriors', desc: 'Renovate home exteriors', pro: true, color: '#ec4899' },
  { icon: Home, title: 'Landscaping', desc: 'Design stunning landscapes', pro: true, color: '#3b82f6' },
  { icon: Pencil, title: 'Sketch to Render', desc: 'Sketches to photorealistic images', pro: true, color: '#8b5cf6' },
  { icon: PaintBucket, title: 'Wall Paint', desc: 'Change wall colors & materials', pro: true, color: '#14b8a6' },
  { icon: Paintbrush, title: 'Exterior Paint', desc: 'Change exterior paint & texture', pro: true, color: '#f97316' },
  { icon: Eraser, title: 'Clean Up', desc: 'Remove unwanted objects', pro: true, color: '#ef4444' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
});

export default function AIToolkit() {
  return (
    <section style={{ padding: '110px 24px', background: 'var(--bg-secondary)', position: 'relative' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '20%', right: '10%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="badge" style={{ marginBottom: 16, display: 'inline-flex', gap: 6 }}>
            <Sparkles size={12} /> 10+ AI Tools
          </span>
          <h2 className="section-heading" style={{ marginBottom: 14 }}>
            The most powerful <span className="gradient-text">AI toolkit</span>
          </h2>
          <p className="section-subtext">
            Specialized tools to renovate, stage, paint, and transform any space
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
        }}>
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={i}
                {...fadeUp(i * 0.04)}
                style={{
                  cursor: 'pointer', overflow: 'hidden', position: 'relative',
                  borderRadius: 20, background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  padding: '28px 22px',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${tool.color}35`;
                  el.style.transform = 'translateY(-6px)';
                  el.style.boxShadow = `0 20px 50px rgba(0,0,0,0.25), 0 0 30px ${tool.color}08`;
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  const el = e.currentTarget;
                  el.style.borderColor = 'var(--border)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                {tool.pro && (
                  <span style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'var(--gradient-brand)', color: '#fff',
                    fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                    letterSpacing: '0.5px',
                  }}>PRO</span>
                )}
                <div style={{
                  width: 48, height: 48, borderRadius: 14, marginBottom: 18,
                  background: `${tool.color}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform 0.3s',
                }}>
                  <Icon style={{ width: 22, height: 22, color: tool.color }} />
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{tool.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {tool.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
