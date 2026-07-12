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
import { discountLabel, offerTitle } from "@/lib/offerDisplay";
import styles from "./offerDetail.module.css";

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
    return <p className={styles.loading}>Loading…</p>;
  }
  if (offer.isError || !offer.data) {
    return (
      <div className={styles.notFound}>
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

  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/feed">Home</Link>
        <span>&rsaquo;</span>
        <Link href="/offers">All perks</Link>
        <span>&rsaquo;</span>
        <span className={styles.breadcrumbCurrent}>{o.partner.name}</span>
      </nav>

      <div className={styles.layout}>
        <div className={styles.media}>
          {o.partner.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={o.partner.logo_url} alt={o.partner.name} className={styles.mediaLogo} />
          ) : (
            <span className={styles.mediaFallback}>{o.partner.name}</span>
          )}
        </div>

        <div className={styles.details}>
          <span className={styles.categoryTag}>{o.category.replace(/_/g, " ")}</span>
          <h1 className={styles.brandName}>{o.partner.name}</h1>
          <p className={styles.offerTitle}>{offerTitle(o)}</p>

          <p className={styles.sectionLabel}>Description</p>
          <p className={styles.description}>
            {o.description_en || `Save on your next purchase with ${o.partner.name}.`}
          </p>

          <div className={styles.savingsBlock}>
            <p className={styles.sectionLabel} style={{ marginBottom: "0.375rem" }}>
              Savings
            </p>
            <p className={styles.savingsValue}>{discountLabel(o)}</p>
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

          <dl className={styles.metaRow}>
            <div>
              <dt className={styles.metaLabel}>Redemption</dt>
              <dd className={styles.metaValue}>
                {o.redemption_type === "code"
                  ? "Promo code"
                  : o.redemption_type === "qr"
                    ? "In-store QR"
                    : "Tracked link"}
              </dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Points reward</dt>
              <dd className={styles.metaValue}>{o.points_award || "Default"} pts</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>Ends</dt>
              <dd className={styles.metaValue}>
                {new Date(o.end_date).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </dd>
            </div>
          </dl>
        </div>
      </div>
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
    <div style={{ marginBottom: "1.5rem" }}>
      {error && <div className={styles.errorBox}>{error.message}</div>}
      <button type="button" className="btn" onClick={onClick} disabled={isPending}>
        {isPending ? "Claiming…" : "Redeem this perk"}
      </button>
    </div>
  );
}

function RedemptionResult({ payload }: { payload: RedemptionPayload }) {
  if (payload.type === "code") {
    return (
      <div className={styles.resultBox}>
        <h3 className={styles.resultTitle}>Your promo code</h3>
        <p className={styles.ctaBody} style={{ marginBottom: 0 }}>
          Use this code at checkout on the partner&rsquo;s site.
        </p>
        <div className={styles.codeRow}>
          <code className={styles.codeBlock}>{payload.code}</code>
          <button
            type="button"
            className="btn"
            onClick={() => navigator.clipboard?.writeText(payload.code)}
            style={{ padding: "0.625rem 1rem" }}
          >
            Copy
          </button>
        </div>
      </div>
    );
  }
  if (payload.type === "qr") {
    return (
      <div className={styles.resultBox}>
        <h3 className={styles.resultTitle}>Show this at the till</h3>
        <p className={styles.ctaBody} style={{ marginBottom: 0 }}>
          Single-use QR token — expires in{" "}
          {Math.round(payload.expires_in_seconds / 60)} minutes.
        </p>
        <pre className={styles.qrBlock}>{payload.qr_token}</pre>
      </div>
    );
  }
  // link
  return (
    <div className={styles.resultBox}>
      <h3 className={styles.resultTitle}>You&rsquo;re all set</h3>
      <p className={styles.ctaBody} style={{ marginBottom: "0.75rem" }}>
        Continue to the partner&rsquo;s site to complete your purchase. We&rsquo;ll track the
        redemption automatically.
      </p>
      <a
        href={payload.url}
        target="_blank"
        rel="noreferrer"
        className="btn"
        style={{ display: "inline-block", textDecoration: "none" }}
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
