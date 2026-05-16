/**
 * Mirrors apps.analytics.views._AnalyticsResponse / apps.analytics.services.employer_analytics.
 */
import type { OfferCategory } from "./offer";

export interface TopCategoryRow {
  category: OfferCategory;
  count: number;
}

export interface DailyTrendPoint {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface EmployerAnalytics {
  total_enrolled_employees: number;
  monthly_active_users: number;
  redemptions_mtd: number;
  redemptions_ytd: number;
  estimated_savings_cad: number;
  top_categories: TopCategoryRow[];
  daily_trend: DailyTrendPoint[];
}
