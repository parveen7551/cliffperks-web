"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { Offer } from "@cliffperks/shared";
import { employeeApi } from "@/lib/api";
import { qk } from "@/lib/queryKeys";
import {
  discountLabel,
  offerSoftTint,
  offerTheme,
  offerTitle,
} from "@/lib/offerDisplay";
import styles from "./feed.module.css";

export default function FeedPage() {
  const feed = useQuery({
    queryKey: qk.employee.feed,
    queryFn: () => employeeApi.feed(),
  });

  if (feed.isLoading) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.subtitle}>Loading your personalised perks…</p>
      </div>
    );
  }
  if (feed.isError) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.subtitle} style={{ color: "#b91c1c" }}>
          Couldn&rsquo;t load your perks feed.{" "}
          {feed.error instanceof Error ? feed.error.message : ""}
        </p>
      </div>
    );
  }

  const offers = feed.data ?? [];
  const heroOffers = offers.slice(0, 4);
  const featuredOffers = offers.slice(4, 12);
  const trendingOffers = offers.slice(12, 15);
  const experienceOffers = offers.filter((o) => o.category === "travel").slice(0, 2);

  if (offers.length === 0) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.subtitle}>
          No active perks yet. Check back soon — your HR team is curating the lineup.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.subtitle}>
        {offers.length}+ exclusive perks waiting for you. Find yours today and start saving.
      </p>

      {heroOffers.length > 0 && <HeroCarousel offers={heroOffers} />}

      {featuredOffers.length > 0 && (
        <>
          <h2 className={styles.sectionHeading}>Featured this month</h2>
          <div className={styles.perksGrid}>
            {featuredOffers.map((offer) => (
              <Link
                key={offer.id}
                href={`/offers/${offer.id}`}
                className={styles.perkCard}
              >
                <div
                  className={styles.perkLogoArea}
                  style={{ background: offerSoftTint(offer) }}
                >
                  {offer.partner.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={offer.partner.logo_url}
                      alt={offer.partner.name}
                      style={{ maxWidth: "70%", maxHeight: "70%", objectFit: "contain" }}
                    />
                  ) : (
                    <PartnerInitial name={offer.partner.name} />
                  )}
                </div>
                <div className={styles.perkInfo}>
                  <p className={styles.perkBrand}>{offer.partner.name}</p>
                  <p className={styles.perkTagline}>{offerTitle(offer)}</p>
                  <span className={styles.shopLink}>
                    {discountLabel(offer)} &rsaquo;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {trendingOffers.length > 0 && (
        <div className={styles.trendingSection}>
          <h2 className={styles.centeredHeading}>Perks that are trending</h2>
          <div className={styles.trendGrid}>
            {trendingOffers.map((offer) => {
              const theme = offerTheme(offer);
              return (
                <Link
                  key={offer.id}
                  href={`/offers/${offer.id}`}
                  className={styles.trendCard}
                >
                  <div
                    className={styles.trendImgArea}
                    style={{ background: theme.background }}
                  >
                    <div className={styles.trendBrandOverlay}>
                      <span className={styles.trendBrandLabel}>
                        {offer.partner.name}
                      </span>
                    </div>
                  </div>
                  <div className={styles.trendBody}>
                    <p className={styles.trendBrandName}>{offer.partner.name}</p>
                    <p className={styles.trendTagline}>{offerTitle(offer)}</p>
                    <span className={styles.trendShopLink}>
                      {discountLabel(offer)} &rsaquo;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className={styles.seeMoreWrap}>
            <Link href="/offers" className={styles.seeMoreBtn}>
              See What&rsquo;s New
            </Link>
          </div>
        </div>
      )}

      {experienceOffers.length > 0 && <ExperienceCarousel offers={experienceOffers} />}
    </div>
  );
}

function HeroCarousel({ offers }: { offers: Offer[] }) {
  const [active, setActive] = useState(0);
  const offer = offers[active] ?? offers[0];
  const theme = offerTheme(offer);
  return (
    <>
      <div className={styles.heroSection}>
        <Link
          href={`/offers/${offer.id}`}
          className={styles.heroSlide}
          style={{ background: theme.background }}
        >
          <div className={styles.heroContent}>
            <span className={styles.exclusiveBadge}>Exclusive</span>
            <h2 className={styles.heroHeadline}>{offerTitle(offer)}</h2>
            <p className={styles.heroSubtext}>
              {offer.description_en || `${discountLabel(offer)} at ${offer.partner.name}.`}
            </p>
            <span className={styles.heroCta} style={{ color: theme.accent }}>
              {discountLabel(offer)} &rarr;
            </span>
          </div>
          <div className={styles.heroBrandBox}>
            <span className={styles.heroBrandName}>{offer.partner.name}</span>
          </div>
        </Link>
      </div>
      <div className={styles.dots}>
        {offers.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot}${i === active ? " " + styles.active : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}

function ExperienceCarousel({ offers }: { offers: Offer[] }) {
  const [active, setActive] = useState(0);
  const offer = offers[active] ?? offers[0];
  const theme = offerTheme(offer);
  return (
    <div className={styles.expSection}>
      <h2 className={styles.centeredHeading}>Top Experiences</h2>
      <div className={styles.expSlide}>
        <div className={styles.expBg} style={{ background: theme.background }} />
        <div className={styles.expPanel} style={{ background: theme.accent }}>
          <p className={styles.expExclusive}>CliffPerks Exclusive</p>
          <h3 className={styles.expHeadline}>{offerTitle(offer)}</h3>
          <Link
            href={`/offers/${offer.id}`}
            className={styles.expCtaBtn}
            style={{ color: theme.accent }}
          >
            {discountLabel(offer)}
          </Link>
          <p className={styles.expBrandName}>{offer.partner.name}</p>
          <p className={styles.expNote}>*Terms apply.</p>
        </div>
      </div>
      <div className={styles.expDots}>
        {offers.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.expDot}${i === active ? " " + styles.active : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Go to experience ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function PartnerInitial({ name }: { name: string }) {
  const initial = (name?.[0] ?? "?").toUpperCase();
  return (
    <span
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#1e2b4a",
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: "1.5rem",
      }}
    >
      {initial}
    </span>
  );
}
