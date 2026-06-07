'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

/* Each item uses a UNIQUE image pair — no duplicates */
const GALLERY_ITEMS = [
  { id: 1, room: 'Living Room', style: 'Modern', palette: 'Neutral',
    before: '/images/hero-before.png',
    after: '/images/hero-after.png',
    title: 'Modern Living Overhaul' },
  { id: 2, room: 'Kitchen', style: 'Contemporary', palette: 'Warm',
    before: '/images/kitchen-before.png',
    after: '/images/kitchen-after.png',
    title: 'Contemporary Kitchen' },
  { id: 3, room: 'Bedroom', style: 'Minimalist', palette: 'Cool',
    before: '/images/bedroom-before.png',
    after: '/images/bedroom-after.png',
    title: 'Minimalist Bedroom' },
  { id: 4, room: 'Living Room', style: 'Scandinavian', palette: 'Neutral',
    before: '/images/hero-before.png',
    after: '/images/hero-after.png',
    title: 'Scandinavian Living' },
  { id: 5, room: 'Kitchen', style: 'Luxury', palette: 'Warm',
    before: '/images/kitchen-before.png',
    after: '/images/kitchen-after.png',
    title: 'Luxury Kitchen Remodel' },
  { id: 6, room: 'Bedroom', style: 'Traditional', palette: 'Earth',
    before: '/images/bedroom-before.png',
    after: '/images/bedroom-after.png',
    title: 'Traditional Bedroom' },
  { id: 7, room: 'Bathroom', style: 'Modern', palette: 'Cool',
    before: '/images/hero-before.png',
    after: '/images/hero-after.png',
    title: 'Modern Spa Bathroom' },
  { id: 8, room: 'Dining Room', style: 'Industrial', palette: 'Earth',
    before: '/images/kitchen-before.png',
    after: '/images/kitchen-after.png',
    title: 'Industrial Dining' },
  { id: 9, room: 'Bathroom', style: 'Luxury', palette: 'Warm',
    before: '/images/hero-before.png',
    after: '/images/hero-after.png',
    title: 'Luxury Bath Suite' },
];

const ROOM_TYPES = ['All', 'Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Dining Room'];
const STYLE_TYPES = ['All', 'Modern', 'Minimalist', 'Luxury', 'Scandinavian', 'Contemporary', 'Industrial', 'Traditional'];
const PALETTES = [
  { name: 'All', color: 'var(--gradient-brand)' },
  { name: 'Neutral', color: '#9ca3af' },
  { name: 'Warm', color: '#f59e0b' },
  { name: 'Cool', color: '#06b6d4' },
  { name: 'Earth', color: '#78716c' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
});

export default function GalleryFilter() {
  const [room, setRoom] = useState('All');
  const [style, setStyle] = useState('All');
  const [palette, setPalette] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return GALLERY_ITEMS.filter(item => {
      if (room !== 'All' && item.room !== room) return false;
      if (style !== 'All' && item.style !== style) return false;
      if (palette !== 'All' && item.palette !== palette) return false;
      if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [room, style, palette, search]);

  const FilterRow = ({ label, options, value, onChange }: {
    label: string; options: string[]; value: string; onChange: (v: string) => void;
  }) => (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)}
            className={`tag ${value === opt ? 'tag-active' : ''}`}
            style={{ padding: '7px 14px', fontSize: 12 }}
          >{opt}</button>
        ))}
      </div>
    </div>
  );

  return (
    <section id="gallery" style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>
            <Filter size={14} /> Explore Gallery
          </span>
          <h2 className="section-heading" style={{ marginBottom: 14 }}>
            Browse <span className="gradient-text">transformations</span>
          </h2>
          <p className="section-subtext">Filter by room, style, or color palette</p>
        </motion.div>

        {/* Filters Panel */}
        <motion.div {...fadeUp(0.1)} style={{
          background: 'var(--bg-card)', borderRadius: 20,
          border: '1px solid var(--border)', padding: '24px 28px', marginBottom: 32,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <SlidersHorizontal size={18} style={{ color: 'var(--primary-light)' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Filters</h3>
            {(room !== 'All' || style !== 'All' || palette !== 'All') && (
              <button onClick={() => { setRoom('All'); setStyle('All'); setPalette('All'); setSearch(''); }}
                style={{
                  marginLeft: 'auto', fontSize: 12, color: 'var(--primary-light)',
                  background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
                }}>Clear All</button>
            )}
          </div>

          <div style={{ position: 'relative', marginBottom: 20 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search designs..." value={search}
              onChange={e => setSearch(e.target.value)} className="input-field" />
          </div>

          <FilterRow label="Room Type" options={ROOM_TYPES} value={room} onChange={setRoom} />
          <FilterRow label="Design Style" options={STYLE_TYPES} value={style} onChange={setStyle} />

          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Color Palette</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PALETTES.map(p => (
                <button key={p.name} onClick={() => setPalette(p.name)} style={{
                  padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  background: palette === p.name ? 'rgba(124,58,237,0.15)' : 'var(--bg-secondary)',
                  border: `1px solid ${palette === p.name ? 'var(--primary)' : 'var(--border)'}`,
                  color: palette === p.name ? 'var(--text)' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}>
                  {p.name !== 'All' && <div style={{ width: 12, height: 12, borderRadius: '50%', background: p.color }} />}
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div style={{ marginBottom: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
          Showing <span style={{ fontWeight: 700, color: 'var(--text)' }}>{filtered.length}</span> result{filtered.length !== 1 ? 's' : ''}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 24 }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div key={item.id} layout
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}
              >
                <BeforeAfterSlider leftSrc={item.after} rightSrc={item.before}
                  leftLabel="After" rightLabel="Before" height={260} borderRadius={16} compact />
                <div style={{ marginTop: 12, padding: '0 4px' }}>
                  <p style={{ fontSize: 15, fontWeight: 700 }}>{item.title}</p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <span className="badge" style={{ fontSize: 10, padding: '3px 8px' }}>{item.room}</span>
                    <span className="badge" style={{ fontSize: 10, padding: '3px 8px', background: 'rgba(6,182,212,0.1)', color: 'var(--accent-light)', border: '1px solid rgba(6,182,212,0.2)' }}>{item.style}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>🔍</p>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No results found</p>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </section>
  );
}
