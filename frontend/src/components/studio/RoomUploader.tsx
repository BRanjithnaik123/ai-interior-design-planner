'use client';
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Camera, Image as ImageIcon, X, Check,
  Bed, Sofa, CookingPot, Bath, UtensilsCrossed,
  Briefcase, TreePine, Home, Baby, Car, Warehouse, Building2,
} from 'lucide-react';

/* ═══════ ROOM TYPES ═══════ */
const ROOM_TYPES = [
  { id: 'living-room', label: 'Living Room', icon: Sofa, color: '#7c3aed' },
  { id: 'bedroom', label: 'Bedroom', icon: Bed, color: '#ec4899' },
  { id: 'kitchen', label: 'Kitchen', icon: CookingPot, color: '#f59e0b' },
  { id: 'bathroom', label: 'Bathroom', icon: Bath, color: '#06b6d4' },
  { id: 'dining-room', label: 'Dining Room', icon: UtensilsCrossed, color: '#10b981' },
  { id: 'home-office', label: 'Home Office', icon: Briefcase, color: '#8b5cf6' },
  { id: 'exterior', label: 'Exterior', icon: Home, color: '#3b82f6' },
  { id: 'patio', label: 'Patio', icon: TreePine, color: '#14b8a6' },
  { id: 'nursery', label: 'Nursery', icon: Baby, color: '#f472b6' },
  { id: 'garage', label: 'Garage', icon: Car, color: '#6b7280' },
  { id: 'basement', label: 'Basement', icon: Warehouse, color: '#78716c' },
  { id: 'commercial', label: 'Commercial', icon: Building2, color: '#a855f7' },
];

/* ═══════ DESIGN STYLES ═══════ */
const DESIGN_STYLES = [
  { id: 'modern', name: 'Modern', img: '/images/hero-after.png', color: '#7c3aed' },
  { id: 'minimalist', name: 'Minimalist', img: '/images/bedroom-after.png', color: '#06b6d4' },
  { id: 'luxury', name: 'Luxury', img: '/images/hero-before.png', color: '#ec4899' },
  { id: 'scandinavian', name: 'Scandinavian', img: '/images/bedroom-before.png', color: '#10b981' },
  { id: 'rustic', name: 'Rustic', img: '/images/kitchen-before.png', color: '#78716c' },
  { id: 'contemporary', name: 'Contemporary', img: '/images/kitchen-after.png', color: '#8b5cf6' },
  { id: 'industrial', name: 'Industrial', img: '/images/bedroom-after.png', color: '#f59e0b' },
  { id: 'traditional', name: 'Traditional', img: '/images/kitchen-before.png', color: '#eab308' },
];

interface RoomUploaderProps {
  onComplete: (data: {
    image: string;
    file: File;
    roomType: string;
    style: string;
  }) => void;
}

