import type { ISODate, UUID } from "./common";

export interface RedemptionCreateRequest {
  offer_id: UUID;
}

/**
 * Type-aware payload returned by apps.redemptions.services.redeem_offer.
 * Discriminated union on `type`.
 */
export type RedemptionPayload =
  | { type: "code"; code: string }
  | { type: "qr"; qr_token: string; expires_in_seconds: number }
  | { type: "link"; url: string };

/** Mirrors apps.redemptions.serializers.RedemptionResponseSerializer + payload. */
export interface RedemptionResponse {
  id: UUID;
  offer: UUID;
  points_earned: number;
  estimated_savings: string;
  redeemed_at: ISODate;
  payload: RedemptionPayload;
}

/** Error codes emitted by RedemptionError (409 responses). */
export type RedemptionErrorCode =
  | "employee_inactive"
  | "offer_inactive"
  | "offer_window"
  | "velocity_exceeded"
  | "missing_code"
  | "missing_link"
  | "unknown_type";

export interface RedemptionErrorBody {
  detail: string;
  code: RedemptionErrorCode;
}
