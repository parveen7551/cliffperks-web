'use client';

import React from 'react';

export default function FeedPage() {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Your Personal Feed</h1>
      <div className="grid">
        {/* Mock Offer Cards */}
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="card">
            <div style={{ height: '160px', background: 'var(--border)', borderRadius: '8px', marginBottom: '1rem' }}></div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>10% Off Amazon</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Expires in 2 days • Earn 10 points</p>
            <button className="btn" style={{ width: '100%' }}>
              Redeem Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
