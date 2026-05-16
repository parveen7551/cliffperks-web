"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import type { OfferCategory } from "@cliffperks/shared";
import { employeeApi } from "@/lib/api";
import { qk } from "@/lib/queryKeys";
import {
  discountLabel,
  offerSoftTint,
  offerTheme,
  offerTitle,
} from "@/lib/offerDisplay";

const CATEGORIES: { value: "" | OfferCategory; label: string }[] = [
  { value: "", label: "All" },
  { value: "travel", label: "Travel" },
  { value: "dining", label: "Dining" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health" },
  { value: "groceries", label: "Groceries" },
  { value: "electronics", label: "Electronics" },
  { value: "services", label: "Services" },
];

export default function OffersPage() {
  return (
    <Suspense fallback={<OffersFallback />}>
      <OffersContent />
    </Suspense>
  );
}

function OffersFallback() {
  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "2rem 2.5rem 5rem" }}>
      <p style={{ color: "var(--text-muted)" }}>Loading…</p>
    </div>
  );
}

function OffersContent() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<"" | OfferCategory>(
    () => (searchParams?.get("c") as OfferCategory | null) ?? "",
  );
  const search = searchParams?.get("search") ?? "";

  const params = useMemo(
    () => ({
      page,
      category: category || undefined,
      search: search || undefined,
    }),
    [page, category, search],
  );

  const offers = useQuery({
    queryKey: qk.employee.offers(params),
    queryFn: () => employeeApi.listOffers(params),
  });

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "2rem 2.5rem 5rem" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "2rem" }}>All perks</h1>
        {search && (
          <p style={{ color: "var(--text-muted)" }}>
            Showing results for <strong>{search}</strong>
          </p>
        )}
      </header>

      <div
        role="tablist"
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        {CATEGORIES.map((c) => (
          <button
            key={c.value || "all"}
            type="button"
            onClick={() => {
              setCategory(c.value);
              setPage(1);
            }}
            style={{
              padding: "0.5rem 0.875rem",
              borderRadius: 999,
              border: "1px solid var(--border)",
              background: category === c.value ? "#1E2B4A" : "var(--card-bg)",
              color: category === c.value ? "#fff" : "var(--foreground)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {offers.isLoading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading…</p>
      ) : offers.isError ? (
        <div className="card" style={{ borderColor: "rgba(220,38,38,0.3)" }}>
          Couldn&rsquo;t load offers.
        </div>
      ) : offers.data!.results.length === 0 ? (
        <div className="card" style={{ textAlign: "center", color: "var(--text-muted)" }}>
          No perks match your filter.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {offers.data!.results.map((offer) => {
              const theme = offerTheme(offer);
              return (
                <Link
                  key={offer.id}
                  href={`/offers/${offer.id}`}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: "hidden",
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      height: 120,
                      background: offerSoftTint(offer),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {offer.partner.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={offer.partner.logo_url}
                        alt={offer.partner.name}
                        style={{ maxWidth: "70%", maxHeight: "70%", objectFit: "contain" }}
                      />
                    ) : (
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: "1.25rem",
                          color: theme.accent,
                        }}
                      >
                        {offer.partner.name}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: "0.875rem 1rem", display: "flex", flexDirection: "column", gap: 4 }}>
                    <small style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                      {offer.partner.name}
                    </small>
                    <strong style={{ fontSize: "0.9375rem", lineHeight: 1.3 }}>
                      {offerTitle(offer)}
                    </strong>
                    <span
                      style={{
                        color: theme.accent,
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        marginTop: 4,
                      }}
                    >
                      {discountLabel(offer)} →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "var(--text-muted)",
              fontSize: "0.875rem",
            }}
          >
            <span>{offers.data!.count} total</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                disabled={!offers.data!.previous}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={pagerBtn(!!offers.data!.previous)}
              >
                ← Prev
              </button>
              <button
                type="button"
                disabled={!offers.data!.next}
                onClick={() => setPage((p) => p + 1)}
                style={pagerBtn(!!offers.data!.next)}
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function pagerBtn(enabled: boolean): React.CSSProperties {
  return {
    padding: "0.375rem 0.75rem",
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: 6,
    cursor: enabled ? "pointer" : "not-allowed",
    opacity: enabled ? 1 : 0.5,
    color: "var(--foreground)",
  };
}
