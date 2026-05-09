@AGENTS.md

# Web Application Rules

## Documentation Links
Last Updated: 2026-04-09
- Main References: `../../documentation/`
- Architecture Docs: `../../documentation/technical-architecture-api-reference.md`
- Runbook (Vercel): `../../documentation/infrastructure-operations-runbook.md`

## Project Architecture
CliffPerks is a B2B2C web platform configured as a monorepo (Turborepo + pnpm).
- **apps/web**: Next.js App Router providing Employer and Employee portals. Interfaces exclusively with the API.
- **apps/api**: NestJS REST backend handling core logic, Auth0 JWT validation, and async chron jobs.
- **packages/shared**: TypeScript / Zod resource bridging domains.
- **Data Layer**: Drizzle ORM mapping to Neon Postgres, utilizing an Append-Only points ledger.
- **Cache**: Railway Redis enforcing redemption limits and caching heavy aggregates.

## This Repo's Role
Functioning strictly as the presentation layer. Connects directly to the backend bypassing native databases entirely. Incorporates Auth0 SPAs.

## Cross-Repo Dependencies
- Calls `apps/api` mapped endpoints utilizing React-Query and localized fetch streams. 

## Coding Conventions
- Native Next.js 14+ App Router logic. 
- Use standard CSS variables and styles injected via `globals.css` unless requested explicitly. Avoid generic Tailwind wrappers. 

## Known Issues
- Extracted audit constraints pending. MVP functioning normally over pre-determined local hooks.

## Testing State
- Needs E2E Cypress or Playwright framework setup to emulate Magic Link handshakes gracefully.
