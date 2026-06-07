'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Building, ShieldCheck, Zap, Users, Code2, Headphones, ArrowRight } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
});

const FEATURES = [
  { icon: Users, title: 'Team Collaboration', desc: 'Invite team members, assign roles, and manage design projects collaboratively in real-time.' },
  { icon: Zap, title: 'Bulk Management', desc: 'Process hundreds of images simultaneously with our enterprise batch-processing pipeline.' },
  { icon: Code2, title: 'API Integration', desc: 'Seamlessly integrate DesignAI into your own platform with our robust developer API.' },
  { icon: Building, title: 'White-Label Solutions', desc: 'Deliver reports and designs to clients with your own branding, logos, and custom domains.' },
  { icon: ShieldCheck, title: 'Enterprise Security', desc: 'Bank-grade encryption, SSO integration, and custom data retention policies.' },
  { icon: Headphones, title: 'Dedicated Support', desc: 'Get priority 24/7 access to our specialized enterprise success and engineering teams.' },
];

export default function EnterpriseSection() {
  return (
    <section id="enterprise" style={{ padding: '100px 24px', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 800, height: 800,
        background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 60%)',
        borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none',
      }} />
      
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 60, maxWidth: 640, marginInline: 'auto' }}>
          <motion.div {...fadeUp()}>
            <span className="badge" style={{ marginBottom: 16, display: 'inline-block' }}>ENTERPRISE</span>
            <h2 className="section-heading" style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: 16 }}>
              Scale your design <span className="gradient-text">operations</span>
            </h2>
            <p className="section-subtext">
              Built for architecture firms, real estate agencies, and large design teams. Unlock the full potential of AI at scale.
            </p>
          </motion.div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 48
        }}>
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="card" style={{ padding: 32 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: 'rgba(124,58,237,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
                }}>
                  <Icon size={24} color="var(--primary-light)" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{feat.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div {...fadeUp(0.3)} style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.15) 100%)',
          border: '1px solid var(--border)', borderRadius: 24, padding: '48px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
          <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Ready to upgrade your workflow?</h3>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 500 }}>
            Contact our sales team to discuss custom pricing, API access, and tailored onboarding for your organization.
          </p>
          <a href="#contact" className="btn-primary" style={{ padding: '16px 36px', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>
            Contact Sales <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
