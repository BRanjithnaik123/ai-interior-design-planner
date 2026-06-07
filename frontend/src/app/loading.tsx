export default function Loading() {
  return (
    <div style={{
      background: 'var(--bg, #08080c)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        {/* Animated logo placeholder */}
        <div style={{
          width: 48, height: 48, borderRadius: 14, margin: '0 auto 24px',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        {/* Skeleton content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <div className="skeleton skeleton-text" style={{ width: 200 }} />
          <div className="skeleton skeleton-text" style={{ width: 160 }} />
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.08); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
