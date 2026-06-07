'use client';
import React from 'react';
import Link from 'next/link';
import { Sparkles, Clock, ArrowRight } from 'lucide-react';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

const POSTS = [
    {
        title: 'How AI is Revolutionizing Home Renovation',
        desc: 'Discover how AI-powered tools are making it easier than ever to plan and visualize home renovations before committing.',
        leftImg: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=700&q=80',
        rightImg: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80',
        date: 'Apr 15, 2024', category: 'Technology'
    },
    {
        title: '10 Kitchen Renovation Ideas for 2024',
        desc: 'From modern minimalist to rustic farmhouse, explore the top kitchen styles transformed with AI visualization.',
        leftImg: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=700&q=80',
        rightImg: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80',
        date: 'Apr 10, 2024', category: 'Inspiration'
    },
    {
        title: 'Bedroom Design Trends You Need to Know',
        desc: 'Transform your bedroom with these trending design ideas, all visualizable with DesignAI.',
        leftImg: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=700&q=80',
        rightImg: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=700&q=80',
        date: 'Apr 5, 2024', category: 'Trends'
    },
    {
        title: 'Before & After: Living Room Transformations',
        desc: 'See incredible living room makeovers powered by DesignAI — from outdated to magazine-worthy.',
        leftImg: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=700&q=80',
        rightImg: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=80',
        date: 'Mar 28, 2024', category: 'Gallery'
    },
    {
        title: 'The Ultimate Guide to AI Interior Design',
        desc: 'Everything you need to know about using AI for interior design, from basics to advanced techniques.',
        leftImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80',
        rightImg: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=700&q=80',
        date: 'Mar 20, 2024', category: 'Guide'
    },
    {
        title: 'Virtual Staging: The Future of Real Estate',
        desc: 'How real estate agents are using virtual staging AI to sell properties faster and at higher prices.',
        leftImg: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=80',
        rightImg: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=700&q=80',
        date: 'Mar 12, 2024', category: 'Real Estate'
    },
];

export default function BlogPage() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
            <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles style={{ width: 18, height: 18, color: '#fff' }} /></div>
                    <span style={{ fontSize: 17, fontWeight: 800 }}>DESIGNAI</span>
                </Link>
                <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Link href="/features" style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>Features</Link>
                    <Link href="/blog" style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600, color: 'var(--primary-light)' }}>Blog</Link>
                    <Link href="/pricing" style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>Pricing</Link>
                    <Link href="/login" style={{ padding: '8px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>Log In</Link>
                    <Link href="/studio" style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--gradient-brand)' }}>Try for Free</Link>
                </nav>
            </header>

            <section style={{ paddingTop: 130, paddingBottom: 40, textAlign: 'center' }}>
                <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 12 }}>Insights & <span className="gradient-text">Updates</span></h1>
                <p style={{ fontSize: 18, color: 'var(--text-secondary)' }}>Explore the latest in AI home renovation, design tips, and inspiration</p>
            </section>

            <section style={{ padding: '0 24px 100px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 24 }}>
                    {POSTS.map((post, i) => (
                        <div key={i} className="card" style={{ overflow: 'hidden' }}>
                            <div style={{ height: 220, position: 'relative' }}>
                                <BeforeAfterSlider
                                    leftSrc={post.leftImg}
                                    rightSrc={post.rightImg}
                                    leftLabel="NEW"
                                    rightLabel="OLD"
                                    height={220}
                                />
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary-light)', background: 'rgba(124,58,237,0.1)', padding: '3px 10px', borderRadius: 6 }}>{post.category}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}><Clock style={{ width: 12, height: 12 }} /> {post.date}</span>
                                </div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{post.title}</h3>
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>{post.desc}</p>
                                <Link href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--primary-light)' }}>
                                    Read Article <ArrowRight style={{ width: 16, height: 16 }} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
