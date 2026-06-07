'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, MessageCircle, Share2, Globe, Send } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
});

export default function ContactSection() {
  return (
    <section id="contact" style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="section-heading" style={{ fontSize: 'clamp(32px, 4vw, 44px)' }}>
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="section-subtext">
            Have a question or want to discuss enterprise solutions? We'd love to hear from you.
          </p>
        </motion.div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 40
        }}>
          {/* Left Column: Form */}
          <motion.div {...fadeUp(0.1)} className="card" style={{ padding: 40 }}>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Send us a message</h3>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>First Name</label>
                  <input type="text" placeholder="Jane" style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none'
                  }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Last Name</label>
                  <input type="text" placeholder="Doe" style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none'
                  }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Email</label>
                <input type="email" placeholder="jane@example.com" style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none'
                }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Subject</label>
                <select style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none'
                }}>
                  <option>General Inquiry</option>
                  <option>Enterprise Sales</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Message</label>
                <textarea rows={4} placeholder="How can we help you?" style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none', resize: 'vertical'
                }} />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '14px', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
                Send Message <Send size={16} />
              </button>
            </form>
          </motion.div>

          {/* Right Column: Contact Info & Map */}
          <motion.div {...fadeUp(0.2)} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', height: 260, position: 'relative', border: '1px solid var(--border)' }}>
              {/* Premium office map/image placeholder */}
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" alt="Office Location" loading="lazy" style={{
                width: '100%', height: '100%', objectFit: 'cover'
              }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
              <div style={{ position: 'absolute', bottom: 20, left: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>DesignAI Headquarters</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>San Francisco, CA</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={20} color="var(--primary-light)" />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>Email Us</div>
                  <a href="mailto:hello@designai.com" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>hello@designai.com</a>
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={20} color="var(--primary-light)" />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>Call Us</div>
                  <a href="tel:+18005550199" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>+1 (800) 555-0199</a>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Follow Us</span>
              <div style={{ width: 40, height: 1, background: 'var(--border)' }} />
              <div style={{ display: 'flex', gap: 12 }}>
                {[MessageCircle, Share2, Globe].map((Icon, i) => (
                  <a key={i} href="#" style={{
                    width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary-light)'; e.currentTarget.style.borderColor = 'var(--primary-light)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
