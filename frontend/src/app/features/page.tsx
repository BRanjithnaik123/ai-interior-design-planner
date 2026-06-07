'use client';
import React from 'react';
import Link from 'next/link';
import { Sparkles, Wand2, Sofa, Mountain, PaintBucket, Eraser, Pencil, Home, Layers, Zap, ArrowRight } from 'lucide-react';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

const TOOLS = [
    { icon: Wand2, title: 'Renovate', desc: 'Renovate your space using AI',
      before: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80',
      after: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&q=80' },
    { icon: Sofa, title: 'Virtual Staging', desc: 'Add furniture, light, fixtures, and redesign any type of interior',
      before: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500&q=80',
      after: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=500&q=80', pro: true },
    { icon: Layers, title: 'Elevation', desc: 'Transform your 2D elevations to realistic 3D renders',
      before: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80',
      after: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&q=80' },
    { icon: Zap, title: 'Upscaling', desc: 'Upscale blurry images all the way to 4K resolution',
      before: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80',
      after: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&q=80' },
    { icon: Mountain, title: 'Transform Exteriors', desc: 'Renovate exteriors using AI',
      before: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=500&q=80',
      after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80', pro: true },
    { icon: Home, title: 'Landscaping', desc: 'Create stunning landscape images',
      before: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&q=80',
      after: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=500&q=80', pro: true },
    { icon: Pencil, title: 'Sketch', desc: 'From sketch to stunning renders in seconds',
      before: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&q=80',
      after: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80', pro: true },
    { icon: PaintBucket, title: 'Wall Paint', desc: 'Change wall paint and material',
      before: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&q=80',
      after: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&q=80', pro: true },
    { icon: PaintBucket, title: 'Exterior Paint', desc: 'Change exterior paint color and texture',
      before: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=500&q=80',
      after: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&q=80', pro: true },
    { icon: Eraser, title: 'Clean Up', desc: 'Remove unwanted objects effortlessly',
      before: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500&q=80',
      after: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500&q=80', pro: true },
];

export default function FeaturesPage() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
            <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles style={{ width: 18, height: 18, color: '#fff' }} /></div>
                    <span style={{ fontSize: 17, fontWeight: 800 }}>DESIGNAI</span>
                </Link>
                <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Link href="/features" style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600, color: 'var(--primary-light)' }}>Features</Link>
                    <Link href="/pricing" style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>Pricing</Link>
                    <Link href="/about" style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>About Us</Link>
                    <Link href="/login" style={{ padding: '8px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>Log In</Link>
                    <Link href="/studio" style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--gradient-brand)' }}>Try for Free</Link>
                </nav>
            </header>

            <section style={{ paddingTop: 130, paddingBottom: 60, textAlign: 'center' }}>
                <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16 }}>The most powerful <span className="gradient-text">AI renovation kit</span></h1>
                <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 550, margin: '0 auto' }}>Leverage advanced AI tools to renovate your space, the way you want</p>
            </section>

            <section style={{ padding: '0 24px 100px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 20 }}>
                    {TOOLS.map((tool, i) => (
                        <div key={i} className="card" style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
                            <div style={{ height: 200, position: 'relative' }}>
                                <BeforeAfterSlider
                                    leftSrc={tool.after} rightSrc={tool.before}
                                    leftLabel="After" rightLabel="Before"
                                    height={200} borderRadius={0} compact
                                />
                            </div>
                            {tool.pro && <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--gradient-brand)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6, zIndex: 5 }}>PRO</span>}
                            <div style={{ padding: '20px 24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <tool.icon style={{ width: 20, height: 20, color: 'var(--primary-light)' }} />
                                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>{tool.title}</h3>
                                </div>
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tool.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ padding: '60px 24px', textAlign: 'center', background: 'var(--bg-secondary)' }}>
                <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Ready to try?</h2>
                <Link href="/studio" className="btn-primary" style={{ padding: '16px 36px', fontSize: 16 }}>Get Started Free <ArrowRight style={{ width: 18, height: 18 }} /></Link>
            </section>
        </div>
    );
}
