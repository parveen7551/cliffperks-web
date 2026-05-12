"use client";

import React, { useState } from "react";
import styles from "./feed.module.css";
import { GECard, VitamixCard, HexCladCard } from "@/components/BrandLogos";

const LOGO_COMPONENTS = [GECard, VitamixCard, HexCladCard];

const HERO_SLIDES = [
  {
    bg: "linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338ca 100%)",
    badge: "EXCLUSIVE",
    headline: "The savings have landed.",
    subtext: "New partner deal — save up to 25% on car & home insurance.",
    cta: "Shop Now",
    ctaColor: "#4338ca",
    brand: "BelairDirect",
  },
  {
    bg: "linear-gradient(135deg, #064e3b 0%, #065f46 45%, #047857 100%)",
    badge: "LIMITED TIME",
    headline: "Fresh meals, bigger savings.",
    subtext: "Get up to 25 free meals on your first 5 HelloFresh boxes.",
    cta: "Claim Offer",
    ctaColor: "#047857",
    brand: "HelloFresh",
  },
  {
    bg: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 45%, #2563eb 100%)",
    badge: "EMPLOYEE ONLY",
    headline: "Fly for less this summer.",
    subtext: "Exclusive 8% off all WestJet flights — book by June 30.",
    cta: "Book Now",
    ctaColor: "#1d4ed8",
    brand: "WestJet",
  },
  {
    bg: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 45%, #7c3aed 100%)",
    badge: "NEW PERK",
    headline: "Read more, spend less.",
    subtext: "20% off all books, gifts & accessories at Chapters Indigo.",
    cta: "Explore Deals",
    ctaColor: "#7c3aed",
    brand: "Chapters\nIndigo",
  },
];

const FEATURED_PERKS = [
  {
    brand: "GE Appliances",
    tagline: "Save an additional 25%",
    bgColor: "#f0f4ff",
    logo: 0,
  },
  {
    brand: "Vitamix",
    tagline: "Get 15% off orders of $300+",
    bgColor: "#fff8f8",
    logo: 1,
  },
  {
    brand: "HexClad",
    tagline: "Premium cookware — 20% employee discount",
    bgColor: "#f9fafb",
    logo: 2,
  },
  {
    brand: "GE Appliances",
    tagline: "Free delivery on orders over $499",
    bgColor: "#f0f4ff",
    logo: 0,
  },
  {
    brand: "Vitamix",
    tagline: "Extended warranty included",
    bgColor: "#fff8f8",
    logo: 1,
  },
  {
    brand: "HexClad",
    tagline: "Lifetime guarantee on all products",
    bgColor: "#f9fafb",
    logo: 2,
  },
  {
    brand: "GE Appliances",
    tagline: "Exclusive bundle deals this month",
    bgColor: "#f0f4ff",
    logo: 0,
  },
  {
    brand: "Vitamix",
    tagline: "Free shipping on all blenders",
    bgColor: "#fff8f8",
    logo: 1,
  },
];

const TRENDING_PERKS = [
  {
    brand: "Cineplex",
    tagline: "Save on your next movie going experience",
    imgBg: "linear-gradient(160deg, #0d1b2a 0%, #1a2f4e 45%, #1e3a5f 100%)",
    bokeh: true,
  },
  {
    brand: "Factor_",
    tagline: "Get up to $120 off + free shipping",
    imgBg: "linear-gradient(160deg, #1c0f00 0%, #3d1f00 50%, #5c3000 100%)",
    bokeh: false,
  },
  {
    brand: "Crocs",
    tagline: "Save up to $20 off",
    imgBg: "linear-gradient(160deg, #1a2e1a 0%, #2c4a2c 50%, #3a6040 100%)",
    bokeh: false,
  },
];

const EXP_SLIDES = [
  {
    bgGradient:
      "linear-gradient(120deg, #0c2d4a 0%, #0d4a6e 55%, #1565a8 100%)",
    panelBg: "#0f3460",
    badge: "CLIFFPERKS EXCLUSIVE SAVINGS",
    headline: "Save up to 15% on\nWestJet flights.",
    cta: "Book Now",
    ctaColor: "#0f3460",
    brand: "WestJet",
    note: "*Terms apply.",
  },
  {
    bgGradient:
      "linear-gradient(120deg, #0f2d1a 0%, #1a4d2a 55%, #1e6b3a 100%)",
    panelBg: "#14532d",
    badge: "EMPLOYEE EXCLUSIVE",
    headline: "Discover Canada with\nVIA Rail.",
    cta: "View Passes",
    ctaColor: "#14532d",
    brand: "VIA Rail",
    note: "*Select routes only.",
  },
];

