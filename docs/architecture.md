# Architecture

Current state of Pak Mud. Keep this file matching the code. Decisions live in [decisions/](decisions/README.md).

## Stack
- Next.js 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS 4, theme E3 · Slate-led ([0005](decisions/0005-visual-theme-e3.md)): tokens only in `src/app/globals.css`
- Vitest + Testing Library (unit and component), Playwright (e2e)
- Storage: browser localStorage ([0002](decisions/0002-browser-storage-for-mvp.md))
- Maps: OpenStreetMap ([0003](decisions/0003-openstreetmap-for-maps.md))

## Layers (clean architecture, inside to outside)
| Layer | Folder | May import |
|---|---|---|
| Domain (entities, rules) | `src/features/<feature>/domain/` | other domain code only |
| Application (use cases, ports) | `src/features/<feature>/application/` | domain |
| Adapters (localStorage, OSM, routing) | `src/features/<feature>/adapters/` | application, domain |
| UI + framework | `src/features/<feature>/ui/`, `src/app/`, `src/components/` (shared app chrome such as `AppHeader`) | everything above |

Dependencies point inward only. ESLint enforces the domain rule: files under `domain/` cannot
import React, Next.js or outer layers, or use browser globals (`eslint.config.mjs`).

## Features
| Feature | Status | Notes |
|---|---|---|
| `trip` | create and list (Slice 1) | `createTrip`, `sortTripsByStartDate`, `countTripDays`, `isIsoDate`. Use cases `addTrip` and `listTrips`. Adapters: localStorage ([0004](decisions/0004-trip-storage-schema.md)) and in-memory (tests) |
| `place` | planned (Slice 2) | `PlaceSearch` port |
| `itinerary` | planned (Slice 3) | |
| `budget` | planned (Slice 5) | |

## Ports
- `TripRepository` (built, `src/features/trip/application/tripRepository.ts`): `list()` and `save()`. Failures are a `TripStorageError` with the problem `unavailable` or `corrupt`
- `PlaceSearch`: place lookup (adapter: Nominatim or Photon)
- `RoutingService`: travel time between stops (provider to be decided in Slice 4)

## Routes
| Route | Page | Feature UI |
|---|---|---|
| `/` | `src/app/page.tsx` | link to `/trips` |
| `/trips` | `src/app/trips/page.tsx` | `TripList` (client) |
| `/trips/new` | `src/app/trips/new/page.tsx` | `NewTripForm` -> `TripForm` (client) |

Every page starts with `AppHeader` (the slate band). Pages are server components that only lay out the page. Client components load data in the browser,
because localStorage only exists there. `adapters/browserTrips.ts` wires the real repository, plus a clock
that supplies UUID ids (`generateTripId`: `randomUUID`, or random bytes on plain-HTTP pages) and the current time.

## Data flow
`src/app` page -> feature `ui` component -> application use case -> port -> adapter.
Domain objects cross boundaries as plain data.
