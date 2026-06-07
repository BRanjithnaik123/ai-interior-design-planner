'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Moon, Sun, Monitor, Type, Zap, ZapOff, Check, SlidersHorizontal, LayoutGrid, Maximize } from 'lucide-react';
import { useTheme, ThemeName, FontSize, Density } from '@/lib/theme-context';

const THEMES: { name: ThemeName; color: string; bg: string; }[] = [
  { name: 'Dark', color: '#7c3aed', bg: '#08080c' },
  { name: 'Light', color: '#0f172a', bg: '#f8fafc' },
  { name: 'Midnight Blue', color: '#3b82f6', bg: '#030712' },
  { name: 'Emerald Green', color: '#10b981', bg: '#022c22' },
  { name: 'Royal Purple', color: '#9333ea', bg: '#2e1065' },
  { name: 'Sunset Orange', color: '#f97316', bg: '#1c0f0a' },
  { name: 'Rose Gold', color: '#f43f5e', bg: '#1f1015' },
  { name: 'Ocean Breeze', color: '#06b6d4', bg: '#08171c' },
];

const FONT_SIZES: FontSize[] = ['Small', 'Medium', 'Large'];
const DENSITIES: Density[] = ['Compact', 'Comfortable'];

export default function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme, mode, animations, fontSize, density, setTheme, setMode, setAnimations, setFontSize, setDensity } = useTheme();

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // Prevent closing if they clicked the trigger button
        const target = e.target as HTMLElement;
        if (!target.closest('#theme-customizer-trigger')) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        id="theme-customizer-trigger"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 9999,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--bg-glass)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
        }}
        aria-label="Customize Theme"
      >
        <Palette size={20} color="var(--primary)" />
      </motion.button>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile / click outside capture */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(2px)',
              }}
            />
            <motion.div
              ref={panelRef}
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                width: 320,
                zIndex: 10000,
                background: 'var(--bg-card)',
                borderRight: '1px solid var(--border)',
                boxShadow: '20px 0 60px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-secondary)',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <SlidersHorizontal size={18} color="var(--primary)" /> Appearance
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'var(--bg-elevated)',
                  border: 'none',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* Theme Colors */}
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Theme Palette</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {THEMES.map(t => (
                    <button
                      key={t.name}
                      onClick={() => setTheme(t.name)}
                      title={t.name}
                      style={{
                        position: 'relative',
                        aspectRatio: '1',
                        borderRadius: 12,
                        background: t.bg,
                        border: `2px solid ${theme === t.name ? 'var(--primary)' : 'var(--border)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: t.color }} />
                      {theme === t.name && (
                        <div style={{ position: 'absolute', top: 4, right: 4 }}>
                          <Check size={12} color="var(--primary)" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Light/Dark Mode */}
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Color Mode</h4>
                <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 12, padding: 4 }}>
                  <button
                    onClick={() => setMode('light')}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: mode === 'light' ? 'var(--bg-card)' : 'transparent',
                      color: mode === 'light' ? 'var(--text)' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: mode === 'light' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                      fontSize: 13, fontWeight: 500,
                    }}
                  >
                    <Sun size={14} /> Light
                  </button>
                  <button
                    onClick={() => setMode('dark')}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: mode === 'dark' ? 'var(--bg-card)' : 'transparent',
                      color: mode === 'dark' ? 'var(--text)' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                      fontSize: 13, fontWeight: 500,
                    }}
                  >
                    <Moon size={14} /> Dark
                  </button>
                </div>
              </div>

              {/* Font Size */}
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Font Size</h4>
                <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 12, padding: 4 }}>
                  {FONT_SIZES.map(f => (
                    <button
                      key={f}
                      onClick={() => setFontSize(f)}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: fontSize === f ? 'var(--bg-card)' : 'transparent',
                        color: fontSize === f ? 'var(--text)' : 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        boxShadow: fontSize === f ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                        fontSize: 13, fontWeight: 500,
                      }}
                    >
                      <Type size={f === 'Small' ? 12 : f === 'Medium' ? 14 : 16} />
                      <span style={{ display: 'none' }}>{f}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Density */}
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Layout Density</h4>
                <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 12, padding: 4 }}>
                  {DENSITIES.map(d => (
                    <button
                      key={d}
                      onClick={() => setDensity(d)}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: density === d ? 'var(--bg-card)' : 'transparent',
                        color: density === d ? 'var(--text)' : 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        boxShadow: density === d ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                        fontSize: 13, fontWeight: 500,
                      }}
                    >
                      {d === 'Compact' ? <LayoutGrid size={14} /> : <Maximize size={14} />} {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animations */}
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Animations</h4>
                <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 12, padding: 4 }}>
                  <button
                    onClick={() => setAnimations(true)}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: animations ? 'var(--bg-card)' : 'transparent',
                      color: animations ? 'var(--text)' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: animations ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                      fontSize: 13, fontWeight: 500,
                    }}
                  >
                    <Zap size={14} /> On
                  </button>
                  <button
                    onClick={() => setAnimations(false)}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: !animations ? 'var(--bg-card)' : 'transparent',
                      color: !animations ? 'var(--text)' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: !animations ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                      fontSize: 13, fontWeight: 500,
                    }}
                  >
                    <ZapOff size={14} /> Off
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
