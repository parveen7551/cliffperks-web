/**
 * SSR-safe localStorage helpers for auth tokens + cached user.
 *
 * SimpleJWT issues access (60min) and refresh (14d) tokens; we keep both in
 * localStorage so a page refresh doesn't kick the user out. The access token is
 * also cached in memory by AuthContext for cheaper reads.
 */
import type { AuthUser } from "@cliffperks/shared";

const ACCESS_KEY = "cp:access";
const REFRESH_KEY = "cp:refresh";
const USER_KEY = "cp:user";

function safeStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadAccess(): string | null {
  return safeStorage()?.getItem(ACCESS_KEY) ?? null;
}

export function loadRefresh(): string | null {
  return safeStorage()?.getItem(REFRESH_KEY) ?? null;
}

export function loadUser(): AuthUser | null {
  const raw = safeStorage()?.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function saveSession(args: {
  access: string;
  refresh: string;
  user: AuthUser;
}): void {
  const s = safeStorage();
  if (!s) return;
  s.setItem(ACCESS_KEY, args.access);
  s.setItem(REFRESH_KEY, args.refresh);
  s.setItem(USER_KEY, JSON.stringify(args.user));
}

export function updateAccess(access: string, refresh?: string): void {
  const s = safeStorage();
  if (!s) return;
  s.setItem(ACCESS_KEY, access);
  if (refresh) s.setItem(REFRESH_KEY, refresh);
}

export function clearSession(): void {
  const s = safeStorage();
  if (!s) return;
  s.removeItem(ACCESS_KEY);
  s.removeItem(REFRESH_KEY);
  s.removeItem(USER_KEY);
}
