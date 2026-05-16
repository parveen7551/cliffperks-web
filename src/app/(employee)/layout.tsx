"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent, type ReactNode } from "react";
import Logo from "@/components/Logo";
import { employeeApi } from "@/lib/api";
import { qk } from "@/lib/queryKeys";
import { useAuth, useRequireAuth } from "@/context/AuthContext";
import styles from "./layout.module.css";

const POINTS = new Intl.NumberFormat("en-CA");

function EmployeeLayoutFallback() {
  return (
    <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
      Loading…
    </div>
  );
}

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<EmployeeLayoutFallback />}>
      <EmployeeLayoutContent>{children}</EmployeeLayoutContent>
    </Suspense>
  );
}

function EmployeeLayoutContent({ children }: { children: ReactNode }) {
  const user = useRequireAuth("employee");
  const { logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchDraft, setSearchDraft] = useState(searchParams?.get("q") ?? "");

  useEffect(() => {
    setSearchDraft(searchParams?.get("q") ?? "");
  }, [searchParams]);

  const points = useQuery({
    queryKey: qk.employee.points,
    queryFn: () => employeeApi.points(),
    enabled: Boolean(user),
  });

  if (!user) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
        Loading…
      </div>
    );
  }

  const firstName = user.email.split("@")[0];

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = searchDraft.trim();
    router.push(q ? `/offers?search=${encodeURIComponent(q)}` : "/offers");
  }

  return (
    <>
      <div className={styles.announcementBar}>
        New this week: Exclusive travel deals up to 30% off for employees.{" "}
        <Link href="/offers?c=travel">Explore Now &rarr;</Link>
      </div>

      <header className={styles.mainNav}>
        <div className={styles.navInner}>
          <Link href="/feed" className={styles.logoLink}>
            <Logo height={36} />
            <span className={styles.logoText}>
              Cliff<span className={styles.logoAccent}>Perks</span>
            </span>
          </Link>

          <form className={styles.searchBox} onSubmit={onSearch}>
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
              placeholder="Search perks…"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
            />
          </form>

          <div className={styles.navRight}>
            <span className={styles.greeting}>
              Hi,{" "}
              <span className={styles.greetingName}>
                {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
              </span>
            </span>
            <Link href="/points" className={styles.pointsBadge}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {points.data ? POINTS.format(points.data.balance) : "—"} pts
            </Link>
            <button
              type="button"
              className={styles.cartBtn}
              onClick={logout}
              title="Sign out"
            >
              Logout
            </button>
          </div>
        </div>

        <nav className={styles.categoryNav}>
          <div className={styles.categoryInner}>
            <Link href="/offers?c=shopping" className={styles.categoryLink}>Shop</Link>
            <Link href="/offers?c=entertainment" className={styles.categoryLink}>Tickets</Link>
            <Link href="/offers?c=travel" className={styles.categoryLink}>Travel</Link>
            <Link href="/offers?c=dining" className={styles.categoryLink}>Dining</Link>
            <Link href="/offers?c=health" className={styles.categoryLink}>Wellness</Link>
            <Link href="/feed" className={styles.featuredLink}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Featured Offers
            </Link>
          </div>
        </nav>
      </header>

      <main className={styles.feedMain}>{children}</main>
    </>
  );
}
