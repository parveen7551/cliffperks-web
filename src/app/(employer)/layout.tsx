"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useRequireAuth } from "@/context/AuthContext";

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
      <header className="header-nav glass" style={{ borderBottomColor: "var(--primary)" }}>
        <h1>
          CliffPerks{" "}
          <span style={{ fontWeight: "normal", color: "var(--text-muted)", fontSize: "1rem" }}>
            Employer Portal
          </span>
        </h1>
        <nav className="nav-links">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color:
                  pathname?.startsWith(item.href)
                    ? "var(--foreground)"
                    : "var(--text-muted)",
                fontWeight: pathname?.startsWith(item.href) ? 700 : 500,
              }}
            >
              {item.label}
            </Link>
          ))}
          <span
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              marginLeft: "0.5rem",
            }}
          >
            {user.email}
          </span>
          <button
            type="button"
            className="btn"
            style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", background: "#333" }}
            onClick={logout}
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="container">{children}</main>
    </>
  );
}
