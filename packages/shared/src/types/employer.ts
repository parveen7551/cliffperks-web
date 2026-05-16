import type { ISODate, UUID } from "./common";

export type HRISProvider = "none" | "bamboohr" | "rippling" | "workday";

/** Mirrors apps.employers.serializers.EmployerSerializer. */
export interface Employer {
  id: UUID;
  name: string;
  subdomain: string;
  logo_url: string;
  brand_color: string;
  hris_provider: HRISProvider;
  allowed_email_domains: string;
  created_at: ISODate;
  updated_at: ISODate;
}

export type EmployerPatch = Partial<
  Pick<
    Employer,
    | "name"
    | "logo_url"
    | "brand_color"
    | "hris_provider"
    | "allowed_email_domains"
  >
>;