export default function FeedPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeExp, setActiveExp] = useState(0);
  const slide = HERO_SLIDES[activeSlide];
  const exp = EXP_SLIDES[activeExp];

  return (
    <div className={styles.wrapper}>
      <p className={styles.subtitle}>
        5,000+ exclusive perks waiting for you. Find yours today and start
        saving.
      </p>

      {/* ── Hero carousel ── */}
      <div className={styles.heroSection}>
        <div className={styles.heroSlide} style={{ background: slide.bg }}>
          <div className={styles.heroContent}>
            <span className={styles.exclusiveBadge}>{slide.badge}</span>
            <h2 className={styles.heroHeadline}>{slide.headline}</h2>
            <p className={styles.heroSubtext}>{slide.subtext}</p>
            <button
              className={styles.heroCta}
              style={{ color: slide.ctaColor }}
            >
              {slide.cta} &rarr;
            </button>
          </div>
          <div className={styles.heroBrandBox}>
            <span
              className={styles.heroBrandName}
              style={{ whiteSpace: "pre-line" }}
            >
              {slide.brand}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.dots}>
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot}${i === activeSlide ? " " + styles.active : ""}`}
            onClick={() => setActiveSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Featured this month ── */}
      <h2 className={styles.sectionHeading}>Featured this month</h2>
      <div className={styles.perksGrid}>
        {FEATURED_PERKS.map((perk, i) => {
          const LogoComponent = LOGO_COMPONENTS[perk.logo];
          return (
            <a key={`${perk.brand}-${i}`} href="#" className={styles.perkCard}>
              <div
                className={styles.perkLogoArea}
                style={{ background: perk.bgColor }}
              >
                <LogoComponent />
              </div>
              <div className={styles.perkInfo}>
                <p className={styles.perkBrand}>{perk.brand}</p>
                <p className={styles.perkTagline}>{perk.tagline}</p>
                <span className={styles.shopLink}>Shop Now &rsaquo;</span>
              </div>
            </a>
          );
        })}
      </div>

      {/* ── Perks that are trending ── */}
      <div className={styles.trendingSection}>
        <h2 className={styles.centeredHeading}>Perks that are trending</h2>
        <div className={styles.trendGrid}>
          {TRENDING_PERKS.map((perk) => (
            <a key={perk.brand} href="#" className={styles.trendCard}>
              <div
                className={styles.trendImgArea}
                style={{ background: perk.imgBg }}
              >
                {/* bokeh decoration for Cineplex */}
                {perk.bokeh && (
                  <svg
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0.35,
                    }}
                    viewBox="0 0 400 252"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <circle
                      cx="80"
                      cy="60"
                      r="45"
                      fill="rgba(100,140,255,0.5)"
                    />
                    <circle
                      cx="200"
                      cy="110"
                      r="60"
                      fill="rgba(80,120,220,0.4)"
                    />
                    <circle
                      cx="320"
                      cy="50"
                      r="38"
                      fill="rgba(120,160,255,0.45)"
                    />
                    <circle
                      cx="140"
                      cy="180"
                      r="50"
                      fill="rgba(60,100,200,0.35)"
                    />
                    <circle
                      cx="350"
                      cy="190"
                      r="42"
                      fill="rgba(100,140,240,0.4)"
                    />
                    <circle
                      cx="50"
                      cy="200"
                      r="30"
                      fill="rgba(140,180,255,0.3)"
                    />
                  </svg>
                )}
                <div className={styles.trendBrandOverlay}>
                  <span className={styles.trendBrandLabel}>{perk.brand}</span>
                </div>
              </div>
              <div className={styles.trendBody}>
                <p className={styles.trendBrandName}>{perk.brand}</p>
                <p className={styles.trendTagline}>{perk.tagline}</p>
                <span className={styles.trendShopLink}>Shop Now &rsaquo;</span>
              </div>
            </a>
          ))}
        </div>
        <div className={styles.seeMoreWrap}>
          <button className={styles.seeMoreBtn}>See What&rsquo;s New</button>
        </div>
      </div>

      {/* ── Top Experiences carousel ── */}
      <div className={styles.expSection}>
        <h2 className={styles.centeredHeading}>Top Experiences</h2>
        <div className={styles.expSlide}>
          {/* background scenery */}
          <div className={styles.expBg} style={{ background: exp.bgGradient }}>
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: 0.18,
              }}
              viewBox="0 0 700 290"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* simplified skyline silhouette */}
              <rect
                x="0"
                y="160"
                width="700"
                height="130"
                fill="rgba(0,0,0,0.3)"
              />
              <rect
                x="60"
                y="100"
                width="40"
                height="60"
                fill="rgba(255,255,255,0.08)"
              />
              <rect
                x="120"
                y="80"
                width="30"
                height="80"
                fill="rgba(255,255,255,0.06)"
              />
              <rect
                x="200"
                y="60"
                width="60"
                height="100"
                fill="rgba(255,255,255,0.07)"
              />
              <rect
                x="300"
                y="90"
                width="25"
                height="70"
                fill="rgba(255,255,255,0.05)"
              />
              <circle cx="350" cy="88" r="10" fill="rgba(255,255,255,0.06)" />
              <rect
                x="420"
                y="70"
                width="20"
                height="90"
                fill="rgba(255,255,255,0.07)"
              />
              <rect
                x="500"
                y="110"
                width="50"
                height="50"
                fill="rgba(255,255,255,0.05)"
              />
              <rect
                x="600"
                y="85"
                width="35"
                height="75"
                fill="rgba(255,255,255,0.06)"
              />
            </svg>
          </div>
          {/* info panel */}
          <div className={styles.expPanel} style={{ background: exp.panelBg }}>
            <p className={styles.expExclusive}>{exp.badge}</p>
            <h3
              className={styles.expHeadline}
              style={{ whiteSpace: "pre-line" }}
            >
              {exp.headline}
            </h3>
            <button
              className={styles.expCtaBtn}
              style={{ color: exp.ctaColor }}
            >
              {exp.cta}
            </button>
            <p className={styles.expBrandName}>{exp.brand}</p>
            <p className={styles.expNote}>{exp.note}</p>
          </div>
        </div>
        <div className={styles.expDots}>
          {EXP_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`${styles.expDot}${i === activeExp ? " " + styles.active : ""}`}
              onClick={() => setActiveExp(i)}
              aria-label={`Go to experience ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
