import React from 'react';
import Logo from '@/components/Logo';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="glass" style={{ padding: '4rem', borderRadius: '24px', maxWidth: '800px', margin: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Logo height={80} />
          <span style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}>
            <span style={{ color: '#1E2B4A' }}>Cliff</span>
            <span style={{ color: '#F5941D' }}>Perks</span>
          </span>
        </div>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
          The modern perk platform for Canadian employees.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/auth/login" className="btn" style={{ background: '#1E2B4A' }}>Employer Login</a>
          <a href="/feed" className="btn" style={{ background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Employee Portal</a>
        </div>
      </div>
    </div>
  );
}
