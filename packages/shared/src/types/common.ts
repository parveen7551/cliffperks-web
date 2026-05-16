/**
 * Common DTOs shared between the backend (Django/DRF) and the frontend.
 * Mirrors apps/core/pagination.py — DRF PageNumberPagination shape.
 */
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type UUID = string;
export type ISODate = string;
