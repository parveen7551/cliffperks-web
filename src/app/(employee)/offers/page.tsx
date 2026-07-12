"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import type { OfferCategory } from "@cliffperks/shared";
import { employeeApi } from "@/lib/api";
import { qk } from "@/lib/queryKeys";
import { discountLabel, offerTitle } from "@/lib/offerDisplay";
import styles from "./offers.module.css";

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
    <div className={styles.wrap}>
      <p className={styles.state}>Loading…</p>
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
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>All perks</h1>
        {search && (
          <p className={styles.searchNote}>
            Showing results for <strong>{search}</strong>
          </p>
        )}
      </header>

      <div role="tablist" className={styles.categoryRow}>
        {CATEGORIES.map((c) => (
          <button
            key={c.value || "all"}
            type="button"
            onClick={() => {
              setCategory(c.value);
              setPage(1);
            }}
            className={`${styles.categoryPill}${
              category === c.value ? ` ${styles.categoryPillActive}` : ""
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {offers.isLoading ? (
        <p className={styles.state}>Loading…</p>
      ) : offers.isError ? (
        <div className="card">Couldn&rsquo;t load offers.</div>
      ) : offers.data!.results.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          <span className={styles.state}>No perks match your filter.</span>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {offers.data!.results.map((offer) => (
              <Link key={offer.id} href={`/offers/${offer.id}`} className={styles.card}>
                <div className={styles.logoArea}>
                  {offer.partner.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={offer.partner.logo_url}
                      alt={offer.partner.name}
                      style={{ maxWidth: "70%", maxHeight: "70%", objectFit: "contain" }}
                    />
                  ) : (
                    <span className={styles.logoFallback}>{offer.partner.name}</span>
                  )}
                </div>
                <div className={styles.info}>
                  <span className={styles.brand}>{offer.partner.name}</span>
                  <strong className={styles.title}>{offerTitle(offer)}</strong>
                  <span className={styles.discount}>{discountLabel(offer)} &rarr;</span>
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.footer}>
            <span>{offers.data!.count} total</span>
            <div className={styles.pagerRow}>
              <button
                type="button"
                disabled={!offers.data!.previous}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={styles.pagerBtn}
              >
                &larr; Prev
              </button>
              <button
                type="button"
                disabled={!offers.data!.next}
                onClick={() => setPage((p) => p + 1)}
                className={styles.pagerBtn}
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
