import React from 'react';

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="header-nav glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.png" alt="CliffPerks Logo" style={{ height: '32px', borderRadius: '6px' }} />
        </div>
        <nav className="nav-links">
          <a href="/feed">Feed</a>
          <a href="/points">Points</a>
          <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Log Out</button>
        </nav>
      </header>
      <main className="container">
        {children}
      </main>
    </>
  );
}
