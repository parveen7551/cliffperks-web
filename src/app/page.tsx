import React from 'react';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="glass" style={{ padding: '4rem', borderRadius: '24px', maxWidth: '800px', margin: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <img src="/logo.png" alt="CliffPerks Logo" style={{ height: '80px', borderRadius: '12px' }} />
        </div>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
          The modern perk platform for Canadian employees. 
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/auth/login" className="btn">Employer Login</a>
          <a href="/feed" className="btn" style={{ background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Employee Portal</a>
        </div>
      </div>
    </div>
  );
}
