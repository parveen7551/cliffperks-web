/**
 * Canonical TanStack Query keys. Centralising keys keeps invalidation safe.
 */
export const qk = {
  employer: {
    me: ["employer", "me"] as const,
    analytics: ["employer", "analytics"] as const,
    employees: (params?: Record<string, unknown>) =>
      ["employer", "employees", params ?? {}] as const,
    employee: (id: string) => ["employer", "employee", id] as const,
    announcements: ["employer", "announcements"] as const,
  },
  employee: {
    feed: ["employee", "feed"] as const,
    offers: (params?: Record<string, unknown>) =>
      ["employee", "offers", params ?? {}] as const,
    points: ["employee", "points"] as const,
  },
  offers: {
    list: (params?: Record<string, unknown>) =>
      ["offers", "list", params ?? {}] as const,
    detail: (id: string) => ["offers", "detail", id] as const,
  },
} as const;
