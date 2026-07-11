/**
 * Typed fetch wrapper for the CliffPerks backend.
 *
 * Responsibilities:
 *  - prepend API_BASE_URL + /api/v1 to every path
 *  - attach `Authorization: Bearer <access>` when we have one
 *  - on 401, try ONE silent refresh via /api/v1/token/refresh, then retry
 *  - throw a typed `ApiError` carrying status code + parsed body
 *
 * Endpoint groups live in their own modules (auth, employers, employees, etc.)
 * to keep this file small and easy to mock in tests.
 */
import type {
  AnnouncementCreate,
  Announcement,
  AuthUser,
  EmployeeImportResult,
  Employee,
  Employer,
  EmployerLoginRequest,
  EmployerPatch,
  EmployerAnalytics,
  MagicLinkRequest,
  MagicLinkVerifyRequest,
  Offer,
  OfferDetail,
  Paginated,
  PointsBalance,
  RedemptionCreateRequest,
  RedemptionResponse,
  TokenPair,
  TokenRefreshResponse,
} from "@cliffperks/shared";
import { API_BASE_URL, API_PREFIX, apiUrl } from "./config";
import { clearSession, loadAccess, loadRefresh, updateAccess } from "./storage";

// ── Error type ──────────────────────────────────────────────────────────────

export class ApiError<TBody = unknown> extends Error {
  readonly status: number;
  readonly body: TBody | null;

  constructor(status: number, message: string, body: TBody | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// ── Core request helper ─────────────────────────────────────────────────────

interface RequestOptions {
  /** HTTP method (default GET). */
  method?: string;
  /** Plain JS object → JSON body. Mutually exclusive with `formData`. */
  json?: unknown;
  /** FormData / Blob for multipart uploads. Mutually exclusive with `json`. */
  formData?: FormData;
  /** Query-string params; appended with URLSearchParams. */
  params?: Record<string, string | number | boolean | null | undefined>;
  /** Skip auth header entirely (e.g. login endpoints). */
  anonymous?: boolean;
  /** Disable the silent-refresh retry on 401 (e.g. when calling /token/refresh itself). */
  noRetry?: boolean;
  /** AbortSignal forwarded to fetch. */
  signal?: AbortSignal;
}

function buildQuery(
  params: RequestOptions["params"] | undefined,
): string {
  if (!params) return "";
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    usp.set(k, String(v));
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
}

/** Track an in-flight refresh so concurrent 401s share one round-trip. */
let refreshInFlight: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;
  const refresh = loadRefresh();
  if (!refresh) return null;

  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}${API_PREFIX}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) {
        clearSession();
        return null;
      }
      const data = (await res.json()) as TokenRefreshResponse;
      updateAccess(data.access, data.refresh);
      return data.access;
    } catch {
      clearSession();
      return null;
    } finally {
      // Allow the next refresh to actually run.
      setTimeout(() => {
        refreshInFlight = null;
      }, 0);
    }
  })();

  return refreshInFlight;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = apiUrl(path) + buildQuery(opts.params);

  const headers: Record<string, string> = {};
  let body: BodyInit | undefined;
  if (opts.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.json);
  } else if (opts.formData) {
    body = opts.formData; // fetch sets Content-Type with the boundary
  }

  if (!opts.anonymous) {
    const access = loadAccess();
    if (access) headers.Authorization = `Bearer ${access}`;
  }

  const init: RequestInit = {
    method: opts.method ?? "GET",
    headers,
    body,
    signal: opts.signal,
    // The API uses bearer tokens, not cookies. Sending cookies can make DRF's
    // session auth path enforce CSRF for cross-origin API calls.
    credentials: "omit",
  };

  let res = await fetch(url, init);

  if (res.status === 401 && !opts.anonymous && !opts.noRetry) {
    const newAccess = await tryRefresh();
    if (newAccess) {
      headers.Authorization = `Bearer ${newAccess}`;
      res = await fetch(url, { ...init, headers });
    }
  }

  return parseResponse<T>(res);
}

