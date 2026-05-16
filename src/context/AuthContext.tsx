"use client";

/**
 * AuthContext — single source of truth for the signed-in user on the client.
 *
 * Backend issues JWT access (60min) + refresh (14d) tokens via:
 *   POST /api/v1/auth/employer/login          — HR password login
 *   POST /api/v1/auth/employee/magic-link     — send email
 *   POST /api/v1/auth/employee/verify         — exchange link token for pair
 *
 * We persist both tokens in localStorage so the user stays signed in across
 * tabs and reloads; lib/api.ts auto-refreshes on 401.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { AuthUser, TokenPair } from "@cliffperks/shared";
import { authApi } from "@/lib/api";
import {
  clearSession,
  loadUser,
  loadAccess,
  saveSession,
} from "@/lib/storage";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

interface AuthContextValue extends AuthState {
  loginEmployer: (email: string, password: string) => Promise<AuthUser>;
  requestEmployeeMagicLink: (email: string) => Promise<void>;
  verifyEmployeeMagicLink: (token: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function destinationForRole(user: AuthUser): string {
  switch (user.role) {
    case "employer":
    case "admin":
      return "/dashboard";
    case "employee":
      return "/feed";
    case "partner":
      return "/partners";
    default:
      return "/";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isHydrated: false,
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const user = loadUser();
    const access = loadAccess();
    setState({
      user,
      isAuthenticated: Boolean(user && access),
      isHydrated: true,
    });
  }, []);

  const applyTokenPair = useCallback((pair: TokenPair): AuthUser => {
    saveSession({
      access: pair.access,
      refresh: pair.refresh,
      user: pair.user,
    });
    setState({ user: pair.user, isAuthenticated: true, isHydrated: true });
    // Drop any stale data from a previous user.
    queryClient.clear();
    return pair.user;
  }, [queryClient]);

  const loginEmployer = useCallback(
    async (email: string, password: string) => {
      const pair = await authApi.employerLogin({ email, password });
      const user = applyTokenPair(pair);
      router.push(destinationForRole(user));
      return user;
    },
    [applyTokenPair, router],
  );

  const requestEmployeeMagicLink = useCallback(async (email: string) => {
    await authApi.requestMagicLink({ email });
  }, []);

  const verifyEmployeeMagicLink = useCallback(
    async (token: string) => {
      const pair = await authApi.verifyMagicLink({ token });
      const user = applyTokenPair(pair);
      router.push(destinationForRole(user));
      return user;
    },
    [applyTokenPair, router],
  );

  const logout = useCallback(() => {
    clearSession();
    queryClient.clear();
    setState({ user: null, isAuthenticated: false, isHydrated: true });
    router.push("/login");
  }, [queryClient, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      loginEmployer,
      requestEmployeeMagicLink,
      verifyEmployeeMagicLink,
      logout,
    }),
    [state, loginEmployer, requestEmployeeMagicLink, verifyEmployeeMagicLink, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

/**
 * Client-side guard: redirects to /login if the user is unauthenticated, and
 * optionally to a role-specific home if their role doesn't match.
 *
 * Returns the authenticated user once available, or `null` while hydrating.
 */
export function useRequireAuth(role?: AuthUser["role"]): AuthUser | null {
  const { user, isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }
    if (role && user.role !== role) {
      router.replace(destinationForRole(user));
    }
  }, [isHydrated, isAuthenticated, user, role, router]);

  if (!isHydrated || !isAuthenticated) return null;
  if (role && user && user.role !== role) return null;
  return user;
}
