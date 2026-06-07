'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, User, LogOut, Users, Calendar, ChevronDown, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const NAV = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Header() {
  const { user, isAuthenticated, logout, allUsers } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = NAV.filter(item => item.href.startsWith('#')).map(item => item.href.substring(1));
      let current = '';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) current = section;
        }
      }
      if (window.scrollY < 100) current = '';
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(onScroll, 100);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobileOpen(false); setProfileOpen(false); setShowMembers(false); }
    };
    document.addEventListener('keydown', onKey);
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
        setShowMembers(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = useCallback(() => setMobileOpen(prev => !prev), []);

  const handleLogout = () => { setProfileOpen(false); setShowMembers(false); logout(); };

  const handleTryForFree = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById('ai-redesign');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        el.style.transition = 'box-shadow 0.5s ease-in-out';
        el.style.boxShadow = '0 0 0 4px var(--primary), 0 0 40px rgba(124,58,237,0.3)';
        setTimeout(() => { el.style.boxShadow = 'none'; }, 1500);
      }, 500);
    } else {
      window.location.href = '/#ai-redesign';
    }
  };

  const avatarColors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#8b5cf6'];

  const smoothScroll = (href: string, e: React.MouseEvent) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.getElementById(href.substring(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else if (window.location.pathname !== '/') window.location.href = '/' + href;
    }
  };

  return (
    <>
      <header
        role="banner"
        aria-label="Site header"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          padding: scrolled ? '0 24px' : '0 32px',
          height: scrolled ? 60 : 68,
        }}
      >
        {/* Glass background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: scrolled ? 'rgba(8,8,12,0.85)' : 'rgba(8,8,12,0.4)',
          backdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'blur(12px)',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'blur(12px)',
          borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.06)' : 'transparent'}`,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />

        <div style={{
          position: 'relative', maxWidth: 1280, margin: '0 auto', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link href="/" aria-label="DesignAI Home" style={{ display: 'flex', alignItems: 'center', gap: 10, zIndex: 1 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--gradient-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08) rotate(-4deg)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.3)'; }}
            >
              <Sparkles style={{ width: 18, height: 18, color: '#fff' }} aria-hidden="true" />
            </div>
            <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.6px' }}>DESIGNAI</span>
          </Link>

          {/* Desktop Nav — pill container */}
          <nav className="hide-mobile" aria-label="Main navigation" style={{
            display: 'flex', alignItems: 'center', gap: 2,
            padding: '4px 6px', borderRadius: 14,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            {NAV.map(item => {
              const isAnchor = item.href.startsWith('#');
              const isActive = isAnchor && activeSection === item.href.substring(1);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => smoothScroll(item.href, e)}
                  style={{
                    padding: '7px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
                    transition: 'all 0.25s', whiteSpace: 'nowrap',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isAuthenticated && user ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setShowMembers(false); }}
                  aria-label="User menu"
                  aria-expanded={profileOpen}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 12px 5px 5px', borderRadius: 12,
                    background: profileOpen ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${profileOpen ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer', transition: 'all 0.25s', color: 'var(--text)',
                  }}
                  onMouseEnter={e => { if (!profileOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { if (!profileOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: 'var(--gradient-brand)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: '#fff',
                  }}>
                    {getInitials(user.full_name)}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.full_name.split(' ')[0]}
                  </span>
                  <ChevronDown size={13} style={{
                    transition: 'transform 0.25s',
                    transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)',
                    color: 'var(--text-muted)',
                  }} />
                </button>

                {profileOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    width: showMembers ? 340 : 280,
                    background: 'rgba(14,14,20,0.95)', backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 18, boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
                    overflow: 'hidden', animation: 'fadeIn 0.2s ease-out', zIndex: 200,
                  }}>
                    {!showMembers ? (
                      <>
                        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 44, height: 44, borderRadius: 12,
                              background: 'var(--gradient-brand)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0,
                            }}>
                              {getInitials(user.full_name)}
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <p style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.full_name}</p>
                              <p style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                            <Calendar size={12} /> Joined {formatDate(user.created_at)}
                          </div>
                        </div>
                        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Plan</p>
                              <p style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{user.plan}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Credits</p>
                              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-light)' }}>{user.credits}</p>
                            </div>
                          </div>
                        </div>
                        <div style={{ padding: 8 }}>
                          <button onClick={() => setShowMembers(true)} style={{
                            width: '100%', padding: '10px 12px', borderRadius: 10,
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 10,
                            fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', transition: 'background 0.2s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <Users size={16} /> Members ({allUsers.length})
                          </button>
                          <button onClick={handleLogout} style={{
                            width: '100%', padding: '10px 12px', borderRadius: 10,
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 10,
                            fontSize: 13, fontWeight: 500, color: '#ef4444', transition: 'background 0.2s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <LogOut size={16} /> Log out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 700 }}>Members</p>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{allUsers.length} registered user{allUsers.length !== 1 ? 's' : ''}</p>
                          </div>
                          <button onClick={() => setShowMembers(false)} style={{
                            background: 'none', border: 'none', color: 'var(--text-muted)',
                            cursor: 'pointer', fontSize: 12, fontWeight: 600,
                          }}>← Back</button>
                        </div>
                        <div style={{ maxHeight: 300, overflowY: 'auto', padding: 8 }}>
                          {allUsers.length === 0 ? (
                            <p style={{ padding: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>No members yet</p>
                          ) : (
                            allUsers.slice().reverse().map((member, i) => (
                              <div key={member.id} style={{
                                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                                borderRadius: 10, transition: 'background 0.2s',
                              }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <div style={{
                                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                  background: avatarColors[i % avatarColors.length],
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 13, fontWeight: 700, color: '#fff',
                                }}>
                                  {getInitials(member.full_name)}
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                  <p style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {member.full_name}
                                    {member.id === user?.id && (
                                      <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--primary-light)', background: 'rgba(124,58,237,0.1)', padding: '1px 6px', borderRadius: 4 }}>You</span>
                                    )}
                                  </p>
                                  <p style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.email}</p>
                                </div>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                  {formatDate(member.created_at)}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" style={{
                  padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                  color: 'var(--text-secondary)', transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >Log In</Link>
                <a href="#ai-redesign" onClick={handleTryForFree} className="btn-primary" style={{
                  padding: '9px 22px', fontSize: 13, borderRadius: 10,
                  display: 'flex', alignItems: 'center', gap: 6,
                  boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
                }}>
                  Get Started <ArrowRight size={14} />
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="mobile-menu-btn"
            style={{
              background: 'none', border: 'none', color: 'var(--text)',
              padding: 6, display: 'none', cursor: 'pointer', zIndex: 1,
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          role="dialog" aria-modal="true" aria-label="Mobile navigation"
          style={{
            position: 'fixed', inset: 0, zIndex: 99, paddingTop: 68,
            background: 'rgba(8,8,12,0.98)', backdropFilter: 'blur(24px)',
          }}
        >
          <nav aria-label="Mobile navigation" style={{ display: 'flex', flexDirection: 'column', padding: 24, gap: 2 }}>
            {NAV.map(item => {
              const isAnchor = item.href.startsWith('#');
              const isActive = isAnchor && activeSection === item.href.substring(1);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    setMobileOpen(false);
                    if (isAnchor) {
                      e.preventDefault();
                      const el = document.getElementById(item.href.substring(1));
                      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
                      else if (window.location.pathname !== '/') window.location.href = '/' + item.href;
                    }
                  }}
                  style={{
                    padding: '16px 18px', borderRadius: 14, fontSize: 16, fontWeight: 600,
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(124,58,237,0.12)' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {isAuthenticated && user ? (
                <>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                    borderRadius: 14, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
                  }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 11,
                      background: 'var(--gradient-brand)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, fontWeight: 700, color: '#fff',
                    }}>
                      {getInitials(user.full_name)}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{user.full_name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="btn-secondary" style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <LogOut size={16} /> Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary" style={{ textAlign: 'center', borderRadius: 14 }}>Log In</Link>
                  <a href="#ai-redesign" onClick={handleTryForFree} className="btn-primary" style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 8, borderRadius: 14 }}>
                    Get Started Free <ArrowRight size={16} />
                  </a>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
