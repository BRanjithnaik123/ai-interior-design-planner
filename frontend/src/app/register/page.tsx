'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, User, Mail, Lock, ArrowRight, Check, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (name.trim().length < 2) { setError('Please enter your full name.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPw) { setError('Passwords do not match.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // UX polish delay

    const result = registerUser(name, email, password);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 1500);
    } else {
      setError(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>

      {/* ── LEFT: Showcase ── */}
      <div className="hide-mobile" style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 48, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f0515 0%, #0a0a1a 100%)',
      }}>
        <div style={{
          position: 'absolute', bottom: '20%', right: '20%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--gradient-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles style={{ width: 20, height: 20, color: '#fff' }} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800 }}>DESIGNAI</span>
          </Link>

          <h2 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-1px' }}>
            Start designing your<br /><span className="gradient-text">dream space</span> today
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>
            Join thousands of homeowners and professionals using AI to bring their vision to life.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
            {[
              '5 free credits on signup — no card required',
              '100+ professional design styles',
              'Photorealistic 4K quality renders',
              'Before/after comparison tools',
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Check style={{ width: 14, height: 14, color: '#10b981' }} />
                </div>
                {b}
              </div>
            ))}
          </div>

          <div style={{
            borderRadius: 16, overflow: 'hidden',
            border: '1px solid var(--border-light)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            maxWidth: 480,
          }}>
            <img
              src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80"
              alt="Scandinavian Interior Design"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>
      </div>

      {/* ── RIGHT: Register Form ── */}
      <div style={{
        width: '100%', maxWidth: 520, minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 32px', background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border)',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>
            Start designing for free — no credit card required
          </p>

          {success ? (
            <div style={{
              textAlign: 'center', padding: '40px 20px', borderRadius: 16,
              background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(16,185,129,0.15)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              }}>
                <ShieldCheck style={{ width: 28, height: 28, color: '#10b981' }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#10b981' }}>Account created!</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Redirecting you to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && (
                <div role="alert" style={{
                  padding: 14, borderRadius: 10,
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                  color: '#f87171', fontSize: 13, lineHeight: 1.5,
                }}>{error}</div>
              )}

              {/* Full Name */}
              <div>
                <label htmlFor="reg-name" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--text-muted)' }} />
                  <input id="reg-name" type="text" required value={name} onChange={e => setName(e.target.value)}
                    placeholder="John Doe" className="input-field" autoComplete="name" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--text-muted)' }} />
                  <input id="reg-email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" className="input-field" autoComplete="email" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--text-muted)' }} />
                  <input id="reg-password" type={showPw ? 'text' : 'password'} required value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters" className="input-field"
                    style={{ paddingRight: 44 }} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: 'var(--text-muted)', padding: 4, cursor: 'pointer',
                    }}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: password.length >= i * 3
                          ? (password.length >= 12 ? '#10b981' : password.length >= 8 ? '#f59e0b' : '#ef4444')
                          : 'var(--border)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="reg-confirm" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--text-muted)' }} />
                  <input id="reg-confirm" type={showConfirmPw ? 'text' : 'password'} required value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    placeholder="Re-enter password" className="input-field"
                    style={{ paddingRight: 44 }} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} aria-label={showConfirmPw ? 'Hide confirm password' : 'Show confirm password'}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: 'var(--text-muted)', padding: 4, cursor: 'pointer',
                    }}>
                    {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPw.length > 0 && password !== confirmPw && (
                  <p style={{ marginTop: 4, fontSize: 12, color: '#f87171' }}>Passwords do not match</p>
                )}
                {confirmPw.length > 0 && password === confirmPw && (
                  <p style={{ marginTop: 4, fontSize: 12, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Check size={12} /> Passwords match
                  </p>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{
                width: '100%', marginTop: 4, padding: '16px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>
                {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating account...</> : <>Create account <ArrowRight style={{ width: 18, height: 18 }} /></>}
              </button>
            </form>
          )}

          <p style={{ marginTop: 24, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center' }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