async function parseResponse<T>(res: Response): Promise<T> {
  // 204 No Content
  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    let message: string | null = null;
    if (isJson && body && typeof body === "object" && "detail" in body) {
      message = String((body as { detail?: unknown }).detail);
    } else if (typeof body === "string" && body) {
      message = body;
    }
    throw new ApiError(res.status, message ?? `HTTP ${res.status}`, body);
  }

  return body as T;
}

// ── Endpoint modules ────────────────────────────────────────────────────────

export const authApi = {
  employerLogin(payload: EmployerLoginRequest): Promise<TokenPair> {
    return request<TokenPair>("/auth/employer/login", {
      method: "POST",
      json: payload,
      anonymous: true,
    });
  },
  requestMagicLink(payload: MagicLinkRequest): Promise<void> {
    return request<void>("/auth/employee/magic-link", {
      method: "POST",
      json: payload,
      anonymous: true,
    });
  },
  verifyMagicLink(payload: MagicLinkVerifyRequest): Promise<TokenPair> {
    return request<TokenPair>("/auth/employee/verify", {
      method: "POST",
      json: payload,
      anonymous: true,
    });
  },
};

export const employerApi = {
  me(): Promise<Employer> {
    return request<Employer>("/employers/me");
  },
  updateMe(patch: EmployerPatch): Promise<Employer> {
    return request<Employer>("/employers/me", {
      method: "PATCH",
      json: patch,
    });
  },
  analytics(): Promise<EmployerAnalytics> {
    return request<EmployerAnalytics>("/employers/me/analytics");
  },
  listEmployees(params?: {
    page?: number;
    status?: string;
    department?: string;
    location?: string;
    search?: string;
    ordering?: string;
  }): Promise<Paginated<Employee>> {
    return request<Paginated<Employee>>("/employers/me/employees", { params });
  },
  getEmployee(id: string): Promise<Employee> {
    return request<Employee>(`/employers/me/employees/${id}`);
  },
  offboardEmployee(id: string): Promise<void> {
    return request<void>(`/employers/me/employees/${id}`, { method: "DELETE" });
  },
  importEmployees(file: File): Promise<EmployeeImportResult> {
    const fd = new FormData();
    fd.append("file", file);
    return request<EmployeeImportResult>("/employers/me/employees", {
      method: "POST",
      formData: fd,
    });
  },
  listAnnouncements(): Promise<Paginated<Announcement>> {
    return request<Paginated<Announcement>>("/employers/me/announcements");
  },
  createAnnouncement(payload: AnnouncementCreate): Promise<Announcement> {
    return request<Announcement>("/employers/me/announcements", {
      method: "POST",
      json: payload,
    });
  },
};

export const employeeApi = {
  feed(): Promise<Offer[]> {
    // pagination_class = None — backend returns a bare array
    return request<Offer[]>("/employees/me/feed");
  },
  listOffers(params?: {
    page?: number;
    category?: string;
    redemption_type?: string;
    search?: string;
    ordering?: string;
  }): Promise<Paginated<Offer>> {
    return request<Paginated<Offer>>("/employees/me/offers", { params });
  },
  points(): Promise<PointsBalance> {
    return request<PointsBalance>("/employees/me/points");
  },
  redeem(payload: RedemptionCreateRequest): Promise<RedemptionResponse> {
    return request<RedemptionResponse>("/employees/me/redemptions", {
      method: "POST",
      json: payload,
    });
  },
};

export const offersApi = {
  list(params?: {
    page?: number;
    category?: string;
    redemption_type?: string;
    search?: string;
    ordering?: string;
  }): Promise<Paginated<Offer>> {
    return request<Paginated<Offer>>("/offers/", { params });
  },
  get(id: string): Promise<OfferDetail> {
    return request<OfferDetail>(`/offers/${id}`);
  },
};

/** Re-export for tests / advanced use. */
export { request, type AuthUser };
