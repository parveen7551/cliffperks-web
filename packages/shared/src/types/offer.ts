import type { ISODate, UUID } from "./common";
import type { BrandPartner } from "./partner";

export type OfferCategory =
  | "travel"
  | "groceries"
  | "entertainment"
  | "health"
  | "dining"
  | "shopping"
  | "electronics"
  | "services"
  | "other";

export type DiscountType =
  | "percent"
  | "amount"
  | "bogo"
  | "freebie"
  | "other";

export type RedemptionType = "code" | "qr" | "link";

export type OfferStatus =
  | "draft"
  | "pending_review"
  | "active"
  | "paused"
  | "expired"
  | "rejected";

/** Mirrors apps.offers.serializers.OfferListSerializer. */
export interface Offer {
  id: UUID;
  partner: BrandPartner;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  category: OfferCategory;
  discount_type: DiscountType;
  discount_value: string; // DecimalField as string
  redemption_type: RedemptionType;
  image_url: string;
  start_date: ISODate;
  end_date: ISODate;
  status: OfferStatus;
  created_at: ISODate;
  updated_at: ISODate;
}

/** Mirrors apps.offers.serializers.OfferDetailSerializer. */
export interface OfferDetail extends Offer {
  points_award: number;
  velocity_limit_hours: number;
}
