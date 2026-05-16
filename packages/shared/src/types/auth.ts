import type { UUID } from "./common";

/** Mirrors apps.accounts.models.User.Role. */
export type UserRole = "admin" | "employer" | "employee" | "partner";

/** Mirrors the `user` field emitted by apps.accounts.services.issue_token_pair. */
export interface AuthUser {
  id: UUID;
  email: string;
  role: UserRole;
  employer_id: UUID | null;
  employee_id: UUID | null;
  partner_id: UUID | null;
}

/** Mirrors apps.accounts.serializers.TokenPairSerializer + the `user` dict. */
export interface TokenPair {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface EmployerLoginRequest {
  email: string;
  password: string;
}

export interface MagicLinkRequest {
  email: string;
}

export interface MagicLinkVerifyRequest {
  token: string;
}

/** SimpleJWT /token/refresh response — refresh may rotate (ROTATE_REFRESH_TOKENS=True). */
export interface TokenRefreshResponse {
  access: string;
  refresh?: string;
}
