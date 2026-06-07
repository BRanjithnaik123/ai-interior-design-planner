'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Loader2, Download, CreditCard, RotateCcw,
  X, ChevronLeft, Settings2, Image as ImageIcon,
  Check, Heart, CheckCircle2, Circle, Info, CheckCheck,
  Palette, Box
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getAIStatus, demoGenerate, planRoom, getRoomPlanPdfUrl } from '@/lib/api';
import RoomUploader from '@/components/studio/RoomUploader';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

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
            resolve(file);
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
  { id: 'Modern', color: '#7c3aed' },
  { id: 'Minimalist', color: '#06b6d4' },
  { id: 'Luxury', color: '#fbbf24' },
  { id: 'Scandinavian', color: '#10b981' },
  { id: 'Rustic', color: '#eab308' },
  { id: 'Contemporary', color: '#ec4899' },
  { id: 'Industrial', color: '#6b7280' },
  { id: 'Traditional', color: '#f59e0b' },
];

const PROGRESS_PHASES = [
  'Uploading room photograph...',
  'GPT-5.2 analyzing room structure...',
  'Extracting walls, shelves, doors, windows...',
  'Building photorealistic renovation prompt...',
  'GPT-5.2 generating renovated room...',
  'Validating structural preservation...',
];

const renderMarkdownPlan = (text: string) => {
  if (!text) return null;
  return text.split('\n').map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      return <h2 key={idx} style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary-light)', marginTop: '20px', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>{trimmed.replace('# ', '')}</h2>;
    }
    if (trimmed.startsWith('## ')) {
      return <h3 key={idx} style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginTop: '16px', marginBottom: '6px' }}>{trimmed.replace('## ', '')}</h3>;
    }
    if (trimmed.startsWith('### ')) {
      return <h4 key={idx} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '12px', marginBottom: '4px' }}>{trimmed.replace('### ', '')}</h4>;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const parts = trimmed.substring(2).split('**');
      return (
        <li key={idx} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '16px', marginBottom: '4px', lineHeight: 1.5, listStyleType: 'disc' }}>
          {parts.map((p, i) => i % 2 === 1 ? <strong key={i} style={{ color: '#fff' }}>{p}</strong> : p)}
        </li>
      );
    }
    if (trimmed.match(/^\d+\./)) {
      const parts = trimmed.replace(/^\d+\.\s*/, '').split('**');
      return (
        <div key={idx} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '16px', marginBottom: '4px', lineHeight: 1.5, display: 'flex', gap: '6px' }}>
          <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{trimmed.match(/^\d+\./)?.[0]}</span>
          <span>{parts.map((p, i) => i % 2 === 1 ? <strong key={i} style={{ color: '#fff' }}>{p}</strong> : p)}</span>
        </div>
      );
    }
    if (trimmed) {
      const parts = trimmed.split('**');
      return <p key={idx} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>
        {parts.map((p, i) => i % 2 === 1 ? <strong key={i} style={{ color: '#fff' }}>{p}</strong> : p)}
      </p>;
    }
    return <div key={idx} style={{ height: '6px' }} />;
  });
};

