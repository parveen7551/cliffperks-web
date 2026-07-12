"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

type Status = "verifying" | "error";

/**
 * Callback for the magic-link email. The backend builds the link as:
 *   {FRONTEND_BASE_URL}/auth/verify?token=...
 * (see apps.accounts.services.send_magic_link)
 */
export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyShell />}>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { verifyEmployeeMagicLink } = useAuth();
  const [status, setStatus] = useState<Status>("verifying");
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = params?.get("token") ?? null;
    if (!token) {
      setStatus("error");
      setError("Missing sign-in token.");
      return;
    }

    verifyEmployeeMagicLink(token)
      .catch((err: unknown) => {
        setStatus("error");
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Could not verify sign-in link.");
        }
      });
  }, [params, verifyEmployeeMagicLink]);

  return (
    <VerifyShell status={status} error={error} onRetry={() => router.replace("/login")} />
  );
}

function VerifyShell({
  status = "verifying",
  error = null,
  onRetry,
}: {
  status?: Status;
  error?: string | null;
  onRetry?: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        className="glass"
        style={{
          padding: "2.5rem",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <Logo height={56} />
        </div>

        {status === "verifying" ? (
          <>
            <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Signing you in…</h1>
            <p style={{ color: "var(--text-muted)" }}>
              One moment while we verify your magic link.
            </p>
          </>
        ) : (
          <>
            <h1 style={{ margin: 0, fontSize: "1.25rem", color: "#b91c1c" }}>
              Sign-in failed
            </h1>
            <p style={{ color: "var(--text-muted)" }}>
              {error ?? "That link is invalid or has expired."}
            </p>
            <button
              type="button"
              className="btn"
              style={{ marginTop: "1rem" }}
              onClick={onRetry}
            >
              Request a new link
            </button>
          </>
        )}
      </div>
    </div>
  );
}
