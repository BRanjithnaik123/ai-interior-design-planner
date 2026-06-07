'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Wand2, Heart, Download, Share2, X, Check, Loader2, Sparkles, Camera, RotateCcw, Home, Palette, Zap, AlertTriangle, Info, CheckCheck } from 'lucide-react';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import Image from 'next/image';
import { getAIStatus } from '@/lib/api';
import { useRouter } from 'next/navigation';

/** Compress an image file to ~500KB before uploading to AI backend */
async function compressImage(file: File, maxDim = 1280, quality = 0.80): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (Math.max(width, height) > maxDim) {
        const ratio = maxDim / Math.max(width, height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }));
          } else {
            resolve(file); // fallback to original if compression fails
          }
        },
        'image/jpeg',
        quality,
      );
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

const STYLES = [
  { name: 'Modern', color: '#7c3aed', desc: 'Sleek lines, neutral palette, polished surfaces.', img: '/images/hero-after.png' },
  { name: 'Minimalist', color: '#06b6d4', desc: 'Clean, uncluttered, serene simplicity.', img: '/images/bedroom-after.png' },
  { name: 'Luxury', color: '#f59e0b', desc: 'Marble, gold accents, crystal lighting.', img: '/images/hero-before.png' },
  { name: 'Scandinavian', color: '#10b981', desc: 'Light wood, cozy textiles, hygge warmth.', img: '/images/bedroom-before.png' },
  { name: 'Contemporary', color: '#ec4899', desc: 'Bold accents, sculptural lighting, current trends.', img: '/images/kitchen-after.png' },
  { name: 'Industrial', color: '#8b5cf6', desc: 'Raw brick, metal fixtures, exposed elements.', img: '/images/kitchen-before.png' },
  { name: 'Bohemian', color: '#f97316', desc: 'Layered textiles, eclectic patterns, earthy vibes.', img: '/images/bedroom-after.png' },
  { name: 'Japandi', color: '#a3a3a3', desc: 'Warm minimalism, natural textures, serene balance.', img: '/images/bedroom-before.png' },
  { name: 'Art Deco', color: '#eab308', desc: 'Geometric patterns, gold & emerald, luxe glamour.', img: '/images/hero-after.png' },
  { name: 'Coastal', color: '#0ea5e9', desc: 'Ocean blues, natural jute, breezy atmosphere.', img: '/images/kitchen-after.png' },
  { name: 'Mid-Century', color: '#d97706', desc: 'Retro furniture, teak wood, organic shapes.', img: '/images/hero-before.png' },
  { name: 'Farmhouse', color: '#78716c', desc: 'Shiplap walls, rustic wood, vintage fixtures.', img: '/images/kitchen-before.png' },
];

const ROOM_TYPES = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining Room', 'Office', 'Exterior'];

const PROGRESS_PHASES = [
  { label: 'Analyzing room structure & geometry...', pct: 12 },
  { label: 'Detecting walls, floors & ceiling regions...', pct: 28 },
  { label: 'Generating style-specific materials & textures...', pct: 45 },
  { label: 'Simulating ambient lighting & atmosphere...', pct: 62 },
  { label: 'Applying cinematic tone mapping & color grade...', pct: 78 },
  { label: 'Rendering photorealistic bloom & detail...', pct: 90 },
  { label: 'Finalizing high-resolution output...', pct: 97 },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
});

