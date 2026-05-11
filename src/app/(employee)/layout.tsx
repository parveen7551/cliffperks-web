import React from 'react';
import styles from './layout.module.css';
import Logo from '@/components/Logo';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles.announcementBar}>
        New this week: Exclusive travel deals up to 30% off for employees.{' '}
        <a href="/feed?c=travel">Explore Now &rarr;</a>
      </div>

      <header className={styles.mainNav}>
        <div className={styles.navInner}>
          <a href="/feed" className={styles.logoLink}>
            <Logo height={36} />
            <span className={styles.logoText}>
              Cliff<span className={styles.logoAccent}>Perks</span>
            </span>
          </a>

          <div className={styles.searchBox}>
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search 5,000+ perks..."
            />
          </div>

          <div className={styles.navRight}>
            <span className={styles.greeting}>
              Hi, <span className={styles.greetingName}>Parveen</span>
            </span>
            <a href="/points" className={styles.pointsBadge}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              1,240 pts
            </a>
            <button className={styles.cartBtn}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Cart
            </button>
          </div>
        </div>

        <nav className={styles.categoryNav}>
          <div className={styles.categoryInner}>
            <a href="/feed?c=shop" className={styles.categoryLink}>Shop</a>
            <a href="/feed?c=tickets" className={styles.categoryLink}>Tickets</a>
            <a href="/feed?c=travel" className={styles.categoryLink}>Travel</a>
            <a href="/feed?c=dining" className={styles.categoryLink}>Dining</a>
            <a href="/feed?c=wellness" className={styles.categoryLink}>Wellness</a>
            <a href="/feed?c=featured" className={styles.featuredLink}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Featured Offers
            </a>
          </div>
        </nav>
      </header>

      <main className={styles.feedMain}>{children}</main>
    </>
  );
}
