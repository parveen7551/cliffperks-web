import Link from "next/link";
import Logo from "@/components/Logo";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brandmark}>
          <Logo height={35} />
          <span className={styles.brandName}>
            Cliff<span className={styles.brandAccent}>Perks</span>
          </span>
        </Link>
        <Link href="/login" className={styles.navLink}>
          Employer
        </Link>
        <Link href="/login" className={styles.navLink}>
          Employee
        </Link>
        <Link href="/login" className="btn">
          Get started
        </Link>
      </nav>

      <div className={styles.wrap}>
        <section className={styles.hero}>
          <span className={styles.kicker}>Employee perks, sorted</span>
          <h1 className={styles.display}>
            The modern <span className={styles.displayAccent}>perk</span> platform for
            Canadian employees.
          </h1>
          <p className={styles.sub}>
            Thousands of exclusive discounts on the brands your team already shops —
            shopping, travel, tickets, dining and wellness, all in one place.
          </p>
          <div className={styles.row}>
            <Link href="/login" className="btn">
              Employer Login
            </Link>
            <Link href="/login" className={styles.btnSecondary}>
              Employee Portal
            </Link>
          </div>
        </section>

        <hr className="hr" />

        <section className={styles.stats} aria-label="CliffPerks, by the numbers">
          <div className={styles.statsGrid}>
            <div>
              <p className={styles.statNum}>5,000+</p>
              <p className={styles.statLabel}>Exclusive perks</p>
            </div>
            <div>
              <p className={styles.statNum}>450</p>
              <p className={styles.statLabel}>Employer partners</p>
            </div>
            <div>
              <p className={styles.statNum}>$4,500</p>
              <p className={styles.statLabel}>Avg. annual savings</p>
            </div>
          </div>
        </section>
      </div>

      <div className={styles.wrap}>
        <footer className={styles.pageFooter}>
          CliffPerks — the modern perk platform for Canadian employees.
        </footer>
      </div>
    </>
  );
}
