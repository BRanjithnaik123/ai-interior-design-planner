'use client';
import React, { useState, useRef, useEffect, useCallback, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import { Maximize, Minimize, GripVertical, Eye, Layers, ZoomIn, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface BeforeAfterSliderProps {
  leftSrc: string;
  rightSrc: string;
  leftLabel?: string;
  rightLabel?: string;
  height?: number | string;
  borderRadius?: number;
  compact?: boolean;
  showControls?: boolean;
  initialPosition?: number;
  enableKeyboard?: boolean;
  onSliderChange?: (position: number) => void;
  priority?: boolean;
}

export default function BeforeAfterSlider({
  leftSrc,
  rightSrc,
  leftLabel = 'Before',
  rightLabel = 'After',
  height = 500,
  borderRadius = 24,
  compact = false,
  showControls = true,
  initialPosition = 50,
  enableKeyboard = true,
  onSliderChange,
  priority = false,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'before' | 'after' | 'overlay'>('slider');
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [imageLoaded, setImageLoaded] = useState({ left: false, right: false });
  const [imageError, setImageError] = useState({ left: false, right: false });
  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const leftImageRef = useRef<HTMLImageElement>(null);
  const rightImageRef = useRef<HTMLImageElement>(null);

  /* ─── Robust checking for cached or base64 images ─── */
  const checkCompletion = useCallback(() => {
    if (leftImageRef.current && (leftImageRef.current.complete || leftImageRef.current.naturalWidth > 0)) {
      setImageLoaded(s => s.left ? s : { ...s, left: true });
    }
    if (rightImageRef.current && (rightImageRef.current.complete || rightImageRef.current.naturalWidth > 0)) {
      setImageLoaded(s => s.right ? s : { ...s, right: true });
    }
  }, []);

  useEffect(() => {
    setImageLoaded({ left: false, right: false });
    setImageError({ left: false, right: false });

    checkCompletion();
    const interval = setInterval(checkCompletion, 100);
    const timeout = setTimeout(() => clearInterval(interval), 2500);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [leftSrc, rightSrc, checkCompletion]);

  /* ─── Initial sweep animation ─── */
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    let start = 20;
    const timer = setInterval(() => {
      start += 1.5;
      setSliderPosition(start);
      if (start >= initialPosition) {
        setSliderPosition(initialPosition);
        clearInterval(timer);
      }
    }, 12);
    return () => clearInterval(timer);
  }, [initialPosition]);

  /* ─── Drag handling ─── */
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(2, Math.min((x / rect.width) * 100, 98));
    setSliderPosition(percent);
    onSliderChange?.(percent);
  }, [isDragging, onSliderChange]);

  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => handleMove(e.clientX), [handleMove]);
  const handleTouchMove = useCallback((e: globalThis.TouchEvent) => handleMove(e.touches[0].clientX), [handleMove]);
  const handleInteractionEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('mouseup', handleInteractionEnd);
      window.addEventListener('touchend', handleInteractionEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleInteractionEnd]);

  /* ─── Keyboard support ─── */
  useEffect(() => {
    if (!enableKeyboard) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHovered) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSliderPosition(p => Math.max(2, p - 2));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSliderPosition(p => Math.min(98, p + 2));
      } else if (e.key === ' ') {
        e.preventDefault();
        setSliderPosition(50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard, isHovered]);

  /* ─── Fullscreen ─── */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => setIsFullscreen(true));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => setIsFullscreen(false));
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  /* ─── Lens handler ─── */
  const handleLensMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!showLens || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setLensPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const viewModes = [
    { id: 'slider' as const, icon: GripVertical, tip: 'Slider' },
    { id: 'before' as const, icon: Eye, tip: 'Before Only' },
    { id: 'after' as const, icon: Eye, tip: 'After Only' },
    { id: 'overlay' as const, icon: Layers, tip: 'Overlay' },
  ];

  // If one of the images errored, we can skip waiting for it to load
  const bothLoaded = (imageLoaded.left || imageError.left) && (imageLoaded.right || imageError.right);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="slider"
      aria-label="Before and after image comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuetext={`${Math.round(sliderPosition)}% showing before image`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowLens(false); }}
      onMouseMove={handleLensMove}
      style={{
        position: 'relative', width: '100%',
        height: isFullscreen ? '100vh' : height,
        borderRadius: isFullscreen ? 0 : borderRadius,
        overflow: 'hidden', userSelect: 'none',
        border: isFullscreen ? 'none' : '1px solid var(--border-light)',
        boxShadow: isFullscreen ? 'none' : '0 24px 60px rgba(0,0,0,0.5)',
        background: '#0a0a0f',
        transition: 'height 0.3s, box-shadow 0.4s',
        outline: 'none',
      }}
    >
      {/* ── Premium Skeleton loading ── */}
      {!bothLoaded && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50,
          background: '#0a0a0f', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 20
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, #0e0e14 25%, #1a1a28 50%, #0e0e14 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.8s infinite linear',
          }} />
          <div style={{
            position: 'relative', zIndex: 51, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 12
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              border: '3px solid rgba(124,58,237,0.15)',
              borderTopColor: 'var(--primary-light)',
              animation: 'spin 1s linear infinite',
            }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Loading Design Space...
            </span>
          </div>
        </div>
      )}

      {/* ── Background / Right Image ── */}
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#0a0a0f' }}>
        {imageError.right ? (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)',
            color: 'var(--text-secondary)', gap: 10, padding: 20, textAlign: 'center', zIndex: 5
          }}>
            <ImageIcon size={36} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>Failed to load preview image</span>
            <button
              onClick={() => {
                setImageError(s => s.right ? { ...s, right: false } : s);
                setImageLoaded(s => s.right ? { ...s, right: false } : s);
              }}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                color: 'var(--primary-light)', cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <img
            ref={rightImageRef}
            src={rightSrc}
            alt="After"
            // @ts-ignore
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : "lazy"}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: viewMode === 'before' ? 'brightness(0.2)' : 'none',
              transition: 'filter 0.5s ease, opacity 0.5s ease',
              opacity: bothLoaded ? 1 : 0,
            }}
            onLoad={() => setImageLoaded(s => s.right ? s : { ...s, right: true })}
            onError={() => {
              setImageError(s => s.right ? s : { ...s, right: true });
              setImageLoaded(s => s.right ? s : { ...s, right: true });
            }}
          />
        )}
      </div>

      {/* ── Right label ── */}
      {!compact && bothLoaded && (viewMode === 'slider' || viewMode === 'after') && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isHovered ? 1 : 0.7, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            position: 'absolute', top: 20, right: 20, zIndex: 10,
            padding: '8px 18px', borderRadius: 12,
            background: 'rgba(16,185,129,0.2)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(16,185,129,0.3)',
            color: '#34d399', fontSize: 12, fontWeight: 700,
            letterSpacing: 1, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
          {rightLabel}
        </motion.div>
      )}

      {/* ── Left / Before Image ── */}
      <div style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        clipPath: viewMode === 'slider'
          ? `inset(0 ${100 - sliderPosition}% 0 0)`
          : viewMode === 'before' ? 'none'
          : viewMode === 'after' ? 'inset(0 100% 0 0)'
          : 'none',
        transition: viewMode !== 'slider' ? 'clip-path 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
        zIndex: 6,
      }}>
        {imageError.left ? (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)',
            color: 'var(--text-secondary)', gap: 10, padding: 20, textAlign: 'center'
          }}>
            <ImageIcon size={36} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>Failed to load source image</span>
            <button
              onClick={() => {
                setImageError(s => s.left ? { ...s, left: false } : s);
                setImageLoaded(s => s.left ? { ...s, left: false } : s);
              }}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                color: 'var(--primary-light)', cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <img
            ref={leftImageRef}
            src={leftSrc}
            alt="Before"
            // @ts-ignore
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : "lazy"}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: viewMode === 'after' ? 'brightness(0.2)' : 'none',
              transition: 'filter 0.5s ease, opacity 0.5s ease',
              opacity: viewMode === 'overlay' ? overlayOpacity : (bothLoaded ? 1 : 0),
            }}
            onLoad={() => setImageLoaded(s => s.left ? s : { ...s, left: true })}
            onError={() => {
              setImageError(s => s.left ? s : { ...s, left: true });
              setImageLoaded(s => s.left ? s : { ...s, left: true });
            }}
          />
        )}


        {/* ── Left label ── */}
        {!compact && bothLoaded && (viewMode === 'slider' || viewMode === 'before') && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isHovered ? 1 : 0.7, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              position: 'absolute', top: 20, left: 20, zIndex: 10,
              padding: '8px 18px', borderRadius: 12,
              background: 'rgba(124,58,237,0.2)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(124,58,237,0.3)',
              color: '#a78bfa', fontSize: 12, fontWeight: 700,
              letterSpacing: 1, textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 8px #a78bfa' }} />
            {leftLabel}
          </motion.div>
        )}
      </div>

      {/* ── Slider divider line ── */}
      {viewMode === 'slider' && bothLoaded && (
        <div
          style={{
            position: 'absolute', top: 0, bottom: 0, left: `${sliderPosition}%`,
            width: 3, zIndex: 20, transform: 'translateX(-50%)',
            cursor: 'ew-resize',
            background: 'rgba(255,255,255,0.9)',
            boxShadow: '0 0 12px rgba(0,0,0,0.5), 0 0 30px rgba(124,58,237,0.3)',
          }}
          onMouseDown={(e: ReactMouseEvent) => { e.preventDefault(); setIsDragging(true); }}
          onTouchStart={() => setIsDragging(true)}
        >
          {/* Glow trail */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: isDragging ? 40 : 20, opacity: isDragging ? 0.4 : 0.15,
            background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)',
            transition: 'width 0.3s, opacity 0.3s',
            pointerEvents: 'none',
          }} />

          {/* Handle button */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: `translate(-50%, -50%) scale(${isDragging ? 1.15 : 1})`,
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 ${isDragging ? '40px' : '20px'} rgba(124,58,237,${isDragging ? 0.5 : 0.2})`,
            transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s',
            backdropFilter: 'blur(4px)',
          }}>
            {/* Pulsing ring when dragging */}
            {isDragging && (
              <>
                <div style={{
                  position: 'absolute', inset: -8, borderRadius: '50%',
                  border: '2px solid rgba(124,58,237,0.5)',
                  animation: 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                }} />
                <div style={{
                  position: 'absolute', inset: -16, borderRadius: '50%',
                  border: '1px solid rgba(124,58,237,0.3)',
                  animation: 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                  animationDelay: '0.3s',
                }} />
              </>
            )}
            {/* Inner circle gradient */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--gradient-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <GripVertical size={18} color="#fff" />
            </div>
          </div>

          {/* Position indicator */}
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
                  padding: '6px 14px', borderRadius: 10,
                  background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontSize: 12, fontWeight: 700, color: '#fff',
                  whiteSpace: 'nowrap',
                }}
              >
                {Math.round(sliderPosition)}%
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Overlay mode opacity slider ── */}
      {viewMode === 'overlay' && bothLoaded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 30, display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 24px', borderRadius: 16,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Before</span>
          <input
            type="range" min="0" max="1" step="0.01"
            value={overlayOpacity}
            onChange={e => setOverlayOpacity(parseFloat(e.target.value))}
            style={{
              width: 180, height: 6, borderRadius: 3,
              appearance: 'none', WebkitAppearance: 'none',
              background: `linear-gradient(90deg, #a78bfa ${overlayOpacity * 100}%, rgba(255,255,255,0.2) ${overlayOpacity * 100}%)`,
              cursor: 'pointer',
              outline: 'none',
            }}
          />
          <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>After</span>
        </motion.div>
      )}

      {/* ── Bottom control bar ── */}
      <AnimatePresence>
        {showControls && bothLoaded && (isHovered || isDragging || isFullscreen) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute', bottom: viewMode === 'overlay' ? 80 : 20, right: 20, zIndex: 30,
              display: 'flex', gap: 6,
            }}
          >
            {/* View mode buttons */}
            {!compact && viewModes.map(m => (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id)}
                title={m.tip}
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: viewMode === m.id ? 'rgba(124,58,237,0.4)' : 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${viewMode === m.id ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.15)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: viewMode === m.id ? '#a78bfa' : '#fff',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = viewMode === m.id ? 'rgba(124,58,237,0.5)' : 'rgba(0,0,0,0.7)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = viewMode === m.id ? 'rgba(124,58,237,0.4)' : 'rgba(0,0,0,0.5)'; }}
              >
                <m.icon size={16} />
              </button>
            ))}

            {/* Divider */}
            {!compact && <div style={{ width: 1, background: 'rgba(255,255,255,0.15)', margin: '4px 4px' }} />}

            {/* Reset position */}
            {viewMode === 'slider' && (
              <button
                onClick={() => setSliderPosition(50)}
                title="Reset to center"
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; }}
              >
                <RotateCcw size={16} />
              </button>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; }}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Keyboard hint ── */}
      <AnimatePresence>
        {enableKeyboard && isHovered && !isDragging && viewMode === 'slider' && !compact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', bottom: 20, left: 20, zIndex: 30,
              padding: '6px 14px', borderRadius: 10,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <span style={{
              padding: '2px 6px', borderRadius: 4,
              background: 'rgba(255,255,255,0.15)', fontSize: 10, fontWeight: 700,
            }}>← →</span>
            Arrow keys to slide
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
