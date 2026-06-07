'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Heart, Download, Share2, Trash2, Filter, Grid, Loader2,
  Image as ImageIcon, Wand2, CreditCard, ChevronLeft, Eye, Link2,
  CheckCheck, X, Info, Folders
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getMyGallery, updateDesign, downloadDesign, deleteDesign, getShareUrl } from '@/lib/api';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

interface GalleryDesign {
  id: number;
  original_image_url: string;
  generated_image_url: string | null;
  style: string;
  room_type: string;
  mode: string;
  is_favorite: boolean;
  generation_time_ms: number | null;
  created_at: string;
}

export default function GalleryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [designs, setDesigns] = useState<GalleryDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [selectedDesign, setSelectedDesign] = useState<GalleryDesign | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) fetchGallery();
  }, [user, authLoading, router, filter]);

  const fetchGallery = async () => {
    try {
      const data = await getMyGallery(filter === 'favorites');
      setDesigns(data);
    } catch {
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (design: GalleryDesign) => {
    const newVal = !design.is_favorite;
    setDesigns(prev => prev.map(d => d.id === design.id ? { ...d, is_favorite: newVal } : d));
    try { await updateDesign(design.id, { is_favorite: newVal }); } catch {}
    showToast(newVal ? 'Added to favorites' : 'Removed from favorites');
  };

  const handleShare = async (design: GalleryDesign) => {
    try {
      const result = await updateDesign(design.id, { is_public: true });
      const url = getShareUrl(result.share_token || '');
      await navigator.clipboard.writeText(url);
      showToast('Share link copied!', 'success');
    } catch {
      showToast('Could not generate share link', 'error');
    }
  };

  const handleDownload = async (design: GalleryDesign) => {
    try {
      await downloadDesign(design.id, design.style);
      showToast('Download started!');
    } catch {
      showToast('Download failed', 'error');
    }
  };

  const handleDelete = async (design: GalleryDesign) => {
    if (!confirm('Delete this design? This cannot be undone.')) return;
    try {
      await deleteDesign(design.id);
      setDesigns(prev => prev.filter(d => d.id !== design.id));
      if (selectedDesign?.id === design.id) setSelectedDesign(null);
      showToast('Design deleted');
    } catch {
      showToast('Failed to delete design', 'error');
    }
  };

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <Loader2 style={{ width: 40, height: 40, color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        height: 60, borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', background: 'var(--bg-secondary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles style={{ width: 15, height: 15, color: '#fff' }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 800 }}>DESIGNAI</span>
          </Link>
          <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Gallery</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/dashboard" style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Folders size={16} /> Dashboard
          </Link>
          <Link href="/studio" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14, borderRadius: 12 }}>
            <Wand2 size={16} /> New Design
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {/* Title & Filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
              My Gallery
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {designs.length} design{designs.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['all', 'favorites'] as const).map(f => (
              <button key={f} onClick={() => { setFilter(f); setLoading(true); }} style={{
                padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                background: filter === f ? 'rgba(124,58,237,0.1)' : 'var(--bg-card)',
                border: `1px solid ${filter === f ? 'rgba(124,58,237,0.3)' : 'var(--border)'}`,
                color: filter === f ? 'var(--primary-light)' : 'var(--text-secondary)',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {f === 'favorites' && <Heart size={14} />}
                {f === 'all' ? 'All Designs' : 'Favorites'}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Loader2 style={{ width: 40, height: 40, color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {/* Empty State */}
        {!loading && designs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{
              width: 80, height: 80, borderRadius: 20,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <ImageIcon style={{ width: 40, height: 40, color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
              {filter === 'favorites' ? 'No favorites yet' : 'No designs yet'}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
              {filter === 'favorites'
                ? 'Heart your favorite transformations to see them here'
                : 'Create your first AI room transformation'}
            </p>
            <Link href="/studio" className="btn-primary">
              <Sparkles size={16} /> Start Designing
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && designs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 20 }}>
            {designs.map((design, idx) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  borderRadius: 20, overflow: 'hidden',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Image */}
                <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10' }}
                  onClick={() => setSelectedDesign(design)}
                >
                  <img
                    src={design.generated_image_url || design.original_image_url}
                    alt={`${design.style} ${design.room_type}`}
                    loading="lazy"
                    onError={e => {
                      const img = e.target as HTMLImageElement;
                      // Try original if generated failed
                      if (img.src !== design.original_image_url && design.original_image_url) {
                        img.src = design.original_image_url;
                      } else {
                        img.style.display = 'none';
                        img.parentElement!.style.background = 'linear-gradient(135deg, #1a1a2e, #16213e)';
                      }
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  {/* Favorite badge */}
                  {design.is_favorite && (
                    <div style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart size={16} fill="#ef4444" color="#ef4444" />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                    opacity: 0, transition: 'opacity 0.3s', display: 'flex',
                    alignItems: 'flex-end', justifyContent: 'center', padding: 16,
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                  >
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Eye size={14} /> View Comparison
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                        {design.style}
                      </h3>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {design.room_type || 'Room'} • {design.mode}
                      </p>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {new Date(design.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[
                      { icon: Heart, tip: 'Favorite', action: () => handleFavorite(design), active: design.is_favorite, activeColor: '#ef4444' },
                      { icon: Link2, tip: 'Share', action: () => handleShare(design) },
                      { icon: Download, tip: 'Download', action: () => handleDownload(design) },
                      { icon: Trash2, tip: 'Delete', action: () => handleDelete(design), danger: true },
                    ].map((btn, i) => (
                      <button key={i} onClick={e => { e.stopPropagation(); btn.action(); }} title={btn.tip} aria-label={btn.tip} style={{
                        width: 34, height: 34, borderRadius: 10, border: 'none',
                        background: (btn as any).active ? 'rgba(239,68,68,0.1)' : 'var(--bg-elevated)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s',
                        color: (btn as any).active ? '#ef4444' : (btn as any).danger ? 'var(--text-muted)' : 'var(--text-secondary)',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = (btn as any).danger ? 'rgba(239,68,68,0.1)' : 'var(--bg-hover)'; if ((btn as any).danger) e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = (btn as any).active ? 'rgba(239,68,68,0.1)' : 'var(--bg-elevated)'; if ((btn as any).danger) e.currentTarget.style.color = 'var(--text-muted)'; }}
                      >
                        <btn.icon size={15} fill={(btn as any).active ? '#ef4444' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedDesign && selectedDesign.generated_image_url && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedDesign(null)}
              style={{
                position: 'fixed', inset: 0, zIndex: 9990,
                background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24,
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{ width: '100%', maxWidth: 900, position: 'relative' }}
              >
                <button onClick={() => setSelectedDesign(null)} aria-label="Close" style={{
                  position: 'absolute', top: -48, right: 0,
                  width: 40, height: 40, borderRadius: 12,
                  background: 'rgba(255,255,255,0.1)', border: 'none',
                  color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <X size={20} />
                </button>

                <div style={{
                  borderRadius: 24, padding: 8, background: 'var(--bg-card)',
                  border: '1px solid var(--border)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                }}>
                  <BeforeAfterSlider
                    leftSrc={selectedDesign.generated_image_url}
                    rightSrc={selectedDesign.original_image_url}
                    leftLabel={selectedDesign.style}
                    rightLabel="Original"
                    height={520}
                    borderRadius={16}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
                  <button onClick={() => handleDownload(selectedDesign)} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 12 }}>
                    <Download size={16} /> Download 4K
                  </button>
                  <button onClick={() => handleShare(selectedDesign)} style={{
                    padding: '12px 24px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600,
                  }}>
                    <Link2 size={16} /> Share
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Toast */}
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
            }}
            role="alert"
          >
            {toast.type === 'success' ? <CheckCheck size={18} /> : toast.type === 'error' ? <X size={18} /> : <Info size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
