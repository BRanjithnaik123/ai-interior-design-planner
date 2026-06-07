'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Plus, Image as ImageIcon, Folders, LogOut, CreditCard, Loader2, Home, Wand2, Heart } from 'lucide-react';
import { getProjects } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface Project {
  id: number;
  name: string;
  room_type: string;
  created_at: string;
}

const thumbnails = [
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400&q=80',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&q=80',
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) {
      // Try API first, fall back to empty for demo
      getProjects()
        .then(setProjects)
        .catch(() => setProjects([]))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 style={{ width: 40, height: 40, color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, minWidth: 260, borderRight: '1px solid var(--border)',
        background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ width: 14, height: 14, color: '#fff' }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800 }}>DESIGNAI</span>
        </div>
        <nav style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link href="/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
            fontSize: 14, fontWeight: 600, color: 'var(--primary-light)',
            background: 'rgba(124,58,237,0.1)', border: '1px solid var(--border-accent)',
          }}>
            <Folders style={{ width: 18, height: 18 }} /> Projects
          </Link>
          <Link href="/studio" style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
            fontSize: 14, color: 'var(--text-secondary)',
          }}>
            <Wand2 style={{ width: 18, height: 18 }} /> Design Studio
          </Link>
          <Link href="/gallery" style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
            fontSize: 14, color: 'var(--text-secondary)',
          }}>
            <Heart style={{ width: 18, height: 18 }} /> My Gallery
          </Link>
          <Link href="/pricing" style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
            fontSize: 14, color: 'var(--text-secondary)',
          }}>
            <CreditCard style={{ width: 18, height: 18 }} /> Upgrade Plan
          </Link>
        </nav>
        <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ padding: '8px 12px', marginBottom: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 600 }}>{user.full_name || user.email}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user.plan} plan</p>
          </div>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8,
            fontSize: 13, color: 'var(--text-secondary)', background: 'none', border: 'none',
            cursor: 'pointer', width: '100%',
          }}>
            <LogOut style={{ width: 14, height: 14 }} /> Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
                Welcome, {user.full_name?.split(' ')[0] || 'Designer'}
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Manage and organize your design renovations</p>
            </div>
            <Link href="/studio" className="btn-primary" style={{ padding: '12px 24px' }}>
              <Plus style={{ width: 18, height: 18 }} /> New Design
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 20, marginBottom: 40 }}>
            {[
              { label: 'Total Projects', value: projects.length, icon: Folders },
              { label: 'Plan', value: user.plan, icon: CreditCard },
              { label: 'Credits Remaining', value: user.credits, icon: Sparkles, accent: true },
            ].map((s, i) => (
              <div key={i} className="card" style={{
                padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: s.accent ? '1px solid var(--border-accent)' : undefined,
              }}>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{s.label}</p>
                  <p style={{ fontSize: 24, fontWeight: 700, textTransform: 'capitalize', color: s.accent ? 'var(--primary-light)' : 'var(--text)' }}>{s.value}</p>
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: s.accent ? 'rgba(124,58,237,0.1)' : 'var(--bg-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon style={{ width: 20, height: 20, color: s.accent ? 'var(--primary-light)' : 'var(--text-muted)' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{
                width: 80, height: 80, borderRadius: 20,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
              }}>
                <ImageIcon style={{ width: 40, height: 40, color: 'var(--text-muted)' }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No projects yet</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Create your first design to get started</p>
              <Link href="/studio" className="btn-primary">
                <Sparkles style={{ width: 16, height: 16 }} /> Start Designing
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
              {projects.map((project, idx) => (
                <div key={project.id} className="card" style={{ overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ height: 180, overflow: 'hidden' }}>
                    <img src={thumbnails[idx % thumbnails.length]} alt={project.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{project.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
                      <span>{project.room_type}</span>
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
