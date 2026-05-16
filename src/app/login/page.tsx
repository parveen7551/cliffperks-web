"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import styles from "./login.module.css";

type Mode = "employee" | "employer";

export default function LoginPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    isHydrated,
    loginEmployer,
    requestEmployeeMagicLink,
    user,
  } = useAuth();

  const [mode, setMode] = useState<Mode>("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bounce already-signed-in users away from /login.
  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !user) return;
    if (user.role === "employer" || user.role === "admin") {
      router.replace("/dashboard");
    } else if (user.role === "employee") {
      router.replace("/feed");
    }
  }, [isHydrated, isAuthenticated, user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "employer") {
        await loginEmployer(email.trim().toLowerCase(), password);
      } else {
        await requestEmployeeMagicLink(email.trim().toLowerCase());
        setMagicSent(true);
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Something went wrong.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={`glass ${styles.card}`}>
        <div className={styles.brand}>
          <Logo height={56} />
          <span className={styles.brandName}>
            <span style={{ color: "#1E2B4A" }}>Cliff</span>
            <span style={{ color: "#F5941D" }}>Perks</span>
          </span>
        </div>
        <p className={styles.tagline}>Sign in to access your perks.</p>

        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "employee"}
            className={`${styles.tab} ${mode === "employee" ? styles.tabActive : ""}`}
            onClick={() => {
              setMode("employee");
              setError(null);
              setMagicSent(false);
            }}
          >
            Employee
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "employer"}
            className={`${styles.tab} ${mode === "employer" ? styles.tabActive : ""}`}
            onClick={() => {
              setMode("employer");
              setError(null);
              setMagicSent(false);
            }}
          >
            Employer
          </button>
        </div>

        {magicSent ? (
          <div className={styles.notice}>
            <strong>Check your inbox.</strong>
            <p>
              If <em>{email}</em> is enrolled in CliffPerks, we just sent a
              one-time sign-in link. The link expires shortly — open it on this
              device to continue.
            </p>
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => {
                setMagicSent(false);
                setEmail("");
              }}
            >
              Send to a different email
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={onSubmit}>
            <label className={styles.label}>
              <span>Work email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="you@company.ca"
                disabled={submitting}
              />
            </label>

            {mode === "employer" && (
              <label className={styles.label}>
                <span>Password</span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  disabled={submitting}
                />
              </label>
            )}

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              className={`btn ${styles.submit}`}
              disabled={submitting}
            >
              {submitting
                ? mode === "employer"
                  ? "Signing in…"
                  : "Sending link…"
                : mode === "employer"
                  ? "Sign in"
                  : "Email me a sign-in link"}
            </button>

            <p className={styles.hint}>
              {mode === "employee"
                ? "We'll email a single-use link valid for 15 minutes — no password needed."
                : "HR managers sign in with the password set by their administrator."}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
