'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, Download, Share2, Eye, FolderOpen, Plus, Search, MoreHorizontal, X, ArrowLeft } from 'lucide-react';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

const INITIAL_PROJECTS = [
  { id: 1, name: 'Living Room Makeover', room: 'Living Room', style: 'Modern', date: '2024-12-15',
    thumb: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80',
    before: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80',
    after: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=700&q=80', status: 'Completed' },
  { id: 2, name: 'Kitchen Renovation', room: 'Kitchen', style: 'Contemporary', date: '2024-12-10',
    thumb: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&q=80',
    before: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80',
    after: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=700&q=80', status: 'Completed' },
  { id: 3, name: 'Master Bedroom', room: 'Bedroom', style: 'Minimalist', date: '2024-12-05',
    thumb: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=80',
    before: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=700&q=80',
    after: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=700&q=80', status: 'Completed' },
  { id: 4, name: 'Bathroom Update', room: 'Bathroom', style: 'Luxury', date: '2024-11-28',
    thumb: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80',
    before: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=700&q=80',
    after: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=700&q=80', status: 'Completed' },
  { id: 5, name: 'Dining Room Upgrade', room: 'Dining Room', style: 'Scandinavian', date: '2024-11-20',
    thumb: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400&q=80',
    before: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=700&q=80',
    after: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=700&q=80', status: 'Completed' },
  { id: 6, name: 'Home Office', room: 'Office', style: 'Industrial', date: '2024-11-15',
    thumb: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80',
    before: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=700&q=80',
    after: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=80', status: 'Completed' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
});

export default function ProjectHistory() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [viewProject, setViewProject] = useState<typeof INITIAL_PROJECTS[0] | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRoom, setNewRoom] = useState('Living Room');

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.room.toLowerCase().includes(search.toLowerCase())
  );

  const deleteProject = (id: number) => { setProjects(prev => prev.filter(p => p.id !== id)); setOpenMenu(null); };
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const createProject = () => {
    if (!newName.trim()) return;
    const p = {
      id: Date.now(), name: newName, room: newRoom, style: 'Modern',
      date: new Date().toISOString().split('T')[0], status: 'In Progress',
      thumb: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
      before: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=80',
      after: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=700&q=80',
    };
    setProjects(prev => [p, ...prev]); setShowNewProject(false); setNewName('');
  };

  return (
    <>
      <section id="history" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}><Clock size={14} /> Project History</span>
            <h2 className="section-heading" style={{ marginBottom: 14 }}>Your <span className="gradient-text">design journey</span></h2>
            <p className="section-subtext">All your AI-generated renovations in one place</p>
          </motion.div>

          {/* Toolbar */}
          <motion.div {...fadeUp(0.1)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 360 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="input-field" />
            </div>
            <button onClick={() => setShowNewProject(true)} className="btn-primary" style={{ padding: '11px 22px', fontSize: 13 }}>
              <Plus size={16} /> New Project
            </button>
          </motion.div>

          {/* New Project Form */}
          <AnimatePresence>
            {showNewProject && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginBottom: 24 }}>
                <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Create New Project</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 12, alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Project Name</label>
                      <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="My Renovation"
                        className="input-field" style={{ paddingLeft: 14 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Room Type</label>
                      <select value={newRoom} onChange={e => setNewRoom(e.target.value)}
                        style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius)', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14 }}>
                        {['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Dining Room', 'Office'].map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                    <button onClick={createProject} className="btn-primary" style={{ padding: '14px 24px' }}>Create</button>
                    <button onClick={() => setShowNewProject(false)} className="btn-secondary" style={{ padding: '14px 18px' }}><X size={16} /></button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Projects Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
            {filtered.map((project, i) => (
              <motion.div key={project.id} {...fadeUp(i * 0.06)} className="card" style={{ overflow: 'hidden', position: 'relative' }}>
                <div onClick={() => setViewProject(project)} style={{ height: 180, overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
                  <img src={project.thumb} alt={project.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,12,0.7) 0%, transparent 50%)' }} />
                  <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 6,
                    background: project.status === 'Completed' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                    color: project.status === 'Completed' ? '#10b981' : '#f59e0b',
                    fontSize: 11, fontWeight: 700, border: `1px solid ${project.status === 'Completed' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
                    {project.status === 'Completed' ? '✓' : '⟳'} {project.status}
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s', background: 'rgba(0,0,0,0.4)' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                    <div style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Eye size={16} /> View Project
                    </div>
                  </div>
                </div>
                <div style={{ padding: '18px 20px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{project.name}</h3>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                        <span style={{ padding: '3px 8px', borderRadius: 5, fontSize: 10, fontWeight: 600, background: 'rgba(124,58,237,0.12)', color: 'var(--primary-light)' }}>{project.room}</span>
                        <span style={{ padding: '3px 8px', borderRadius: 5, fontSize: 10, fontWeight: 600, background: 'rgba(6,182,212,0.12)', color: 'var(--accent-light)' }}>{project.style}</span>
                      </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <button onClick={() => setOpenMenu(openMenu === project.id ? null : project.id)} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <MoreHorizontal size={16} />
                      </button>
                      <AnimatePresence>
                        {openMenu === project.id && (
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, width: 160, zIndex: 50, background: 'var(--bg-elevated)', borderRadius: 12, border: '1px solid var(--border-light)', boxShadow: '0 12px 40px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                            {[
                              { icon: Eye, label: 'View', action: () => { setViewProject(project); setOpenMenu(null); } },
                              { icon: Download, label: 'Download', action: () => setOpenMenu(null) },
                              { icon: Share2, label: 'Share', action: () => setOpenMenu(null) },
                              { icon: Trash2, label: 'Delete', color: '#ef4444', action: () => deleteProject(project.id) },
                            ].map((item, j) => (
                              <button key={j} onClick={item.action} style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: item.color || 'var(--text-secondary)', cursor: 'pointer', borderBottom: j < 3 ? '1px solid var(--border)' : 'none' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                                <item.icon size={14} /> {item.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                    <Clock size={12} /> {formatDate(project.date)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <FolderOpen size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 16, fontWeight: 600 }}>No projects found</p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════ PROJECT DETAIL MODAL ══════════ */}
      <AnimatePresence>
        {viewProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setViewProject(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'auto', padding: '40px 24px' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 800, background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-light)', boxShadow: '0 40px 120px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800 }}>{viewProject.name}</h2>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <span className="badge" style={{ fontSize: 11 }}>{viewProject.room}</span>
                    <span className="badge" style={{ fontSize: 11, background: 'rgba(6,182,212,0.1)', color: 'var(--accent-light)', border: '1px solid rgba(6,182,212,0.2)' }}>{viewProject.style}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {formatDate(viewProject.date)}</span>
                  </div>
                </div>
                <button onClick={() => setViewProject(null)} style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <X size={20} />
                </button>
              </div>
              {/* Before/After */}
              <div style={{ padding: '32px' }}>
                <BeforeAfterSlider leftSrc={viewProject.after} rightSrc={viewProject.before}
                  leftLabel={`${viewProject.style} Design`} rightLabel="Original" height={400} borderRadius={16} />
                <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>← Drag to compare →</p>
                {/* Actions */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                  <button className="btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}><Download size={16} /> Download</button>
                  <button className="btn-secondary" style={{ padding: '12px 28px', fontSize: 14 }}><Share2 size={16} /> Share</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
