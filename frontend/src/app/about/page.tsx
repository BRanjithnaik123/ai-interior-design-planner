'use client';
import React from 'react';
import Link from 'next/link';
import { Sparkles, Users, Award, Zap, Heart } from 'lucide-react';

export default function AboutPage() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
            <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles style={{ width: 18, height: 18, color: '#fff' }} /></div>
                    <span style={{ fontSize: 17, fontWeight: 800 }}>DESIGNAI</span>
                </Link>
                <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Link href="/features" style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>Features</Link>
                    <Link href="/about" style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600, color: 'var(--primary-light)' }}>About Us</Link>
                    <Link href="/pricing" style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>Pricing</Link>
                    <Link href="/login" style={{ padding: '8px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>Log In</Link>
                    <Link href="/studio" style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--gradient-brand)' }}>Try for Free</Link>
                </nav>
            </header>

            <section style={{ paddingTop: 130, paddingBottom: 60, textAlign: 'center' }}>
                <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16 }}>About <span className="gradient-text">DesignAI</span></h1>
                <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>We&apos;re on a mission to make professional interior design accessible to everyone through the power of AI.</p>
            </section>

            <section style={{ padding: '0 24px 80px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 40, alignItems: 'center' }}>
                    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                        <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=700&q=80" alt="About DesignAI" style={{ width: '100%', display: 'block' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Our Story</h2>
                        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>DesignAI was born from a simple idea: what if anyone could visualize their dream home before spending a single dollar on renovation?</p>
                        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8 }}>Using advanced artificial intelligence and generative models, we help homeowners, designers, and real estate professionals get inspired, visualize, and plan renovations effortlessly.</p>
                    </div>
                </div>
            </section>

            <section style={{ padding: '60px 24px', background: 'var(--bg-secondary)' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 20 }}>
                    {[
                        { icon: Users, val: '500K+', label: 'Users Worldwide' },
                        { icon: Zap, val: '10M+', label: 'Designs Generated' },
                        { icon: Award, val: '4.8', label: 'App Store Rating' },
                        { icon: Heart, val: '98%', label: 'Satisfaction Rate' },
                    ].map((s, i) => (
                        <div key={i} className="card" style={{ padding: 24, textAlign: 'center' }}>
                            <s.icon style={{ width: 24, height: 24, color: 'var(--primary-light)', margin: '0 auto 12px', display: 'block' }} />
                            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{s.val}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
