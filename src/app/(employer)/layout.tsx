import React from 'react';

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="header-nav glass" style={{ borderBottomColor: 'var(--primary)' }}>
        <h1>CliffPerks <span style={{ fontWeight: 'normal', color: 'var(--text-muted)', fontSize: '1rem' }}>Employer Portal</span></h1>
        <nav className="nav-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/employees">Employees</a>
          <a href="/announcements">Announcements</a>
          <a href="/settings">Settings</a>
          <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: '#333' }}>Logout</button>
        </nav>
      </header>
      <main className="container">
        {children}
      </main>
    </>
  );
}
