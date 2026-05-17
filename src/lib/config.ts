/**
 * Frontend runtime config. All public-facing values come from NEXT_PUBLIC_* env
 * vars so they're inlined at build time and available in the browser bundle.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
)
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

/** Versioned API prefix (matches config/urls.py `api/v1/`). */
export const API_PREFIX = "/api/v1";

/** Absolute URL helper — concats base + version + path. */
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${API_PREFIX}${p}`;
}
