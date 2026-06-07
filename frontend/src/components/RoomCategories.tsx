'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Heart, Download, Share2 } from 'lucide-react';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

/* ═══════ HIGH-QUALITY UNSPLASH IMAGES ═══════ */
const ROOMS = [
  {
    name: 'Living Room',
    icon: '🛋️',
    description: 'Transform your living space into a modern sanctuary',
    cardImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    pairs: [
      { before: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80', after: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=700&q=80', title: 'Modern Makeover', style: 'Modern' },
      { before: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=80', after: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=700&q=80', title: 'Scandinavian Touch', style: 'Scandinavian' },
    ],
  },
  {
    name: 'Bedroom',
    icon: '🛏️',
    description: 'Create your perfect retreat for rest and relaxation',
    cardImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
    pairs: [
      { before: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=700&q=80', after: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=700&q=80', title: 'Cozy Retreat', style: 'Contemporary' },
      { before: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=700&q=80', after: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=80', title: 'Luxury Suite', style: 'Luxury' },
    ],
  },
  {
    name: 'Dining Room',
    icon: '🍽️',
    description: 'Design an elegant space for memorable gatherings',
    cardImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
    pairs: [
      { before: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=700&q=80', after: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=700&q=80', title: 'Elegant Dining', style: 'Traditional' },
      { before: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=700&q=80', after: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=700&q=80', title: 'Modern Entertaining', style: 'Modern' },
    ],
  },
  {
    name: 'Kitchen',
    icon: '🍳',
    description: 'Reimagine the heart of your home with AI',
    cardImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    pairs: [
      { before: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80', after: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=700&q=80', title: 'Contemporary Kitchen', style: 'Contemporary' },
      { before: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=700&q=80', after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80', title: 'Luxury Remodel', style: 'Luxury' },
    ],
  },
  {
    name: 'Bathroom',
    icon: '🚿',
    description: 'Turn your bathroom into a personal spa retreat',
    cardImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    pairs: [
      { before: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=700&q=80', after: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=700&q=80', title: 'Spa-Inspired Bath', style: 'Luxury' },
      { before: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=700&q=80', after: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=700&q=80', title: 'Modern Refresh', style: 'Modern' },
    ],
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
});

export default function RoomCategories() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFav = (key: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <>
      <section id="rooms" style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Section Header */}
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>
              ✨ Room Categories
            </span>
            <h2 className="section-heading" style={{ marginBottom: 14 }}>
              Transform any <span className="gradient-text">room type</span>
            </h2>
            <p className="section-subtext">
              Select a room to explore stunning AI-powered before & after renovations
            </p>
          </motion.div>

          {/* Room Category Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 20,
          }}>
            {ROOMS.map((room, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.08)}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRoom(i)}
                style={{
                  cursor: 'pointer',
                  borderRadius: 20,
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(124,58,237,0.12), 0 0 0 1px rgba(124,58,237,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Card Image */}
                <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={room.cardImage}
                    alt={room.name}
                    loading="lazy"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
                    }}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  {/* Gradient Overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(8,8,12,0.85) 0%, rgba(8,8,12,0.2) 40%, transparent 70%)',
                  }} />
                  {/* Icon Badge */}
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    width: 42, height: 42, borderRadius: 12,
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                  }}>{room.icon}</div>
                  {/* Count Badge */}
                  <div style={{
                    position: 'absolute', top: 14, left: 14,
                    padding: '5px 12px', borderRadius: 8,
                    background: 'rgba(124,58,237,0.7)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff', fontSize: 11, fontWeight: 700,
                  }}>
                    {room.pairs.length} Transformations
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px 22px 24px' }}>
                  <h3 style={{
                    fontSize: 20, fontWeight: 700, marginBottom: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    {room.name}
                    <ArrowRight style={{
                      width: 18, height: 18, color: 'var(--primary-light)',
                      transition: 'transform 0.3s',
                    }} />
                  </h3>
                  <p style={{
                    fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
                  }}>{room.description}</p>

                  {/* Style Tags */}
                  <div style={{
                    display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap',
                  }}>
                    {room.pairs.map((p, j) => (
                      <span key={j} style={{
                        padding: '4px 10px', borderRadius: 6,
                        fontSize: 11, fontWeight: 600,
                        background: 'var(--bg-elevated)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border)',
                      }}>{p.style}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ ROOM GALLERY MODAL ══════════ */}
      <AnimatePresence>
        {selectedRoom !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedRoom(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              overflow: 'auto', padding: '40px 24px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: 1000,
                background: 'var(--bg-card)',
                borderRadius: 24,
                border: '1px solid var(--border-light)',
                boxShadow: '0 40px 120px rgba(0,0,0,0.5)',
                overflow: 'hidden',
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: '28px 32px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 32 }}>{ROOMS[selectedRoom].icon}</span>
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 800 }}>
                      {ROOMS[selectedRoom].name} Transformations
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {ROOMS[selectedRoom].pairs.length} AI-generated before & after comparisons
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRoom(null)}
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-secondary)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg-elevated)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Gallery Content */}
              <div style={{ padding: '32px 32px 40px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
                  gap: 28,
                }}>
                  {ROOMS[selectedRoom].pairs.map((pair, i) => {
                    const favKey = `${selectedRoom}-${i}`;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        {/* Slider */}
                        <BeforeAfterSlider
                          leftSrc={pair.after}
                          rightSrc={pair.before}
                          leftLabel="After"
                          rightLabel="Before"
                          height={300}
                          borderRadius={16}
                          compact
                        />
                        {/* Info bar */}
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          marginTop: 14, padding: '0 4px',
                        }}>
                          <div>
                            <p style={{ fontSize: 15, fontWeight: 700 }}>{pair.title}</p>
                            <span style={{
                              display: 'inline-block', marginTop: 4,
                              padding: '3px 10px', borderRadius: 6,
                              fontSize: 11, fontWeight: 600,
                              background: 'rgba(124,58,237,0.12)',
                              color: 'var(--primary-light)',
                              border: '1px solid rgba(124,58,237,0.2)',
                            }}>{pair.style}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => toggleFav(favKey)}
                              title="Save"
                              style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: favorites.has(favKey) ? 'rgba(239,68,68,0.15)' : 'var(--bg-elevated)',
                                border: `1px solid ${favorites.has(favKey) ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s',
                              }}
                            >
                              <Heart
                                size={16}
                                fill={favorites.has(favKey) ? '#ef4444' : 'none'}
                                color={favorites.has(favKey) ? '#ef4444' : 'var(--text-muted)'}
                              />
                            </button>
                            <button
                              title="Download"
                              style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: 'var(--text-muted)',
                              }}
                            >
                              <Download size={16} />
                            </button>
                            <button
                              title="Share"
                              style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: 'var(--text-muted)',
                              }}
                            >
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
