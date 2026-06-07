'use client';
import React from 'react';
import Link from 'next/link';
import { Sparkles, Building2, Users, Zap, Shield, ArrowRight, Check } from 'lucide-react';

export default function EnterprisePage() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
            <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles style={{ width: 18, height: 18, color: '#fff' }} /></div>
                    <span style={{ fontSize: 17, fontWeight: 800 }}>DESIGNAI</span>
                </Link>
                <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Link href="/features" style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>Features</Link>
                    <Link href="/enterprise" style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600, color: 'var(--primary-light)' }}>Enterprise</Link>
                    <Link href="/pricing" style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>Pricing</Link>
                    <Link href="/login" style={{ padding: '8px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>Log In</Link>
                    <Link href="/studio" style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--gradient-brand)' }}>Try for Free</Link>
                </nav>
            </header>

            <section style={{ paddingTop: 130, paddingBottom: 60, textAlign: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: 'var(--primary-light)', marginBottom: 20 }}>
                    <Building2 style={{ width: 14, height: 14 }} /> Enterprise Solutions
                </span>
                <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16 }}>AI renovation at <span className="gradient-text">enterprise scale</span></h1>
                <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 40px' }}>Dedicated GPU servers, API access, custom watermarks, and priority support for your business.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <Link href="/contact" className="btn-primary" style={{ padding: '16px 32px', fontSize: 16 }}>Book A Demo</Link>
                    <Link href="/pricing" className="btn-secondary" style={{ padding: '16px 32px' }}>See Pricing</Link>
                </div>
            </section>

            <section style={{ padding: '40px 24px 100px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 20 }}>
                    {[
                        { icon: Users, title: 'Team Management', desc: 'Manage multiple users, roles, and permissions across your organization.' },
                        { icon: Zap, title: 'Dedicated GPU', desc: 'Dedicated GPU servers for ultra-fast rendering and zero queue times.' },
                        { icon: Shield, title: 'API Access', desc: 'Full API access for custom integrations with your existing workflow.' },
                    ].map((f, i) => (
                        <div key={i} className="card" style={{ padding: 28, textAlign: 'center' }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, margin: '0 auto 16px', background: 'var(--gradient-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <f.icon style={{ width: 22, height: 22, color: 'var(--primary-light)' }} />
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ padding: '60px 24px', background: 'var(--bg-secondary)' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 40, alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>Transformative Virtual Staging</h2>
                        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>Discover how our AI platform helps you showcase the true potential of any property, with powerful features to furnish, paint, polish, and transform any space.</p>
                        {['Furnish empty rooms in seconds', 'Commercial & residential styles', 'Ultra quality 4K renders', 'Custom watermark branding'].map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <Check style={{ width: 16, height: 16, color: 'var(--success)' }} />
                                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{f}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                        <img src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=700&q=80" alt="Virtual Staging" style={{ width: '100%', display: 'block' }} />
                    </div>
                </div>
            </section>
        </div>
    );
}
