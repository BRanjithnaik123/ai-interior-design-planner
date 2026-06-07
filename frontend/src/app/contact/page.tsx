'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, MapPin, Phone, Send, Play, ArrowRight } from 'lucide-react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

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
                    <Link href="/contact" style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600, color: 'var(--primary-light)' }}>Contact Us</Link>
                    <Link href="/pricing" style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>Pricing</Link>
                    <Link href="/login" style={{ padding: '8px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>Log In</Link>
                    <Link href="/studio" style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--gradient-brand)' }}>Try for Free</Link>
                </nav>
            </header>

            {/* PAGE TITLE */}
            <section style={{ paddingTop: 120, paddingBottom: 24, textAlign: 'center' }}>
                <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 12 }}>Request a <span className="gradient-text">Demo</span></h1>
                <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>See how DesignAI transforms spaces with AI — watch the demo video and get in touch</p>
            </section>

            {/* ══════════ VIDEO SECTION (FIRST — TOP PRIORITY) ══════════ */}
            <section style={{ padding: '20px 24px 60px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <div style={{
                        position: 'relative', borderRadius: 20, overflow: 'hidden',
                        border: '1px solid var(--border-light)',
                        boxShadow: '0 20px 60px rgba(124,58,237,0.12)',
                        aspectRatio: '16/9',
                        background: '#000',
                    }}>
                        {showVideo ? (
                            <iframe
                                src="https://www.youtube.com/embed/8Lmp1Ncaa7Y?autoplay=1"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                style={{ width: '100%', height: '100%', border: 'none' }}
                            />
                        ) : (
                            <>
                                <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&q=80" alt="Demo Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(0,0,0,0.5) 100%)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
                                }}>
                                    <button onClick={() => setShowVideo(true)} style={{
                                        width: 80, height: 80, borderRadius: '50%', border: '3px solid #fff',
                                        background: 'rgba(124,58,237,0.8)', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 0 40px rgba(124,58,237,0.5)',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 0 60px rgba(124,58,237,0.7)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(124,58,237,0.5)'; }}
                                    >
                                        <Play style={{ width: 32, height: 32, color: '#fff', fill: '#fff', marginLeft: 4 }} />
                                    </button>
                                    <p style={{ color: '#fff', fontSize: 18, fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>Watch the Demo</p>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, maxWidth: 400, textAlign: 'center' }}>See how AI transforms rooms from dull to stunning in seconds</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════ DESIGN EXAMPLES BELOW VIDEO ══════════ */}
            <section style={{ padding: '0 24px 60px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>AI Design Transformations</h2>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>Upload any room photo and our AI generates photorealistic renovations in 10+ styles</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 16 }}>
                        {[
                            { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&q=80', label: 'Modern Living Room' },
                            { src: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&q=80', label: 'Kitchen Renovation' },
                            { src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=500&q=80', label: 'Bedroom Redesign' },
                        ].map((img, i) => (
                            <div key={i} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                                <img src={img.src} alt={img.label} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                                <div style={{ position: 'absolute', bottom: 10, left: 10, padding: '5px 12px', borderRadius: 7, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 12, fontWeight: 600 }}>{img.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ CONTACT FORM + INFO ══════════ */}
            <section style={{ padding: '60px 24px 100px', background: 'var(--bg-secondary)' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 40 }}>
                    {/* Info */}
                    <div>
                        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Get in touch</h2>
                        {[
                            { icon: Mail, label: 'Email', val: 'hello@designai.studio' },
                            { icon: Phone, label: 'Phone', val: '+1 (555) 123-4567' },
                            { icon: MapPin, label: 'Address', val: 'San Francisco, CA 94102' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gradient-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <item.icon style={{ width: 20, height: 20, color: 'var(--primary-light)' }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>{item.label}</p>
                                    <p style={{ fontSize: 15, fontWeight: 600 }}>{item.val}</p>
                                </div>
                            </div>
                        ))}
                        <div style={{ marginTop: 32, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80" alt="Office" style={{ width: '100%', display: 'block' }} />
                        </div>
                    </div>

                    {/* Form */}
                    <div className="card" style={{ padding: 32 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Request a Demo</h2>
                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <Send style={{ width: 24, height: 24, color: 'var(--success)' }} />
                                </div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Message sent!</h3>
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>We&apos;ll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {[
                                    { label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                                    { label: 'Email', type: 'email', placeholder: 'john@company.com' },
                                    { label: 'Company', type: 'text', placeholder: 'Acme Corp' },
                                ].map((field, i) => (
                                    <div key={i}>
                                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{field.label}</label>
                                        <input type={field.type} placeholder={field.placeholder} required style={{
                                            width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)',
                                            background: 'var(--bg)', color: 'var(--text)', fontSize: 14, outline: 'none',
                                        }} />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Message</label>
                                    <textarea placeholder="Tell us about your needs..." rows={4} required style={{
                                        width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)',
                                        background: 'var(--bg)', color: 'var(--text)', fontSize: 14, outline: 'none', resize: 'vertical',
                                    }} />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15 }}>Send Message</button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