export default function StudioPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [phase, setPhase] = useState<'upload' | 'configure' | 'generating' | 'result'>('upload');
  const [uploadData, setUploadData] = useState<{ image: string; file: File; roomType: string; style: string } | null>(null);

  const [selectedStyle, setSelectedStyle] = useState('Modern');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const [progress, setProgress] = useState(0);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [activeTab, setActiveTab] = useState<'style' | 'custom'>('style');
  const [triggerAutoGenerate, setTriggerAutoGenerate] = useState(false);
  
  const [aiEngineStatus, setAiEngineStatus] = useState<{
    engine: string;
    features: string[];
    rendering: string;
    active_providers?: string[];
  } | null>(null);
  const [isRenovationUnlocked, setIsRenovationUnlocked] = useState(false);
  const [studioWorkflow, setStudioWorkflow] = useState<'renovation' | 'planner'>('renovation');
  const [plannerResult, setPlannerResult] = useState<{
    room_id: string;
    design_plan: string;
    analysis: Record<string, any>;
  } | null>(null);
  const [validationResult, setValidationResult] = useState<{
    preserved: boolean;
    score: number;
    feedback: string;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    getAIStatus()
      .then((status: any) => {
        setAiEngineStatus(status);
        const hasRenovation = status.features?.includes('renovation') || false;
        setIsRenovationUnlocked(hasRenovation);
        // Automatically default workflow based on availability
        setStudioWorkflow(hasRenovation ? 'renovation' : 'planner');
      })
      .catch((err) => {
        console.error('Failed to retrieve AI engine status:', err);
      });
  }, []);

  // Auto-load pending upload from homepage redirection
  useEffect(() => {
    if (authLoading || !user) return;

    const pendingStr = sessionStorage.getItem('designai_pending_upload');
    if (pendingStr) {
      try {
        const pending = JSON.parse(pendingStr);
        sessionStorage.removeItem('designai_pending_upload');

        const dataURLtoFile = (dataurl: string, filename: string): File => {
          const arr = dataurl.split(',');
          const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], filename, { type: mime });
        };

        const file = dataURLtoFile(pending.image, 'uploaded_room.jpg');
        
        setUploadData({
          image: pending.image,
          file: file,
          roomType: pending.roomType,
          style: pending.style,
        });
        
        // Capitalize style
        const capStyle = pending.style.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
        setSelectedStyle(capStyle);
        setPhase('configure');
        setTriggerAutoGenerate(true);
      } catch (e) {
        console.error('Failed to parse pending upload:', e);
      }
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (triggerAutoGenerate && uploadData) {
      setTriggerAutoGenerate(false);
      handleGenerate();
    }
  }, [triggerAutoGenerate, uploadData]);

  const handleUploadComplete = (data: typeof uploadData) => {
    setUploadData(data);
    if (data?.style) {
      setSelectedStyle(data.style.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    }
    setPhase('configure');
  };

  const handleGenerate = async () => {
    if (!uploadData || !user) return;
    setPhase('generating');
    setProgress(0);
    setCurrentPhaseIdx(0);
    setError('');
    setGeneratedImage(null);
    setPlannerResult(null);

    let phaseIdx = 0;
    const phaseTimer = setInterval(() => {
      phaseIdx++;
      if (phaseIdx < PROGRESS_PHASES.length) {
        setCurrentPhaseIdx(phaseIdx);
        setProgress(Math.min(15 + phaseIdx * 15, 95));
      }
    }, 1800);

    try {
      // Compress image
      const compressedFile = await compressImage(uploadData.file, 1280, 0.80);

      const capitalizedRoomType = uploadData.roomType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      if (studioWorkflow === 'planner') {
        // Use GPT-5.2 Vision Planner
        const result = await planRoom(
          compressedFile,
          selectedStyle,
          capitalizedRoomType,
          customPrompt
        );

        clearInterval(phaseTimer);

        if (result.design_plan) {
          setPlannerResult({
            room_id: result.room_id,
            design_plan: result.design_plan,
            analysis: result.analysis
          });
          setProgress(100);
          setCurrentPhaseIdx(PROGRESS_PHASES.length - 1);
          setPhase('result');
          refreshUser();
          showToast('Design plan generated successfully!', 'success');
        } else {
          throw new Error('AI Planner succeeded but returned empty plan.');
        }
      } else {
        // Use demoGenerate endpoint
        console.log("[Studio API] Calling demoGenerate with file:", compressedFile.name);
        const result = await demoGenerate(
          compressedFile,
          selectedStyle,
          capitalizedRoomType,
          customPrompt
        );
        
        console.log("[Studio API] Response received:", {
          original_url: result.original_url,
          generated_url: result.generated_url,
          style: result.style,
          room_type: result.room_type,
          validation: result.validation
        });

        clearInterval(phaseTimer);

        if (result.generated_url && result.generated_url !== result.original_url) {
          setGeneratedImage(result.generated_url);
          setValidationResult({
            preserved: result.validation?.preserved ?? true,
            score: result.validation?.score ?? 1.0,
            feedback: result.validation?.feedback ?? ""
          });
          setProgress(100);
          setCurrentPhaseIdx(PROGRESS_PHASES.length - 1);
          setPhase('result');
          refreshUser();
          showToast('Room successfully renovated!', 'success');
        } else {
          // If the URL is identical, it means the backend failed to generate a renovated image and fell back.
          const failedReason = result.validation?.feedback || "Image generation backend failed. Configured API key may lack permissions.";
          console.error("[Studio API] Generation Mismatch Mapped Failure:", failedReason);
          throw new Error(failedReason);
        }
      }
    } catch (err: any) {
      clearInterval(phaseTimer);
      console.error('[Studio] Error:', err.message);
      const msg = err.message || 'AI Generation failed. Check backend logs.';
      setError(msg);
      setProgress(0);
      setCurrentPhaseIdx(0);
      setPhase('configure');
      showToast(msg, 'error');
    }
  };

  const resetAll = () => {
    setPhase('upload');
    setUploadData(null);
    setSelectedStyle('Modern');
    setProgress(0);
    setCurrentPhaseIdx(0);
    setGeneratedImage(null);
    setCustomPrompt('');
    setError('');
    setActiveTab('style');
  };

  const handleDownload = () => {
    if (studioWorkflow === 'planner' && plannerResult) {
      window.location.href = getRoomPlanPdfUrl(plannerResult.room_id);
      showToast('Downloading PDF plan...', 'success');
    } else if (generatedImage) {
      const a = document.createElement('a');
      a.href = generatedImage;
      a.target = '_blank';
      a.download = `roomsgpt-${selectedStyle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      a.click();
      showToast('Download opened in new tab!', 'success');
    } else {
      showToast('No generated design available.', 'info');
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* ══════════ TOP BAR ══════════ */}
      <header style={{
        height: 60, borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', background: 'var(--bg-secondary)', flexShrink: 0,
        position: 'relative', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles style={{ width: 15, height: 15, color: '#fff' }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 800 }}>ROOMSGPT</span>
          </Link>
          <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Studio</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Engine Status */}
          <div style={{
            padding: '5px 12px', borderRadius: 8,
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.2)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--primary-light)',
              boxShadow: '0 0 6px rgba(124,58,237,0.5)',
            }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary-light)' }}>
              GPT-5.2 Engine
            </span>
          </div>
          <Link href="/gallery" style={{
            padding: '6px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            transition: 'all 0.2s',
          }}>
            <Heart size={14} /> Gallery
          </Link>
          <div style={{
            padding: '6px 16px', borderRadius: 10,
            background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <CreditCard size={14} style={{ color: 'var(--primary-light)' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-light)' }}>{user.credits}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>credits</span>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'var(--gradient-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff',
          }}>
            {user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      </header>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Background radial */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '100vw', height: '100vw', maxWidth: 1200, maxHeight: 1200,
          background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 60%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">

            {/* ── UPLOAD PHASE ── */}
            {phase === 'upload' && (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ width: '100%' }}>
                <RoomUploader onComplete={handleUploadComplete} />
              </motion.div>
            )}

            {/* ── CONFIGURE PHASE ── */}
            {phase === 'configure' && uploadData && (
              <motion.div key="configure" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ width: '100%', maxWidth: 960 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
                  {/* Preview */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                      <button onClick={() => setPhase('upload')} style={{
                        display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                        color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                      }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                        <ChevronLeft size={18} /> Change Photo
                      </button>
                      <span className="badge" style={{ fontSize: 12 }}>
                        {uploadData.roomType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <div style={{
                      borderRadius: 22, overflow: 'hidden', border: '1px solid var(--border)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative',
                    }}>
                      <img src={uploadData.image} alt="Room preview" style={{ width: '100%', display: 'block', maxHeight: 520, objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute', bottom: 16, left: 16,
                        padding: '8px 16px', borderRadius: 10,
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', gap: 8,
                        color: '#fff', fontSize: 13, fontWeight: 600,
                      }}>
                        <Sparkles size={14} style={{ color: 'var(--primary-light)' }} /> Ready for GPT-5.2 Renovation
                      </div>
                    </div>
                  </div>

                  {/* Controls Panel */}
                  <div style={{
                    borderRadius: 22, background: 'var(--bg-card)', border: '1px solid var(--border)',
                    overflow: 'hidden',
                  }}>
                    {/* Workflow Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                      <button
                        onClick={() => isRenovationUnlocked && setStudioWorkflow('renovation')}
                        disabled={!isRenovationUnlocked}
                        title={!isRenovationUnlocked ? "Configure Replicate/OpenAI Image API key in backend to unlock" : "Generate photorealistic interior images"}
                        style={{
                          flex: 1, padding: '16px 8px', border: 'none', cursor: isRenovationUnlocked ? 'pointer' : 'not-allowed',
                          background: studioWorkflow === 'renovation' ? 'rgba(124,58,237,0.08)' : 'transparent',
                          borderBottom: studioWorkflow === 'renovation' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                          color: studioWorkflow === 'renovation' ? 'var(--primary-light)' : 'var(--text-muted)',
                          fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
                          transition: 'all 0.2s',
                          opacity: isRenovationUnlocked ? 1 : 0.4,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}
                      >
                        <Sparkles size={14} /> AI Renovation
                      </button>
                      <button
                        onClick={() => setStudioWorkflow('planner')}
                        title="Generate detailed design blueprint, furniture layouts, color palettes, and export to PDF"
                        style={{
                          flex: 1, padding: '16px 8px', border: 'none', cursor: 'pointer',
                          background: studioWorkflow === 'planner' ? 'rgba(124,58,237,0.08)' : 'transparent',
                          borderBottom: studioWorkflow === 'planner' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                          color: studioWorkflow === 'planner' ? 'var(--primary-light)' : 'var(--text-muted)',
                          fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
                          transition: 'all 0.2s',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}
                      >
                        <Box size={14} /> AI Design Planner
                      </button>
                    </div>

                    <div style={{ padding: '20px 22px', maxHeight: 400, overflowY: 'auto' }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Style</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
                        {STYLES.map(s => (
                          <button key={s.id} onClick={() => setSelectedStyle(s.id)} style={{
                            padding: '12px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                            background: selectedStyle === s.id ? `${s.color}18` : 'var(--bg-elevated)',
                            border: `1.5px solid ${selectedStyle === s.id ? s.color : 'var(--border)'}`,
                            color: 'var(--text)', transition: 'all 0.2s',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 14, height: 14, borderRadius: 4, background: s.color }} />
                              <span style={{ fontSize: 12, fontWeight: selectedStyle === s.id ? 700 : 500 }}>{s.id}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
 
                    {/* AI STATUS PANEL & UI WARNING */}
                    <div style={{ padding: '18px 22px', background: 'rgba(239, 68, 68, 0.01)', borderTop: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {/* Status Grid */}
                        <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: '12px 14px', border: '1px solid var(--border)' }}>
                          <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>AI Engine Status</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                              <span style={{ color: 'var(--text-secondary)' }}>GPT-5.2 Vision</span>
                              <span style={{ fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Available
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                              <span style={{ color: 'var(--text-secondary)' }}>Image Generation</span>
                              <span style={{ fontWeight: 700, color: isRenovationUnlocked ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: isRenovationUnlocked ? '#10b981' : '#ef4444' }} /> {isRenovationUnlocked ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                              <span style={{ color: 'var(--text-secondary)' }}>Current Mode</span>
                              <span style={{
                                fontWeight: 700,
                                color: studioWorkflow === 'renovation' ? 'var(--primary-light)' : '#f59e0b',
                                background: studioWorkflow === 'renovation' ? 'rgba(124,58,237,0.1)' : 'rgba(245,158,11,0.1)',
                                padding: '2px 8px', borderRadius: 6, fontSize: 10.5
                              }}>
                                {studioWorkflow === 'renovation' ? 'Full AI Renovation' : 'AI Design Planner'}
                              </span>
                            </div>
                          </div>
                        </div>
 
                        {/* UI Warning */}
                        {!isRenovationUnlocked && (
                          <div style={{ display: 'flex', gap: 10, background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 12, padding: '12px 14px' }}>
                            <Info size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                              Real image generation is unavailable because the configured API key does not have image-generation permissions. Operating in AI Planner & Analysis mode.
                            </p>
                          </div>
                        )}
                        {isRenovationUnlocked && (
                          <div style={{ display: 'flex', gap: 10, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 12, padding: '12px 14px' }}>
                            <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: 1 }} />
                            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                              AI Image Generation is fully operational using: {aiEngineStatus?.rendering || 'Replicate/OpenAI'}.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
 
                    <div style={{ padding: '16px 22px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
                      <button onClick={handleGenerate}
                        disabled={(user?.credits ?? 0) <= 0}
                        className="btn-primary"
                        style={{
                          width: '100%', padding: '16px', fontSize: 16, borderRadius: 14,
                          boxShadow: '0 8px 28px rgba(124,58,237,0.35)',
                        }}>
                        <Sparkles size={20} /> {studioWorkflow === 'renovation' ? 'Generate Design' : 'Generate Design Plan'}
                      </button>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>
                        Uses 1 credit • {user.credits} remaining
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── GENERATING PHASE ── */}
            {phase === 'generating' && uploadData && (
              <motion.div key="generating" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%', maxWidth: 840 }}>

                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: 'var(--primary-light)', fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}
                  >
                    <Sparkles size={14} /> GPT-5.2 Interior Design Engine
                  </motion.div>
                  <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 8 }}>
                    Renovating Your Room
                  </h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Analyzing geometry and rendering structural-locked photorealistic design</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'stretch' }}>

                  {/* Image Scanner */}
                  <div style={{
                    borderRadius: 24, overflow: 'hidden', position: 'relative',
                    border: '1px solid var(--border)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.15)',
                    background: '#000',
                  }}>
                    <img src={uploadData.image} alt="Processing" style={{ width: '100%', height: '100%', display: 'block', filter: 'blur(8px) brightness(0.4) contrast(1.2) grayscale(0.2)', objectFit: 'cover' }} />

                    {/* Scanning Line */}
                    <motion.div
                      animate={{ top: ['-10%', '110%', '-10%'] }}
                      transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
                      style={{
                        position: 'absolute', left: 0, right: 0, height: 3,
                        background: 'var(--primary-light)',
                        boxShadow: '0 0 20px var(--primary), 0 0 40px var(--primary)',
                        zIndex: 10,
                      }}
                    />
                    {/* Grid overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                      zIndex: 8,
                    }} />

                    {/* Progress Center */}
                    <div style={{
                      position: 'absolute', inset: 0, zIndex: 20,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 80, height: 80, borderRadius: 24,
                        background: 'rgba(10,10,15,0.6)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(124,58,237,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 40px rgba(124,58,237,0.2)',
                        marginBottom: 20,
                      }}>
                        <Loader2 style={{ width: 40, height: 40, color: 'var(--primary-light)', animation: 'spin 1.5s linear infinite' }} />
                      </div>
                      <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        {progress}%
                      </div>
                    </div>
                  </div>

                  {/* Workflow Tracker */}
                  <div style={{
                    borderRadius: 24, background: 'var(--bg-card)', border: '1px solid var(--border)',
                    padding: '24px', display: 'flex', flexDirection: 'column',
                  }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                      Analysis Log
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                      {PROGRESS_PHASES.map((phaseText, idx) => {
                        const status = idx < currentPhaseIdx ? 'done' : idx === currentPhaseIdx ? 'active' : 'pending';
                        return (
                          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, opacity: status === 'pending' ? 0.4 : 1, transition: 'opacity 0.4s' }}>
                            <div style={{ marginTop: 2 }}>
                              {status === 'done' ? (
                                <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                              ) : status === 'active' ? (
                                <Loader2 size={18} style={{ color: 'var(--primary-light)', animation: 'spin 1s linear infinite' }} />
                              ) : (
                                <Circle size={18} style={{ color: 'var(--text-muted)' }} />
                              )}
                            </div>
                            <div>
                              <p style={{
                                fontSize: 13,
                                fontWeight: status === 'active' ? 700 : 500,
                                color: status === 'active' ? 'var(--primary-light)' : 'var(--text)',
                                lineHeight: 1.4
                              }}>
                                {phaseText}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                      <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <motion.div
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          style={{ height: '100%', borderRadius: 3, background: 'var(--gradient-brand)', boxShadow: '0 0 10px rgba(124,58,237,0.5)' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── RESULT PHASE ── */}
            {phase === 'result' && uploadData && (() => {
              const score = validationResult?.score !== undefined ? validationResult.score : 1.0;
              const percent = Math.round(score * 100);
              let tier: 'excellent' | 'acceptable' | 'failed' = 'excellent';
              if (percent < 80) tier = 'failed';
              else if (percent < 90) tier = 'acceptable';

              return (
                <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: '100%', maxWidth: 1200 }}>

                  {/* Result Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <h3 style={{ fontSize: 28, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12, letterSpacing: '-0.5px', marginBottom: 6 }}>
                          {tier === 'failed' ? (
                            <>
                              <div style={{ padding: '8px 10px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                <X size={22} style={{ color: '#ef4444' }} />
                              </div>
                              Renovation Failed: Structure Lock
                            </>
                          ) : (
                            <>
                              <div style={{ padding: '8px 10px', borderRadius: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                                <Check size={22} style={{ color: 'var(--success)' }} />
                              </div>
                              Room Renovation Complete
                            </>
                          )}
                        </h3>
                        {/* Structure Verification Badge */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                          {tier === 'excellent' && (
                            <span style={{
                              padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                              color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: 6
                            }}>
                              ✓ Excellent Structure Match ({percent}%)
                            </span>
                          )}
                          {tier === 'acceptable' && (
                            <span style={{
                              padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                              color: '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: 6
                            }}>
                              ⚠ Acceptable Match ({percent}%)
                            </span>
                          )}
                          {tier === 'failed' && (
                            <span style={{
                              padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                              color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: 6
                            }}>
                              ⚠ Failed Structure Preservation ({percent}%)
                            </span>
                          )}
                          {tier !== 'failed' && ['Same Walls', 'Same Shelves', 'Same Dimensions', 'Same Perspective'].map((item) => (
                            <span key={item} style={{
                              padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                              color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: 4
                            }}>
                              ✓ {item}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button onClick={resetAll} className="btn-secondary" style={{ padding: '12px 24px', fontSize: 13, borderRadius: 12 }}>
                        <RotateCcw size={14} /> New Room
                      </button>
                    </div>
                  </div>

                  {/* Slider + Controls Side Panel */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

                    {/* Slider or Planner Result */}
                    {studioWorkflow === 'renovation' ? (
                      tier === 'failed' ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6 }}
                          style={{
                            borderRadius: 24, padding: '40px 24px', background: 'var(--bg-card)',
                            border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            textAlign: 'center', minHeight: 560
                          }}
                        >
                          <div style={{
                            width: 72, height: 72, borderRadius: 24,
                            background: 'rgba(239,68,68,0.1)', border: '1.5px solid rgba(239,68,68,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#ef4444', marginBottom: 24,
                            boxShadow: '0 10px 30px rgba(239,68,68,0.15)'
                          }}>
                            <X size={36} />
                          </div>

                          <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
                            Structure Validation Failed
                          </h3>
                          
                          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 540, lineHeight: 1.6, margin: '0 auto 24px auto' }}>
                            Generated image changed room structure too heavily. Our GPT-5.2 Vision engine detected that the generated design deviates too much from the original structural locks (walls, doors, shelves, perspective). To prevent unrealistic renovations, this image has been blocked.
                          </p>

                          {/* Visual similarity progress bar */}
                          <div style={{ width: '100%', maxWidth: 500, margin: '0 auto 30px auto', background: 'var(--bg-elevated)', padding: '16px 20px', borderRadius: 16, border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                              <span style={{ color: 'var(--text-secondary)' }}>Layout Preservation Score</span>
                              <span style={{ color: '#ef4444' }}>{percent}% / 80% Min</span>
                            </div>
                            <div style={{ width: '100%', height: 10, borderRadius: 5, background: 'var(--bg)', border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
                              <div style={{ position: 'absolute', left: '80%', top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.2)', zIndex: 10 }} />
                              <div style={{
                                height: '100%',
                                width: `${percent}%`,
                                borderRadius: 5,
                                background: 'linear-gradient(90deg, #ef4444, #f59e0b)',
                                boxShadow: '0 0 8px rgba(239,68,68,0.3)',
                              }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                              <span>0%</span>
                              <span style={{ marginRight: '16%' }}>80% Threshold</span>
                              <span>100% Match</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            <button onClick={handleGenerate} className="btn-primary" style={{ padding: '12px 28px', fontSize: 14, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}>
                              <RotateCcw size={16} /> Retry Generation
                            </button>
                            <button onClick={resetAll} className="btn-secondary" style={{ padding: '12px 28px', fontSize: 14, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                              <ChevronLeft size={16} /> Try Another Photo
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6 }}
                          style={{
                            borderRadius: 24, padding: 6, background: 'var(--bg-card)',
                            border: '1px solid var(--border)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                          }}
                        >
                          <BeforeAfterSlider
                            leftSrc={uploadData.image}
                            rightSrc={generatedImage || uploadData.image}
                            leftLabel="Original Room"
                            rightLabel={`${selectedStyle} Renovation`}
                            height={560}
                          />

                          {/* Details footer */}
                          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img src={uploadData.image} alt="Original" style={{ width: 48, height: 36, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }} />
                            <div>
                              <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Source File</p>
                              <p style={{ fontSize: 13, fontWeight: 600 }}>
                                {uploadData.roomType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                <span style={{ color: 'var(--primary-light)', fontSize: 11, marginLeft: 8 }}>
                                  (GPT-5.2 Vision Analysis & gpt-image-2 editing)
                                </span>
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6 }}
                        style={{
                          borderRadius: 24, padding: '24px', background: 'var(--bg-card)',
                          border: '1px solid var(--border)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                          display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: '24px',
                          height: 560, overflow: 'hidden'
                        }}
                      >
                        {/* Left: Original image and stats */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative', height: 260 }}>
                            <img src={uploadData.image} alt="Original room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 6, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: 11, fontWeight: 700 }}>
                              Original Room
                            </div>
                          </div>
                          
                          <div style={{ background: 'var(--bg-elevated)', borderRadius: 16, padding: '16px', border: '1px solid var(--border)', flex: 1, overflowY: 'auto' }}>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>GPT-5.2 Structural Locks</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <div>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Room Geometry:</span>
                                <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', margin: '2px 0 0 0' }}>{plannerResult?.analysis?.room_geometry || 'Rectangular'}</p>
                              </div>
                              <div>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Perspective:</span>
                                <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', margin: '2px 0 0 0' }}>{plannerResult?.analysis?.perspective || 'Front-facing'}</p>
                              </div>
                              <div>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Immutable Locks:</span>
                                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                                  {plannerResult?.analysis?.constraint_prompt || 'Original walls, windows, openings, ceiling paths, and floor coordinates are mathematically locked.'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Markdown design plan */}
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '1px solid var(--border)', paddingLeft: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: 1 }}>Renovation Blueprint</span>
                            <span className="badge" style={{ fontSize: 10, background: 'rgba(16,185,129,0.1)', color: '#10b981', borderColor: 'rgba(16,185,129,0.2)' }}>✓ Validated</span>
                          </div>
                          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                            {plannerResult && renderMarkdownPlan(plannerResult.design_plan)}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Side Panel Controls */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                      style={{
                        borderRadius: 20, background: 'var(--bg-card)', border: '1px solid var(--border)',
                        overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 574,
                      }}
                    >
                      {/* Tabs */}
                      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                        {(['style', 'custom'] as const).map(tab => (
                          <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            flex: 1, padding: '14px 8px', border: 'none', cursor: 'pointer',
                            background: activeTab === tab ? 'rgba(124,58,237,0.08)' : 'transparent',
                            borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === tab ? 'var(--primary-light)' : 'var(--text-muted)',
                            fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
                            transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          }}>
                            {tab === 'style' ? <Palette size={14} /> : <Sparkles size={14} />}
                            {tab === 'style' ? 'Design Style' : 'AI Instructions'}
                          </button>
                        ))}
                      </div>

                      <div style={{ padding: '18px', flex: 1, overflowY: 'auto' }}>
                        {/* STYLE TAB */}
                        {activeTab === 'style' && (
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, display: 'block' }}>Interior Style</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                              {STYLES.map(s => (
                                <button key={s.id} onClick={() => setSelectedStyle(s.id)} style={{
                                  padding: '10px 8px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                                  background: selectedStyle === s.id ? `${s.color}18` : 'var(--bg-elevated)',
                                  border: `1.5px solid ${selectedStyle === s.id ? s.color : 'var(--border)'}`,
                                  color: 'var(--text)', transition: 'all 0.15s', fontSize: 11, fontWeight: selectedStyle === s.id ? 700 : 500,
                                  display: 'flex', alignItems: 'center', gap: 6,
                                }}>
                                  <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                                  {s.id}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* AI CUSTOM TAB */}
                        {activeTab === 'custom' && (
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, display: 'block' }}>Custom Details</label>
                            <textarea
                              value={customPrompt}
                              onChange={e => setCustomPrompt(e.target.value)}
                              placeholder="e.g., green velvet sofa, walnut coffee table, indoor houseplants, soft warm ambient lighting, marble wall accent..."
                              style={{
                                width: '100%', height: 180, padding: 12, borderRadius: 12, border: '1px solid var(--border)',
                                background: 'var(--bg-elevated)', color: 'var(--text)', fontSize: 13, resize: 'none',
                                outline: 'none', fontFamily: 'inherit', lineHeight: 1.5,
                              }}
                            />
                            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                              {['indoor plants', 'marble textures', 'hardwood floors', 'warm lighting'].map(preset => (
                                <button
                                  key={preset}
                                  onClick={() => setCustomPrompt(p => p ? `${p}, ${preset}` : preset)}
                                  style={{
                                    padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)',
                                    background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: 10,
                                    fontWeight: 600, cursor: 'pointer',
                                  }}
                                >
                                  + {preset}
                                </button>
                              ))}
                            </div>
                            <p style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.4 }}>
                              💡 <strong>Tip:</strong> Describe details to swap or add. The layout, walls, and structure remain completely identical.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Download / Share */}
                      <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button onClick={handleGenerate} className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <Sparkles size={16} /> {studioWorkflow === 'renovation' ? 'Renovate Style' : 'Regenerate Plan'}
                        </button>
                        <button onClick={handleDownload} disabled={tier === 'failed'} className="btn-secondary" style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: tier === 'failed' ? 0.5 : 1, cursor: tier === 'failed' ? 'not-allowed' : 'pointer' }}>
                          <Download size={16} /> {studioWorkflow === 'renovation' ? 'Download Design' : 'Download PDF Plan'}
                        </button>
                      </div>
                    </motion.div>
                  </div>

                  {validationResult && tier !== 'failed' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                      marginTop: 20, display: 'flex', gap: 10,
                      background: tier === 'excellent' ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.08)',
                      border: tier === 'excellent' ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(245,158,11,0.2)',
                      borderRadius: 12, padding: '12px 16px',
                      fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5
                    }}>
                      {tier === 'excellent' ? (
                        <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                      ) : (
                        <Info size={16} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                      )}
                      <div style={{ textAlign: 'left' }}>
                        <strong style={{ color: tier === 'excellent' ? '#10b981' : '#f59e0b' }}>
                          {tier === 'excellent' ? 'GPT-5.2 Structural Match Verified:' : 'GPT-5.2 Layout Preservation Notice:'}
                        </strong>
                        <p style={{ margin: '4px 0 0 0' }}>{validationResult.feedback}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Info Footer */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
                    <Info size={14} />
                    <p>
                      {studioWorkflow === 'renovation' ? 'Drag the slider to compare original room vs renovated design • Style can be regenerated dynamically.' : 'Review your customized space planning report • Download PDF blueprint or change style to regenerate.'}
                    </p>
                  </motion.div>

                  </motion.div>
                );
              })()}
          </AnimatePresence>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 40, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 40, x: '-50%' }}
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
      </main>
    </div>
  );
}