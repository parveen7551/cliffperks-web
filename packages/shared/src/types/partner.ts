import type { ISODate, UUID } from "./common";

export type PartnerSource = "direct" | "rakuten" | "impact";
export type BillingModel = "cpa" | "cpc" | "flat" | "none";

/** Mirrors apps.partners.serializers.BrandPartnerSerializer. */
export interface BrandPartner {
  id: UUID;
  name: string;
  contact_email: string;
  source: PartnerSource;
  commission_rate: string; // DecimalField — DRF emits as string
  billing_model: BillingModel;
  logo_url: string;
  is_active: boolean;
  created_at: ISODate;
  updated_at: ISODate;
}
