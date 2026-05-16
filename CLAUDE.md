@AGENTS.md

# CliffPerks Web — AI Context

Last Updated: 2026-05-16

## Documentation Links

| Resource | Path |
|----------|------|
| Platform overview + quick start | `../cliffperks-documentation/README.md` |
| API endpoints + auth patterns | `../cliffperks-documentation/technical-architecture-api-reference.md` |
| Database schema (all models) | `../cliffperks-documentation/database-schema-documentation.md` |
| Local setup + env vars + runbook | `../cliffperks-documentation/infrastructure-operations-runbook.md` |
| Audit — executive summary | `../cliffperks-documentation/audit/executive-summary-action-plan.md` |
| Audit — code quality | `../cliffperks-documentation/audit/code-quality-architecture.md` |
| Audit — security | `../cliffperks-documentation/audit/security-audit.md` |
| Audit — testing | `../cliffperks-documentation/audit/testing-coverage.md` |

---

## Project Architecture

CliffPerks is a B2B2C employee-perks platform for Canadian employers and their workforces.

- **cliffperks-backend** (separate repo): Django 5 + DRF REST API. Django ORM → Neon Postgres. Railway Redis. Python 3.12. NOT NestJS. NOT Drizzle.
- **cliffperks-web** (this pnpm workspace, NOT Turborepo): Next.js 16 App Router. React 19, TypeScript, TanStack Query, Auth0.
- **packages/shared** (this workspace): TypeScript + Zod DTOs imported by the web app.
- **Data layer**: All data lives in Postgres behind the Django backend. This repo has no direct database access.
- **Cache**: Railway Redis, managed entirely by the backend. This repo does not touch Redis.
- **Auth**: Backend issues SimpleJWT tokens (`Authorization: Bearer <token>`). Auth0 (`@auth0/auth0-react`) is installed in this repo but NOT yet initialized — there is no `Auth0Provider` in the component tree. The auth architecture (SimpleJWT vs Auth0) is unresolved.

```
Browser
  └─ Next.js 16 App Router  (this repo)
       ├─ (employer)/dashboard   — analytics dashboard [static mock — not wired]
       ├─ (employee)/feed        — perk feed [static mock — not wired]
       └─ /                      — landing page (links /auth/login which does not yet exist as a route)
            │  HTTP REST — Authorization: Bearer <JWT>
            ▼
     cliffperks-backend (Django 5 + DRF)  [separate repo]
```

---

## This Repo's Role

Presentation layer only. No database access. No direct Redis access. Connects to `cliffperks-backend` REST API over HTTP for all data.

**Current state**: The UI shell is built with static mock data. No TanStack Query hooks are calling the live backend API. Auth0 is installed but not wired. The routes `/auth/login` and `/auth/verify` are linked from the landing page but do not exist as Next.js route directories.

---

## Cross-Repo Dependencies

- Calls `cliffperks-backend` at `http://localhost:8000` (dev) / TBD (prod).
- All requests must include `Authorization: Bearer <access_token>` from a SimpleJWT token issued by the backend.
- API endpoint reference: `../cliffperks-documentation/technical-architecture-api-reference.md`.
- Shared types: `@cliffperks/shared` (this workspace's `packages/shared`).

---

## Coding Conventions

Conventions derived from what is actually in the codebase:

- **CSS**: Standard CSS variables and class-based styles via `globals.css` and CSS Modules (`*.module.css`). No Tailwind — do not add it.
- **Styling class system**: `glass`, `card`, `grid`, `btn`, `text-muted` utility classes are defined in `globals.css`. Use them.
- **TypeScript**: `strict: true` in `tsconfig.json`. No `any` types.
- **React**: React 19 — use the App Router conventions. Server components by default; add `'use client'` only when needed (interactivity, hooks, browser APIs).
- **Data fetching**: TanStack Query (`@tanstack/react-query`) via the `QueryClientProvider` in `providers.tsx`. Use `useQuery` / `useMutation` for all API calls when wiring begins.
- **No Tailwind wrappers** — do not introduce Tailwind or any CSS-in-JS library.
- **Next.js 16 breaking changes** — APIs, file conventions, and behavior differ from earlier versions. Read `node_modules/next/dist/docs/` before writing Next.js-specific code.

---

## Known Issues (from audit, 2026-05-16)

- **All page data is hardcoded** — `dashboard/page.tsx` renders `450`, `180`, `$4,500`; `layout.tsx` renders `"Hi, Parveen"` and `"1,240 pts"`. None connected to API.
- **`/auth/login` route missing** — landing page `page.tsx` links to `/auth/login` but no route directory exists.
- **Auth0 not initialized** — `@auth0/auth0-react` is installed but no `Auth0Provider` wraps the component tree. `useAuth0` cannot be called anywhere.
- **Boilerplate metadata** — `src/app/layout.tsx` still has `title: "Create Next App"` and the default description.
- **No testing framework** — jest, vitest, playwright, and cypress are all absent from `package.json`.
- **Multiple package managers** — `package-lock.json` (npm), `pnpm-workspace.yaml` (pnpm), and `yarn-error.log` (yarn) coexist. Use pnpm exclusively (`pnpm install`, `pnpm dev`).
- **No error boundaries** — a JavaScript exception in any component will produce a blank screen in production.
- **No error monitoring** — Sentry is not installed.

---

## Testing State

- **Framework**: Not installed. No jest, vitest, playwright, or cypress in `package.json`.
- **Test files**: Zero.
- **Priority**: Once API calls are wired, add integration tests for the employer login flow, magic-link verify flow, and offer redemption flow. See `../cliffperks-documentation/audit/testing-coverage.md`.
