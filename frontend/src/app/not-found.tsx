import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-inter), Inter, sans-serif',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', padding: 24,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{
          fontSize: 96, fontWeight: 900, lineHeight: 1,
          background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent', marginBottom: 16,
        }}>404</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Page not found
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary" style={{ padding: '14px 32px', fontSize: 15 }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
