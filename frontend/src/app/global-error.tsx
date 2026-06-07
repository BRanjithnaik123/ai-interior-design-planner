'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{
        background: '#08080c', color: '#f0f0f5', fontFamily: 'Inter, sans-serif',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: 24,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20, margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36,
          }}>⚠️</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 15, color: '#a0a0b0', marginBottom: 32, lineHeight: 1.6 }}>
            We encountered an unexpected error. Please try again or return to the homepage.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{
                padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                color: '#fff', border: 'none', cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                background: 'rgba(255,255,255,0.06)', color: '#f0f0f5',
                border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none',
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