export default function RoomUploader({ onComplete }: RoomUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0); // 0=upload, 1=room, 2=style
  const [dragOver, setDragOver] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [roomType, setRoomType] = useState('');
  const [style, setStyle] = useState('');

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) return;
    setFile(f);
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = (e) => { setImage(e.target?.result as string); setStep(1); };
    reader.readAsDataURL(f);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const selectRoom = (id: string) => { setRoomType(id); setStep(2); };

  const selectStyle = (id: string) => {
    setStyle(id);
    if (image && file) {
      onComplete({ image, file, roomType, style: id });
    }
  };

  const reset = () => {
    setStep(0); setImage(null); setFile(null);
    setFileName(''); setRoomType(''); setStyle('');
  };

  const steps = [
    { num: 1, label: 'Upload Photo', done: step > 0 },
    { num: 2, label: 'Room Type', done: step > 1 },
    { num: 3, label: 'Design Style', done: !!style },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 920, margin: '0 auto' }}>
      {/* ── Step Progress Bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, marginBottom: 48,
      }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: s.done ? 'var(--gradient-brand)' : step === i ? 'rgba(124,58,237,0.15)' : 'var(--bg-elevated)',
                border: s.done ? 'none' : step === i ? '2px solid var(--primary)' : '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                color: s.done ? '#fff' : step === i ? 'var(--primary-light)' : 'var(--text-muted)',
                boxShadow: s.done ? '0 4px 16px rgba(124,58,237,0.35)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
                {s.done ? <Check size={16} /> : s.num}
              </div>
              <span style={{
                fontSize: 14, fontWeight: 600,
                color: s.done ? 'var(--text)' : step === i ? 'var(--primary-light)' : 'var(--text-muted)',
                transition: 'color 0.3s',
              }}>{s.label}</span>
            </div>
            {i < 2 && (
              <div style={{
                width: 60, height: 2, borderRadius: 1,
                background: s.done ? 'var(--gradient-brand)' : 'var(--border)',
                transition: 'background 0.4s',
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ═══════ STEP 0: UPLOAD ═══════ */}
        {step === 0 && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--border-light)'}`,
                borderRadius: 28, padding: '80px 40px', textAlign: 'center',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                background: dragOver ? 'rgba(124,58,237,0.04)' : 'var(--bg-card)',
                transform: dragOver ? 'scale(1.005)' : 'scale(1)',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Decorative corner accents */}
              <div style={{ position: 'absolute', top: 16, left: 16, width: 24, height: 24, borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)', borderRadius: '4px 0 0 0', opacity: 0.3 }} />
              <div style={{ position: 'absolute', top: 16, right: 16, width: 24, height: 24, borderTop: '2px solid var(--primary)', borderRight: '2px solid var(--primary)', borderRadius: '0 4px 0 0', opacity: 0.3 }} />
              <div style={{ position: 'absolute', bottom: 16, left: 16, width: 24, height: 24, borderBottom: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)', borderRadius: '0 0 0 4px', opacity: 0.3 }} />
              <div style={{ position: 'absolute', bottom: 16, right: 16, width: 24, height: 24, borderBottom: '2px solid var(--primary)', borderRight: '2px solid var(--primary)', borderRadius: '0 0 4px 0', opacity: 0.3 }} />

              <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

              <div style={{
                width: 100, height: 100, borderRadius: 30, margin: '0 auto 32px',
                background: 'var(--gradient-brand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 16px 48px rgba(124,58,237,0.35)',
                transform: dragOver ? 'scale(1.1) translateY(-8px)' : 'scale(1)',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
                <Upload size={44} color="#fff" />
              </div>

              <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.8px' }}>
                Upload your room photo
              </h3>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.6, maxWidth: 440, marginInline: 'auto' }}>
                Drag & drop or click to select a high-quality photo of any room
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 36 }}>
                JPG, PNG, WEBP • Up to 10MB • Minimum 512×512px
              </p>

              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => fileRef.current?.click()} className="btn-primary" style={{ padding: '16px 36px', fontSize: 16, borderRadius: 16, boxShadow: '0 8px 28px rgba(124,58,237,0.35)' }}>
                  <ImageIcon size={20} /> Browse Files
                </button>
                <button onClick={() => cameraRef.current?.click()} className="btn-secondary" style={{ padding: '16px 36px', fontSize: 16, borderRadius: 16 }}>
                  <Camera size={20} /> Take Photo
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════ STEP 1: ROOM TYPE ═══════ */}
        {step === 1 && (
          <motion.div key="room" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            {/* Image preview strip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36,
              padding: '14px 20px', borderRadius: 18,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
            }}>
              <div style={{ width: 64, height: 48, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.06)' }}>
                <img src={image!} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fileName}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Photo uploaded successfully</p>
              </div>
              <button onClick={reset} style={{
                padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              ><X size={14} /> Remove</button>
            </div>

            <h3 style={{ fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 8, letterSpacing: '-0.5px' }}>
              What type of room is this?
            </h3>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 36 }}>
              Select the room category for the most accurate AI transformation
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
              {ROOM_TYPES.map(room => {
                const Icon = room.icon;
                const active = roomType === room.id;
                return (
                  <button key={room.id} onClick={() => selectRoom(room.id)} style={{
                    padding: '22px 14px', borderRadius: 18, cursor: 'pointer',
                    background: active ? `${room.color}12` : 'var(--bg-card)',
                    border: `1px solid ${active ? `${room.color}50` : 'var(--border)'}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    color: 'var(--text)',
                  }}
                    onMouseEnter={e => {
                      if (!active) { e.currentTarget.style.borderColor = `${room.color}35`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.2)`; }
                    }}
                    onMouseLeave={e => {
                      if (!active) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: `${room.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={22} style={{ color: room.color }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{room.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══════ STEP 2: DESIGN STYLE ═══════ */}
        {step === 2 && (
          <motion.div key="style" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            {/* Context bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36,
              padding: '14px 20px', borderRadius: 18,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              flexWrap: 'wrap',
            }}>
              <div style={{ width: 56, height: 42, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.06)' }}>
                <img src={image!} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{ROOM_TYPES.find(r => r.id === roomType)?.label}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fileName}</p>
              </div>
              <button onClick={() => setStep(1)} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', cursor: 'pointer',
              }}>← Back</button>
            </div>

            <h3 style={{ fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 8, letterSpacing: '-0.5px' }}>
              Choose your design aesthetic
            </h3>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 36 }}>
              Select a style and our AI will transform your {ROOM_TYPES.find(r => r.id === roomType)?.label?.toLowerCase()}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {DESIGN_STYLES.map(s => {
                const active = style === s.id;
                return (
                  <button key={s.id} onClick={() => selectStyle(s.id)} style={{
                    position: 'relative', borderRadius: 18, overflow: 'hidden',
                    cursor: 'pointer', border: 'none', padding: 0,
                    aspectRatio: '4/5',
                    outline: active ? '3px solid var(--primary)' : '1px solid var(--border)',
                    outlineOffset: active ? 3 : 0,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: active ? '0 8px 32px rgba(124,58,237,0.3)' : 'none',
                  }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.outline = `1px solid ${s.color}60`; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.25)'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.outline = '1px solid var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; } }}
                  >
                    <img src={s.img} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: active ? `${s.color}55` : 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                      transition: 'background 0.3s',
                    }} />
                    {/* Check mark */}
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      width: 28, height: 28, borderRadius: '50%',
                      background: active ? 'var(--gradient-brand)' : 'rgba(0,0,0,0.4)',
                      border: `2px solid ${active ? 'transparent' : 'rgba(255,255,255,0.3)'}`,
                      backdropFilter: 'blur(4px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s',
                    }}>
                      {active && <Check size={15} color="#fff" />}
                    </div>
                    {/* Label */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: '14px 16px',
                    }}>
                      <span style={{
                        fontSize: 15, fontWeight: 700, color: '#fff',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      }}>{s.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
