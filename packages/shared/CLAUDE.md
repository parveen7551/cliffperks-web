# Shared Package Rules 

## Documentation Links
Last Updated: 2026-04-09
- Main References: `../../documentation/`
- Architecture Docs: `../../documentation/technical-architecture-api-reference.md`

## Project Architecture
CliffPerks is a B2B2C web platform configured as a monorepo (Turborepo + pnpm).
- **apps/web**: Next.js App Router providing Employer and Employee portals. Interfaces exclusively with the API.
- **apps/api**: NestJS REST backend handling core logic, Auth0 JWT validation, and async chron jobs.
- **packages/shared**: TypeScript / Zod resource bridging domains.
- **Data Layer**: Drizzle ORM mapping to Neon Postgres, utilizing an Append-Only points ledger.
- **Cache**: Railway Redis enforcing redemption limits and caching heavy aggregates.

## This Repo's Role
Functioning strictly as the bridging logic between the frontend and the backend. Eliminates manual interface cloning by providing a single source of truth for DtOs and internal typing validation.

## Cross-Repo Dependencies
- Operates totally standalone. Imported broadly into `apps/api` and `apps/web`.

## Coding Conventions
- Favor `Zod` validation schemas when structuring typings. 
- Avoid directly compiling `Next.js` or `NestJS` heavy bindings here. Logic should remain raw TS frameworks.

## Known Issues
- Architecture sound. Pre-audit structure.

## Testing State
- Typechecking spans via root Turbo config perfectly locally.
