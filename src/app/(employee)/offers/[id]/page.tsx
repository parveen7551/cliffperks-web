"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  RedemptionErrorBody,
  RedemptionPayload,
} from "@cliffperks/shared";
import { ApiError, employeeApi, offersApi } from "@/lib/api";
import { qk } from "@/lib/queryKeys";
import { discountLabel, offerTheme, offerTitle } from "@/lib/offerDisplay";

interface PageProps {
  // Next 16 App Router — params is a Promise
  params: Promise<{ id: string }>;
}

export default function OfferDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [payload, setPayload] = useState<RedemptionPayload | null>(null);

  const offer = useQuery({
    queryKey: qk.offers.detail(id),
    queryFn: () => offersApi.get(id),
  });

  const redeem = useMutation({
    mutationFn: () => employeeApi.redeem({ offer_id: id }),
    onSuccess: (data) => {
      setPayload(data.payload);
      // Refresh points balance after earning.
      queryClient.invalidateQueries({ queryKey: qk.employee.points });
    },
  });

  if (offer.isLoading) {
    return <p style={{ padding: "3rem", textAlign: "center" }}>Loading…</p>;
  }
  if (offer.isError || !offer.data) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <p style={{ color: "#b91c1c" }}>
          {offer.error instanceof ApiError && offer.error.status === 404
            ? "Offer not found."
            : "Couldn't load this offer."}
        </p>
        <Link href="/offers">← Back to perks</Link>
      </div>
    );
  }

  const o = offer.data;
  const theme = offerTheme(o);

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <Link
        href="/offers"
        style={{
          display: "inline-block",
          marginBottom: "1rem",
          color: "var(--text-muted)",
          textDecoration: "none",
          fontSize: "0.875rem",
        }}
      >
        ← All perks
      </Link>

      <div
        style={{
          background: theme.background,
          borderRadius: 16,
          padding: "3rem 2.5rem",
          color: "#fff",
          marginBottom: "1.5rem",
        }}
      >
        <p
          style={{
            margin: 0,
            opacity: 0.8,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontSize: "0.75rem",
            fontWeight: 700,
          }}
        >
          {o.partner.name}
        </p>
        <h1 style={{ margin: "0.5rem 0", fontSize: "2rem", lineHeight: 1.15 }}>
          {offerTitle(o)}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "1.125rem",
            opacity: 0.9,
            fontWeight: 600,
          }}
        >
          {discountLabel(o)}
        </p>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ marginTop: 0 }}>About this perk</h2>
        <p style={{ whiteSpace: "pre-wrap", color: "var(--text-muted)" }}>
          {o.description_en || `Save on your next purchase with ${o.partner.name}.`}
        </p>

        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <Meta label="Category" value={o.category.replace(/_/g, " ")} />
          <Meta
            label="Redemption"
            value={
              o.redemption_type === "code"
                ? "Promo code"
                : o.redemption_type === "qr"
                  ? "In-store QR"
                  : "Tracked link"
            }
          />
          <Meta label="Points reward" value={`${o.points_award || "Default"} pts`} />
          <Meta
            label="Ends"
            value={new Date(o.end_date).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          />
        </dl>
      </div>

      {payload ? (
        <RedemptionResult payload={payload} />
      ) : (
        <RedemptionCTA
          isPending={redeem.isPending}
          onClick={() => redeem.mutate()}
          error={
            redeem.isError
              ? extractRedemptionError(redeem.error)
              : null
          }
        />
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt
        style={{
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--text-muted)",
          fontWeight: 600,
        }}
      >
        {label}
      </dt>
      <dd style={{ margin: "0.25rem 0 0", fontWeight: 600, textTransform: "capitalize" }}>
        {value}
      </dd>
    </div>
  );
}

function RedemptionCTA({
  isPending,
  onClick,
  error,
}: {
  isPending: boolean;
  onClick: () => void;
  error: { message: string; code?: string } | null;
}) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Ready to claim?</h3>
      <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
        We&rsquo;ll record your redemption, add CliffPoints to your wallet, and give you what
        you need to claim the perk.
      </p>
      {error && (
        <div
          style={{
            background: "rgba(220,38,38,0.08)",
            border: "1px solid rgba(220,38,38,0.3)",
            color: "#b91c1c",
            padding: "0.625rem 0.875rem",
            borderRadius: 8,
            marginBottom: "1rem",
            fontSize: "0.9375rem",
          }}
        >
          {error.message}
        </div>
      )}
      <button
        type="button"
        className="btn"
        onClick={onClick}
        disabled={isPending}
        style={{ background: "#1E2B4A" }}
      >
        {isPending ? "Claiming…" : "Redeem this perk"}
      </button>
    </div>
  );
}

function RedemptionResult({ payload }: { payload: RedemptionPayload }) {
  if (payload.type === "code") {
    return (
      <div
        className="card"
        style={{
          background: "rgba(34,197,94,0.08)",
          borderColor: "rgba(34,197,94,0.3)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Your promo code</h3>
        <p style={{ color: "var(--text-muted)" }}>
          Use this code at checkout on the partner&rsquo;s site.
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            marginTop: "0.75rem",
          }}
        >
          <code
            style={{
              flex: 1,
              fontSize: "1.25rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              background: "var(--card-bg)",
              border: "1px dashed var(--border)",
              padding: "0.75rem 1rem",
              borderRadius: 8,
              wordBreak: "break-all",
            }}
          >
            {payload.code}
          </code>
          <button
            type="button"
            className="btn"
            onClick={() => navigator.clipboard?.writeText(payload.code)}
            style={{ background: "#1E2B4A", padding: "0.625rem 1rem" }}
          >
            Copy
          </button>
        </div>
      </div>
    );
  }
  if (payload.type === "qr") {
    return (
      <div className="card" style={{ background: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.3)" }}>
        <h3 style={{ marginTop: 0 }}>Show this at the till</h3>
        <p style={{ color: "var(--text-muted)" }}>
          Single-use QR token — expires in{" "}
          {Math.round(payload.expires_in_seconds / 60)} minutes.
        </p>
        <pre
          style={{
            background: "var(--card-bg)",
            border: "1px dashed var(--border)",
            padding: "1rem",
            borderRadius: 8,
            fontSize: "0.75rem",
            overflow: "auto",
            margin: 0,
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
          }}
        >
          {payload.qr_token}
        </pre>
      </div>
    );
  }
  // link
  return (
    <div className="card" style={{ background: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.3)" }}>
      <h3 style={{ marginTop: 0 }}>You&rsquo;re all set</h3>
      <p style={{ color: "var(--text-muted)" }}>
        Continue to the partner&rsquo;s site to complete your purchase. We&rsquo;ll track the
        redemption automatically.
      </p>
      <a
        href={payload.url}
        target="_blank"
        rel="noreferrer"
        className="btn"
        style={{ background: "#1E2B4A", display: "inline-block", textDecoration: "none" }}
      >
        Continue to partner site →
      </a>
    </div>
  );
}

function extractRedemptionError(error: unknown): { message: string; code?: string } {
  if (error instanceof ApiError) {
    const body = error.body as RedemptionErrorBody | null;
    return { message: error.message, code: body?.code };
  }
  if (error instanceof Error) return { message: error.message };
  return { message: "Couldn't redeem this perk." };
}
