"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { useAuth, useRequireAuth } from "@/context/AuthContext";
import styles from "./layout.module.css";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/employees", label: "Employees" },
  { href: "/announcements", label: "Announcements" },
  { href: "/settings", label: "Settings" },
];

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useRequireAuth("employer");
  const { logout } = useAuth();
  const pathname = usePathname();

  if (!user) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
        Loading…
      </div>
    );
  }

  return (
    <>
      <header className={styles.headerNav}>
        <Link href="/dashboard" className={styles.brandmark}>
          <Logo height={28} />
          <span className={styles.brandName}>
            Cliff<span className={styles.brandAccent}>Perks</span>
          </span>
        </Link>
        <span className={styles.portalLabel}>Employer Portal</span>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname?.startsWith(item.href) ? "page" : undefined}
            className={`${styles.navLink}${
              pathname?.startsWith(item.href) ? ` ${styles.navLinkActive}` : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
        <span className={styles.email}>{user.email}</span>
        <button type="button" className={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </header>
      <main className="container">{children}</main>
    </>
  );
}
