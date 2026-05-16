import React from 'react';
import Logo from '@/components/Logo';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={`glass ${styles.card}`}>
        <div className={styles.brand}>
          <Logo height={80} />
          <span className={styles.brandName}>
            <span style={{ color: '#1E2B4A' }}>Cliff</span>
            <span style={{ color: '#F5941D' }}>Perks</span>
          </span>
        </div>
        <p className={styles.tagline}>
          The modern perk platform for Canadian employees.
        </p>
        <div className={styles.ctas}>
          <a href="/login" className="btn" style={{ background: '#1E2B4A' }}>Employer Login</a>
          <a href="/login" className="btn" style={{ background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Employee Portal</a>
        </div>
      </div>
    </div>
  );
}
