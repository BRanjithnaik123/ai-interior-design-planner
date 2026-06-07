'use client';
import React from 'react';
import Link from 'next/link';
import { Sparkles, Check, ArrowRight, Star, Smartphone } from 'lucide-react';

export default function MobilePage() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
            {/* Header */}
            <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles style={{ width: 18, height: 18, color: '#fff' }} /></div>
                    <span style={{ fontSize: 17, fontWeight: 800 }}>DESIGNAI</span>
                </Link>
                <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Link href="/features" style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>Features</Link>
                    <Link href="/mobile" style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600, color: 'var(--primary-light)' }}>Mobile App</Link>
                    <Link href="/pricing" style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>Pricing</Link>
                    <Link href="/login" style={{ padding: '8px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>Log In</Link>
                    <Link href="/studio" style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--gradient-brand)' }}>Try for Free</Link>
                </nav>
            </header>

            {/* HERO */}
            <section style={{ paddingTop: 130, paddingBottom: 60, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '10%', left: '30%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
                <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16, position: 'relative' }}>Download our app to transcend<br />in the <span className="gradient-text">metaverse of renovation</span></h1>
                <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 40px', position: 'relative' }}>Your personal AI interior designer, in your pocket.</p>
                <Link href="/studio" className="btn-primary" style={{ padding: '16px 32px', fontSize: 16, position: 'relative', zIndex: 1 }}>Download the App <ArrowRight style={{ width: 18, height: 18 }} /></Link>
            </section>

            {/* PHONE MOCKUP — App Inside Phone Frame */}
            <section style={{ padding: '0 24px 80px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>

                    {/* Phone 1 */}
                    <div style={{ position: 'relative' }}>
                        {/* Phone frame */}
                        <div style={{
                            width: 280, height: 560,
                            borderRadius: 40,
                            border: '6px solid rgba(255,255,255,0.15)',
                            background: '#111',
                            padding: 10,
                            boxShadow: '0 30px 80px rgba(124,58,237,0.2), 0 0 0 1px rgba(255,255,255,0.05)',
                            position: 'relative',
                        }}>
                            {/* Notch */}
                            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 100, height: 28, borderRadius: 20, background: '#111', zIndex: 5 }} />
                            {/* Screen */}
                            <div style={{ width: '100%', height: '100%', borderRadius: 32, overflow: 'hidden', position: 'relative' }}>
                                <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&q=80" alt="App Screen - Home" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {/* App UI overlay */}
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.8) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20 }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Sparkles style={{ width: 12, height: 12, color: '#fff' }} />
                                            </div>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>DesignAI</span>
                                        </div>
                                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Modern Living Room</p>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                            {['Modern', 'Minimal', 'Boho'].map((s, i) => (
                                                <span key={i} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 10, fontWeight: 600, color: '#fff', background: i === 0 ? 'rgba(124,58,237,0.8)' : 'rgba(255,255,255,0.15)' }}>{s}</span>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <div style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(124,58,237,0.8)', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>Generate</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phone 2 */}
                    <div style={{ position: 'relative', marginTop: 60 }}>
                        <div style={{
                            width: 280, height: 560,
                            borderRadius: 40,
                            border: '6px solid rgba(255,255,255,0.15)',
                            background: '#111',
                            padding: 10,
                            boxShadow: '0 30px 80px rgba(6,182,212,0.15), 0 0 0 1px rgba(255,255,255,0.05)',
                        }}>
                            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 100, height: 28, borderRadius: 20, background: '#111', zIndex: 5 }} />
                            <div style={{ width: '100%', height: '100%', borderRadius: 32, overflow: 'hidden', position: 'relative' }}>
                                <img src="https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&q=80" alt="App Screen - Kitchen" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.8) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20 }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Sparkles style={{ width: 12, height: 12, color: '#fff' }} />
                                            </div>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>DesignAI</span>
                                        </div>
                                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Kitchen Renovation</p>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                            <div style={{ display: 'flex', gap: 2 }}>
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} style={{ width: 12, height: 12, fill: '#facc15', color: '#facc15' }} />)}
                                            </div>
                                            <span style={{ fontSize: 10, color: '#fff' }}>4.8 Rating</span>
                                        </div>
                                        <div style={{ padding: '10px', borderRadius: 10, background: 'rgba(124,58,237,0.8)', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>View Result</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES LIST */}
            <section style={{ padding: '60px 24px 80px', background: 'var(--bg-secondary)' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 40 }}>All features in your hand</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 16 }}>
                        {[
                            'Renovate any room instantly',
                            'Virtual staging with AI',
                            '100+ design styles',
                            'Sync across all devices',
                            '4K quality renders',
                            'Before & after comparison',
                            'Mask & inpaint areas',
                            'Wall paint changer',
                            'Exterior renovations',
                            'Offline mode support',
                        ].map((f, i) => (
                            <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Check style={{ width: 18, height: 18, color: 'var(--success)', flexShrink: 0 }} />
                                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* APP STORE RATING */}
            <section style={{ padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} style={{ width: 24, height: 24, fill: '#facc15', color: '#facc15' }} />)}
                </div>
                <p style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>4.8</p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>App Store Rating</p>
                <Link href="/studio" className="btn-primary" style={{ padding: '16px 36px', fontSize: 16 }}>Get Started Free <ArrowRight style={{ width: 18, height: 18 }} /></Link>
            </section>
        </div>
    );
}
