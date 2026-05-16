# CliffPerks Shared Package — AI Context

Last Updated: 2026-05-16

## Documentation Links

| Resource | Path |
|----------|------|
| Platform overview | `../../documentation/README.md` |
| API response shapes | `../../documentation/technical-architecture-api-reference.md` |
| Database schema (source of truth for types) | `../../documentation/database-schema-documentation.md` |
| Audit — code quality | `../../documentation/audit/code-quality-architecture.md` |

---

## Project Architecture

CliffPerks is a B2B2C employee-perks platform for Canadian employers and their workforces.

- **cliffperks-backend** (separate repo): Django 5 + DRF REST API. Django ORM → Neon Postgres. Railway Redis. Python 3.12. NOT NestJS. NOT Drizzle.
- **cliffperks-web** (parent pnpm workspace): Next.js 16 App Router. React 19, TypeScript, TanStack Query.
- **packages/shared** (this package): TypeScript + Zod DTOs. Provides a single source of truth for the types that flow between frontend and backend.
- **Data layer**: Postgres behind the Django backend. Types in this package mirror the DRF serializer output.
- **Auth**: Backend issues SimpleJWT tokens. Auth0 is installed in `cliffperks-web` but not yet wired.

---

## This Package's Role

Standalone library imported by `cliffperks-web` (and, in future, any other consumer). Provides:
- TypeScript interfaces and type aliases that mirror the backend's DRF serializer output
- Zod validation schemas for parsing API responses at runtime

Does not import from Next.js, React, or any application framework. Logic must remain framework-neutral TypeScript.

**Current state**: Only one interface is exported — `Employer` with three fields (`id`, `name`, `subdomain`). The full API surface (Employee, Offer, Redemption, PointsLedger, Announcement, etc.) is not yet modelled here.

---

## Cross-Repo Dependencies

- Depends on: nothing upstream. Zero external runtime dependencies except `zod`.
- Consumed by: `cliffperks-web` (imported as `@cliffperks/shared`).
- Source of truth for types: `../../documentation/database-schema-documentation.md` describes all backend models; `../../documentation/technical-architecture-api-reference.md` describes serializer output shapes.

---

## Coding Conventions

Conventions derived from what is actually in the codebase:

- TypeScript `strict: true` (`tsconfig.json`). No `any`.
- Use Zod schemas as the primary definition; derive TypeScript types with `z.infer<typeof Schema>` where possible.
- Avoid importing Next.js, React, NestJS, or any framework-specific bindings. Keep this package as raw TypeScript.
- Export everything through `src/index.ts` barrel file — consumers import from `@cliffperks/shared`, not from deep paths.
- Use CommonJS output (`"module": "CommonJS"` in tsconfig) for compatibility with both Next.js and Node.js consumers.
- Build: `pnpm build` (runs `tsc`). Outputs to `dist/`.

---

## Known Issues (from audit, 2026-05-16)

- **Thin type coverage** — only `Employer` (3 fields) is exported. The actual API response surface includes at minimum: Employee, Offer (with bilingual fields + redemption type variants), Redemption (with type-aware payload), PointsLedger, Announcement, BrandPartner, and analytics response shape. These are all missing.
- **No Zod schemas yet** — the current `employer.ts` exports a plain TypeScript interface, not a Zod schema. Runtime validation is not possible.
- **No tests** — no test runner installed in this package. Zod schema transforms and parse constraints are untested.

---

## Testing State

- **Framework**: Not installed in this package.
- **Test files**: Zero.
- **Priority**: Unit tests for Zod parse/validation once schemas are written. Focus on: null/optional field handling, UUID format validation, enum value validation matching backend choices.
