'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, ArrowRight, Star, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Small delay for UX polish
    await new Promise(r => setTimeout(r, 600));

    const result = loginUser(email, password);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>

      {/* ── LEFT: Showcase (hidden on mobile) ── */}
      <div className="hide-mobile" style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 48, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f0515 0%, #0a0a1a 100%)',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '30%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" aria-label="DesignAI Home" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--gradient-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles style={{ width: 20, height: 20, color: '#fff' }} aria-hidden="true" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800 }}>DESIGNAI</span>
          </Link>

          <h2 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-1px' }}>
            Transform any space<br />with <span className="gradient-text">AI magic</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, maxWidth: 420 }}>
            Upload a photo, pick a style, and get a photorealistic renovation in seconds.
          </p>

          <div style={{
            borderRadius: 16, overflow: 'hidden',
            border: '1px solid var(--border-light)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)', maxWidth: 480,
          }}>
            <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80"
              alt="Interior Design Showcase" style={{ width: '100%', display: 'block' }} />
          </div>

          <div style={{
            marginTop: 32, padding: 20, borderRadius: 14,
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
            maxWidth: 420,
          }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
              {[1, 2, 3, 4, 5].map(s => <Star key={s} style={{ width: 14, height: 14, fill: '#facc15', color: '#facc15' }} />)}
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
              &ldquo;This app completely transformed how I envision my home. The AI is incredibly accurate!&rdquo;
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, marginTop: 10, color: 'var(--text)' }}>— Sarah M., Interior Designer</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Login Form ── */}
      <div style={{
        width: '100%', maxWidth: 520, minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 32px', background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border)',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>
            Log in to access your designs and credits
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {error && (
              <div role="alert" style={{
                padding: 14, borderRadius: 10,
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                color: '#f87171', fontSize: 13, lineHeight: 1.5,
              }}>{error}</div>
            )}

            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--text-muted)' }} aria-hidden="true" />
                <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input-field" autoComplete="email" />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label htmlFor="password" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--text-muted)' }} aria-hidden="true" />
                <input id="password" type={showPw ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="input-field"
                  style={{ paddingRight: 44 }} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)', padding: 4, cursor: 'pointer',
                  }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{
              width: '100%', marginTop: 8, padding: '16px', fontSize: 15,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? (
                <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</>
              ) : (
                <>Log in <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
