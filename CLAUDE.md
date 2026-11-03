# Pak Mud

A trip planner for visitors to Thailand: pin places, then turn the pins into a day-by-day plan.

**Follow [docs/waraflow.md](docs/waraflow.md) for all code changes.**
Before designing anything, read [docs/architecture.md](docs/architecture.md) and [docs/decisions/README.md](docs/decisions/README.md).
Next.js agent notes: @AGENTS.md

## Rules
1. Domain code (`src/features/*/domain/`) never imports React, Next.js, outer layers or browser APIs. ESLint enforces this.
2. Group code by feature first: `src/features/<feature>/{domain,application,adapters,ui}`. Keep `src/app/` thin.
3. Persistence and external services go through ports (`TripRepository`, `PlaceSearch`, `RoutingService`).
4. Ask before adding a dependency, changing the stored data shape, or calling a new external service.
5. Never weaken tests, lint rules or TypeScript strictness to get a pass.
6. Every slice ships with tests, evidence under `docs/evidence/<slice>/`, and updated docs.
7. Colours come only from tokens in `src/app/globals.css` (decision 0005). `src/app/theme.test.ts` enforces contrast and the no-hex rule.

# Project adapter

## Stack
- Language / framework: TypeScript (strict), Next.js 16 App Router, React 19, Tailwind CSS 4
- Datastore: browser localStorage (decision 0002)
- Hosting / deploy: not decided yet

## Commands
- Install: `npm install`
- Run: `npm run dev` (production: `npm run build && npm start`)
- Readiness check: `http://localhost:3000` returns 200
- Test (unit): `npm test`
- Test (e2e): `npm run test:e2e` (Playwright starts the dev server itself)
- Lint: `npm run lint`
- Type check: `npm run typecheck`
- Build: `npm run build`
- Dependency audit: `npm audit --omit=dev`
- Performance: `npm run build` route sizes. Lighthouse when UI slices land.

## Verification surface
- UI in the browser, driven with Playwright (Chromium). Screenshots go to `docs/evidence/<slice>/`.
- Required access: none (no secrets, no backend).

## Conventions
- Files: components `PascalCase.tsx`, everything else `camelCase.ts`. Tests sit next to the code as `*.test.ts(x)`. E2E tests go in `e2e/*.spec.ts`.
- Dates: ISO `YYYY-MM-DD` strings in the domain. Money: integer THB.
- Commits: small and imperative ("Add trip list page"). One slice per branch and PR.

## Extra Definition of Done items
- The page works at phone width (375px) with no horizontal scroll.
- Map pages show OpenStreetMap attribution.
- Pages start with `AppHeader`, use one filled primary per area, and look right in light and dark mode.

## Performance budgets
- First-load JS per route: at most 200 kB (checked from Slice 1 on).

## Risky areas (always ask first)
- Stored data shape (localStorage schema), new dependencies, external APIs (Nominatim usage policy), deploys.

## Docs locations
- Architecture: docs/architecture.md
- Decisions: docs/decisions/
- Glossary: docs/glossary.md
