/**
 * Helpers for rendering Offer DTOs.
 */
import type { Offer, OfferCategory } from "@cliffperks/shared";

const CAD0 = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

/** Human-readable description of the discount, e.g. "Save 25%" or "Save $20". */
export function discountLabel(offer: Pick<Offer, "discount_type" | "discount_value">): string {
  const raw = Number(offer.discount_value);
  const value = Number.isFinite(raw) ? raw : 0;
  switch (offer.discount_type) {
    case "percent":
      return value > 0 ? `Save ${Math.round(value)}%` : "Exclusive savings";
    case "amount":
      return value > 0 ? `Save ${CAD0.format(value)}` : "Save on your next order";
    case "bogo":
      return "Buy one, get one";
    case "freebie":
      return "Free gift included";
    default:
      return "Special perk";
  }
}

const CATEGORY_GRADIENTS: Record<OfferCategory, string> = {
  travel: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 45%, #2563eb 100%)",
  groceries: "linear-gradient(135deg, #064e3b 0%, #065f46 45%, #047857 100%)",
  entertainment: "linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338ca 100%)",
  health: "linear-gradient(135deg, #0f3460 0%, #14532d 60%, #1e6b3a 100%)",
  dining: "linear-gradient(135deg, #5c2c00 0%, #7c2d12 50%, #9a3412 100%)",
  shopping: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 45%, #7c3aed 100%)",
  electronics: "linear-gradient(135deg, #0c2d4a 0%, #0d4a6e 55%, #1565a8 100%)",
  services: "linear-gradient(135deg, #1c0f00 0%, #3d1f00 50%, #5c3000 100%)",
  other: "linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)",
};

const CATEGORY_ACCENT: Record<OfferCategory, string> = {
  travel: "#1d4ed8",
  groceries: "#047857",
  entertainment: "#4338ca",
  health: "#14532d",
  dining: "#9a3412",
  shopping: "#7c3aed",
  electronics: "#0f3460",
  services: "#5c3000",
  other: "#4b5563",
};

/** Themed gradient + accent colour for any Offer. */
export function offerTheme(offer: Pick<Offer, "category">) {
  const cat = offer.category;
  return {
    background: CATEGORY_GRADIENTS[cat] ?? CATEGORY_GRADIENTS.other,
    accent: CATEGORY_ACCENT[cat] ?? CATEGORY_ACCENT.other,
  };
}

/** Soft tint suitable for a logo-area panel — pairs with offerTheme(). */
export function offerSoftTint(offer: Pick<Offer, "category">): string {
  switch (offer.category) {
    case "travel":
      return "#f0f7ff";
    case "groceries":
      return "#f0fdf4";
    case "entertainment":
      return "#f5f3ff";
    case "health":
      return "#ecfdf5";
    case "dining":
      return "#fff7ed";
    case "shopping":
      return "#faf5ff";
    case "electronics":
      return "#f0f4ff";
    case "services":
      return "#fffbeb";
    default:
      return "#f9fafb";
  }
}

/** Pick the EN title with the FR title as fallback. */
export function offerTitle(offer: Pick<Offer, "title_en" | "title_fr">): string {
  return offer.title_en || offer.title_fr || "Exclusive Perk";
}
