'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Download, ArrowRight, Loader2, AlertCircle, Eye } from 'lucide-react';
import { getSharedDesign } from '@/lib/api';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

interface SharedDesign {
  id: number;
  original_image_url: string;
  generated_image_url: string | null;
  style: string;
  room_type: string;
  mode: string;
  generation_time_ms: number | null;
  created_at: string;
}

export default function SharedDesignPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;
  const [design, setDesign] = useState<SharedDesign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    getSharedDesign(token)
      .then(setDesign)
      .catch(() => setError('This design is no longer available or the link has expired.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <Loader2 style={{ width: 40, height: 40, color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error || !design || !design.generated_image_url) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <AlertCircle size={36} style={{ color: 'var(--danger)' }} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Design Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, textAlign: 'center', maxWidth: 400 }}>
          {error || 'This shared design link is invalid or has expired.'}
        </p>
        <Link href="/" className="btn-primary">
          <Sparkles size={16} /> Go to DesignAI
        </Link>
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
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ width: 15, height: 15, color: '#fff' }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800 }}>DESIGNAI</span>
        </Link>
        <Link href="/studio" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14, borderRadius: 12 }}>
          Try It Free <ArrowRight size={16} />
        </Link>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>
              <Eye size={14} /> Shared Design
            </span>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 8 }}>
              AI Room Transformation
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
              {design.style} • {design.room_type || 'Room'} • {design.mode}
            </p>
          </div>

          <div style={{
            borderRadius: 24, padding: 8, background: 'var(--bg-card)',
            border: '1px solid var(--border)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
            marginBottom: 32,
          }}>
            <BeforeAfterSlider
              leftSrc={design.original_image_url}
              rightSrc={design.generated_image_url}
              leftLabel="Original"
              rightLabel={`${design.style} Design`}
              height={520}
              borderRadius={16}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ padding: '14px 24px', borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 14, color: 'var(--text-secondary)' }}>
              Created {new Date(design.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <Link href="/register" className="btn-primary" style={{ padding: '14px 28px', borderRadius: 16 }}>
              <Sparkles size={16} /> Create Your Own Design
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
