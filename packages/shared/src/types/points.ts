import type { ISODate, UUID } from "./common";

export type LedgerReason =
  | "earn_redemption"
  | "adjustment"
  | "spend_gift_card"
  | "spend_donation";

/** Mirrors apps.points.serializers.PointsLedgerEntrySerializer. */
export interface PointsLedgerEntry {
  id: UUID;
  delta: number;
  balance_after: number;
  reason: LedgerReason;
  ref_type: string;
  ref_id: string;
  notes: string;
  created_at: ISODate;
}

/** Mirrors apps.points.serializers.PointsBalanceSerializer. */
export interface PointsBalance {
  balance: number;
  recent: PointsLedgerEntry[];
}
