'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
});

const ARTICLES = [
  {
    category: 'Design Trends',
    title: 'Top Interior Design Trends for 2026',
    excerpt: 'Discover the materials, colors, and layout strategies defining modern homes this year.',
    img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
    readTime: '5 min read',
    date: 'Apr 12, 2026'
  },
  {
    category: 'AI Technology',
    title: 'How AI is Revolutionizing Home Renovation',
    excerpt: 'From predictive cost analysis to instant photorealistic renders, see how AI is changing the game.',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    readTime: '8 min read',
    date: 'Mar 28, 2026'
  },
  {
    category: 'Smart Living',
    title: 'Designing for Smart Home Integration',
    excerpt: 'A guide to seamlessly blending technology with aesthetic interior design.',
    img: 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?w=600&q=80',
    readTime: '6 min read',
    date: 'Mar 15, 2026'
  }
];

export default function BlogSection() {
  return (
    <section id="blog" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
          <motion.div {...fadeUp()} style={{ maxWidth: 600 }}>
            <span className="badge" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <BookOpen size={14} /> OUR BLOG
            </span>
            <h2 className="section-heading" style={{ fontSize: 'clamp(32px, 4vw, 44px)' }}>
              Insights &amp; <span className="gradient-text">Inspiration</span>
            </h2>
          </motion.div>
          <motion.div {...fadeUp(0.1)}>
            <Link href="/blog" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px' }}>
              View all articles <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
          {ARTICLES.map((article, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 240, overflow: 'hidden', position: 'relative' }}>
                <img src={article.img} alt={article.title} loading="lazy" style={{
                  width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease'
                }} 
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
                }}
                />
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                  color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 8
                }}>
                  {article.category}
                </div>
              </div>
              <div style={{ padding: '28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                  <span>{article.date}</span>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border)' }} />
                  <span>{article.readTime}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, lineHeight: 1.4 }}>{article.title}</h3>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24, flex: 1 }}>
                  {article.excerpt}
                </p>
                <Link href="/blog" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: 'var(--primary-light)',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--primary-light)'}
                >
                  Read full article <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
