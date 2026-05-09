'use client';

import React from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Analytics Dashboard</h1>
      
      <div className="grid" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span className="text-muted">Total Employees</span>
          <strong style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>450</strong>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span className="text-muted">Monthly Active Users</span>
          <strong style={{ fontSize: '2.5rem' }}>180</strong>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span className="text-muted">Estimated Savings (YTD)</span>
          <strong style={{ fontSize: '2.5rem', color: '#10b981' }}>$4,500</strong>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Daily Redemptions Trend</h3>
        <div style={{ height: '200px', background: 'var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          [Chart Placeholder]
        </div>
      </div>
    </div>
  );
}