export default function AIRedesign() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [roomType, setRoomType] = useState(ROOM_TYPES[0]);
  const [showCamera, setShowCamera] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressPhase, setProgressPhase] = useState(0);
  const [result, setResult] = useState<{ style: string; img: string } | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [aiEngine, setAiEngine] = useState<'checking' | 'replicate' | 'dev_pillow_fallback' | 'offline'>('checking');
  const [generationMode, setGenerationMode] = useState<'full_ai' | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    setIsMobileDevice(/Mobi|Android|iPhone/i.test(navigator.userAgent));
    // Check AI engine status
    getAIStatus().then(status => {
      setAiEngine(status.engine as any);
    }).catch(() => setAiEngine('offline'));
    return () => { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); };
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFileName(file.name);
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => { setUploaded(e.target?.result as string); setResult(null); setError(''); };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const startCamera = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobileDevice) { cameraInputRef.current?.click(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream; setShowCamera(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch { alert('Could not access camera.'); }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          handleFile(file);
        }
      }, 'image/jpeg');
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setShowCamera(false);
  };

  const toggleFav = (key: string) => {
    setFavorites(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  };

  const downloadImage = async (url: string) => {
    try {
      let blob: Blob;
      if (url.startsWith('data:')) {
        // Convert data URL directly to blob (faster, no network)
        const [header, b64] = url.split(',');
        const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bin = atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        blob = new Blob([arr], { type: mime });
      } else {
        const res = await fetch(url);
        blob = await res.blob();
      }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `designai-${selectedStyle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`;
      a.click(); URL.revokeObjectURL(a.href);
    } catch { window.open(url, '_blank'); }
  };

  const shareResult = async (url: string) => {
    if (navigator.share) {
      try { await navigator.share({ title: 'My DesignAI Room', text: `Check out my ${selectedStyle} room redesign!`, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const generate = async () => {
    if (!uploaded || !selectedStyle || !uploadedFile) return;
    setGenerating(true); setProgress(30); setError('');

    try {
      // Compress image before storing
      const compressedFile = await compressImage(uploadedFile, 1280, 0.80);
      setProgress(60);

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        const pendingData = {
          image: base64Data,
          roomType: roomType,
          style: selectedStyle
        };
        sessionStorage.setItem('designai_pending_upload', JSON.stringify(pendingData));
        setProgress(100);
        router.push('/studio');
      };
      reader.onerror = () => {
        setError('Failed to process image files.');
        setGenerating(false);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err: any) {
      console.error(`[AIRedesign] ❌ Error:`, err.message);
      setError(err.message || 'Redirect to Studio failed. Please try again.');
      setGenerating(false);
    }
  };
  const reset = () => {
    setUploaded(null); setUploadedFile(null); setFileName('');
    setSelectedStyle(''); setResult(null); setGenerating(false);
    setProgress(0); setError('');
  };

  const stepsDone = [!!uploaded, !!selectedStyle, !!result];

  return (
    <section id="ai-redesign" style={{ padding: '110px 24px', position: 'relative', background: 'var(--bg-secondary)' }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', bottom: '10%', left: '0', width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative' }}>
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="badge" style={{ marginBottom: 18, display: 'inline-flex', gap: 6 }}>
            <Wand2 size={12} /> Studio Editor
          </span>
          <h2 className="section-heading" style={{ marginBottom: 14 }}>
            Experience the <span className="gradient-text">magic</span>
          </h2>
          <p className="section-subtext">
            Upload any photo and let our AI generate a photorealistic redesign in seconds.
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.1)} style={{
          background: 'var(--bg-card)', borderRadius: 24,
          border: '1px solid var(--border)', overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
        }}>
          {/* Step Indicators */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
            {[
              { num: 1, label: 'Upload Photo', done: stepsDone[0] },
              { num: 2, label: 'Choose Style', done: stepsDone[1] },
              { num: 3, label: 'View Results', done: stepsDone[2] },
            ].map((step, i) => (
              <div key={i} style={{
                flex: 1, padding: '20px 16px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 12,
                borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                background: step.done ? 'linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)' : 'transparent',
                borderBottom: step.done ? '2px solid var(--primary)' : '2px solid transparent',
                transition: 'all 0.3s',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: step.done ? 'var(--gradient-brand)' : 'var(--bg-elevated)',
                  border: step.done ? 'none' : '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: step.done ? '#fff' : 'var(--text-muted)',
                  boxShadow: step.done ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
                }}>
                  {step.done ? <Check size={16} /> : step.num}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: step.done ? 'var(--text)' : 'var(--text-muted)' }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div style={{ padding: '40px' }}>
            {!uploaded ? (
              /* ── Upload Zone ── */
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                style={{
                  border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--border-light)'}`,
                  borderRadius: 20, padding: '80px 40px', textAlign: 'center',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  background: dragOver ? 'rgba(124,58,237,0.04)' : 'transparent',
                  transform: dragOver ? 'scale(1.01)' : 'scale(1)',
                }}
              >
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <div style={{
                  width: 90, height: 90, borderRadius: 28, margin: '0 auto 28px',
                  background: 'var(--gradient-brand)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 12px 36px rgba(124,58,237,0.35)',
                  transform: dragOver ? 'translateY(-10px)' : 'translateY(0)',
                  transition: 'transform 0.3s',
                }}>
                  <Upload size={40} color="#fff" />
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.5px' }}>
                  Drag & Drop your room photo
                </h3>
                <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 36, maxWidth: 460, marginInline: 'auto', lineHeight: 1.6 }}>
                  Upload a clear photo of any space for the most accurate and stunning AI redesign results
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => fileRef.current?.click()} className="btn-primary" style={{ padding: '16px 32px', fontSize: 15, borderRadius: 14 }}>
                    <ImageIcon size={18} /> Browse Files
                  </button>
                  <button onClick={startCamera} className="btn-secondary" style={{ padding: '16px 32px', fontSize: 15, borderRadius: 14 }}>
                    <Camera size={18} /> Take Photo
                  </button>
                </div>
              </div>
            ) : result ? (
              /* ── Results ── */
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '-0.5px' }}>
                    <div style={{ padding: 6, borderRadius: 8, background: 'rgba(124,58,237,0.1)' }}>
                      <Sparkles size={20} style={{ color: 'var(--primary-light)' }} />
                    </div>
                    {result.style} Redesign Complete
                  </h3>
                  <button onClick={reset} className="btn-secondary" style={{ padding: '10px 20px', fontSize: 14, borderRadius: 12 }}>
                    <RotateCcw size={16} /> New Design
                  </button>
                </div>
                <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <BeforeAfterSlider
                    leftSrc={uploaded}
                    rightSrc={result.img}
                    leftLabel="Original"
                    rightLabel={`${result.style} Design`}
                    height={500}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span className="badge" style={{ fontSize: 13, padding: '8px 16px' }}>
                      <Zap size={12} style={{ color: '#10b981' }} /> AI Generated • Photorealistic
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[
                      { icon: Heart, action: () => toggleFav('result'), active: favorites.has('result'), activeColor: '#ef4444', label: 'Save' },
                      { icon: Download, action: () => downloadImage(result.img), label: 'Download' },
                      { icon: Share2, action: () => shareResult(result.img), label: 'Share' },
                    ].map((btn, j) => (
                      <button key={j} onClick={btn.action} title={btn.label} style={{
                        height: 44, borderRadius: 12, padding: '0 18px',
                        background: (btn as any).active ? 'rgba(239,68,68,0.15)' : 'var(--bg-elevated)',
                        border: `1px solid ${(btn as any).active ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        cursor: 'pointer', color: 'var(--text)', fontSize: 14, fontWeight: 500,
                        transition: 'all 0.2s',
                      }}
                        onMouseEnter={e => {
                          if (!(btn as any).active) e.currentTarget.style.background = 'var(--bg-hover)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={e => {
                          if (!(btn as any).active) e.currentTarget.style.background = 'var(--bg-elevated)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <btn.icon size={18}
                          fill={(btn as any).active ? (btn as any).activeColor : 'none'}
                          color={(btn as any).active ? (btn as any).activeColor : 'var(--text-muted)'}
                        />
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ── Preview + Style Selection ── */
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 40 }}>
                  {/* Image Preview & Settings */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}>Your Space</h3>
                      <button onClick={reset} style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444',
                        padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'all 0.2s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                      ><X size={14} /> Remove</button>
                    </div>
                    <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }}>
                      <img src={uploaded} alt="Uploaded room" style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }} />
                      <div style={{
                        position: 'absolute', bottom: 16, left: 16,
                        padding: '8px 16px', borderRadius: 10,
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff', fontSize: 13, fontWeight: 600,
                      }}>{fileName}</div>
                    </div>
                    
                    {/* Room Type */}
                    <div style={{ marginTop: 28 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 14 }}>
                        <Home size={16} /> Room Category
                      </label>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {ROOM_TYPES.map(r => (
                          <button key={r} onClick={() => setRoomType(r)} 
                            style={{ 
                              padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                              background: roomType === r ? 'var(--gradient-brand)' : 'var(--bg-elevated)',
                              border: `1px solid ${roomType === r ? 'transparent' : 'var(--border)'}`,
                              color: roomType === r ? '#fff' : 'var(--text)',
                              cursor: 'pointer', transition: 'all 0.2s',
                              boxShadow: roomType === r ? '0 4px 16px rgba(124,58,237,0.3)' : 'none',
                            }}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Style Selection */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Palette size={18} style={{ color: 'var(--primary-light)' }} /> Choose Aesthetic
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, flex: 1 }}>
                      {STYLES.map(s => {
                        const active = selectedStyle === s.name;
                        return (
                          <button key={s.name} onClick={() => setSelectedStyle(s.name)} style={{
                            position: 'relative', borderRadius: 16, overflow: 'hidden',
                            cursor: 'pointer', border: 'none', padding: 0, textAlign: 'left',
                            aspectRatio: '3/4',
                            outline: active ? '2px solid var(--primary)' : '1px solid var(--border)',
                            outlineOffset: active ? 2 : 0,
                            transition: 'all 0.2s',
                          }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.outline = '1px solid rgba(124,58,237,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.outline = '1px solid var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                          >
                            <Image src={s.img} alt={s.name} fill sizes="(max-width: 768px) 33vw, 180px" style={{ objectFit: 'cover' }} unoptimized
                              onError={(e: any) => { e.target.style.display = 'none'; e.target.parentElement.style.background = `linear-gradient(135deg, ${s.color}33 0%, #1a1a2e 100%)`; }}
                            />
                            <div style={{
                              position: 'absolute', inset: 0,
                              background: active ? 'rgba(124,58,237,0.3)' : 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
                              transition: 'background 0.3s',
                            }} />
                            <div style={{
                              position: 'absolute', top: 10, right: 10, width: 24, height: 24,
                              borderRadius: '50%', background: active ? 'var(--gradient-brand)' : 'rgba(0,0,0,0.4)',
                              border: `2px solid ${active ? 'transparent' : 'rgba(255,255,255,0.4)'}`,
                              backdropFilter: 'blur(4px)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {active && <Check size={14} color="#fff" />}
                            </div>
                            <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto', padding: 14, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '0.3px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{s.name}</span>
                              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 3, lineHeight: 1.3 }}>{s.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Generate Button */}
                    <div style={{ marginTop: 28 }}>
                      <button onClick={generate} disabled={!selectedStyle || generating} className="btn-primary"
                        style={{ width: '100%', padding: '18px', fontSize: 16, borderRadius: 16,
                          opacity: !selectedStyle ? 0.5 : 1,
                          boxShadow: selectedStyle ? '0 8px 32px rgba(124,58,237,0.4)' : 'none',
                        }}>
                        {generating ? (
                          <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Processing your design...</>
                        ) : (
                          <><Sparkles size={20} /> Generate {selectedStyle ? `${selectedStyle} Design` : 'Design'}</>
                        )}
                      </button>
                      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '12px', borderRadius: 10, fontSize: 13, marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><X size={16} />{error}</div>}
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                <AnimatePresence>
                  {generating && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: 40, textAlign: 'center', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: 10, borderRadius: 5, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.02)' }} />
                        <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }}
                          className="progress-stripe"
                          style={{ height: '100%', borderRadius: 5, background: 'var(--gradient-brand)', boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '0 4px' }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>
                          {PROGRESS_PHASES[progressPhase]?.label || 'Processing...'}
                        </p>
                        <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary-light)' }}>{progress}%</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ background: 'var(--bg-card)', borderRadius: 28, overflow: 'hidden', width: '100%', maxWidth: 700, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Camera size={18} style={{ color: 'var(--primary-light)' }} />
                  </div>
                  Take a Photo
                </h3>
                <button onClick={stopCamera} style={{ background: 'var(--bg-elevated)', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                ><X size={18} /></button>
              </div>
              <div style={{ position: 'relative', background: '#000', aspectRatio: '4/3' }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                  <button onClick={capturePhoto} style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '4px solid #fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                  >
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff' }} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 40, x: '-50%' }}
            style={{
              position: 'fixed', bottom: 32, left: '50%',
              zIndex: 9999, padding: '14px 28px', borderRadius: 16,
              background: toast.type === 'error' ? 'rgba(239,68,68,0.95)' : toast.type === 'info' ? 'rgba(6,182,212,0.95)' : 'rgba(16,185,129,0.95)',
              color: '#fff', fontSize: 14, fontWeight: 600,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', gap: 10,
              maxWidth: '90vw',
            }}
            role="alert"
          >
            {toast.type === 'success' ? <CheckCheck size={18} /> : toast.type === 'error' ? <X size={18} /> : <Info size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
