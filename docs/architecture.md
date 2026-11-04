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
Slice plan: [roadmap.md](roadmap.md). Product brief: [product/mvp-brief.md](product/mvp-brief.md).

| Feature | Status | Notes |
|---|---|---|
| `trip` | create and list (Slice 1) | `createTrip`, `sortTripsByStartDate`, `countTripDays`, `isIsoDate`. Use cases `addTrip` and `listTrips`. Adapters: localStorage ([0004](decisions/0004-trip-storage-schema.md)) and in-memory (tests). Slice 2.5 adds several destinations per trip ([0008](decisions/0008-trips-with-several-destinations.md)) |
| `pin` | search and pin (Slice 2) | `createPin`, categories. Use cases `addPin`, `listPins`, `searchPlaces`. Adapters: localStorage `pak-mud:pins` ([0006](decisions/0006-pin-storage.md)), Nominatim ([0007](decisions/0007-nominatim-place-search.md)), in-memory (tests) |
| `itinerary` | planned (Slices 3–4) | Day plan, visited ticks, map and route |
| `budget` | planned (Slice 5) | |
| `expense` | planned (Slices 6–7) | Spending log, then who paid and settle up ([0009](decisions/0009-track-real-spending-in-mvp.md)) |

## Ports
- `TripRepository` (built, `src/features/trip/application/tripRepository.ts`): `list()` and `save()`. Failures are a `TripStorageError` with the problem `unavailable` or `corrupt`
- `PinRepository` (built, `src/features/pin/application/pinRepository.ts`): `listByTrip()` and `save()`, failures are a `PinStorageError`
- `PlaceSearch` (built, `src/features/pin/application/placeSearch.ts`): `search(query)`, failures are a `PlaceSearchError` (`too-short`, `unavailable`, `bad-response`)
- `RoutingService`: travel time between stops (provider to be decided in Slice 4)

## Routes
| Route | Page | Feature UI |
|---|---|---|
| `/` | `src/app/page.tsx` | link to `/trips` |
| `/trips` | `src/app/trips/page.tsx` | `TripList` (client) |
| `/trips/[id]` | `src/app/trips/[id]/page.tsx` (runtime `params` inside `<Suspense>`, needed with Cache Components) | `TripPinsScreen` -> `PlaceSearchPanel` -> `PinForm`, plus `PinList` (client) |
| `/trips/new` | `src/app/trips/new/page.tsx` | `NewTripForm` -> `TripForm` -> `DateField` (client; dd/mm/yyyy text plus the browser calendar) |

Every page starts with `AppHeader` (the slate band). Pages are server components that only lay out the page. Client components load data in the browser,
because localStorage only exists there. `adapters/browserTrips.ts` wires the real repository, plus a clock
that supplies UUID ids (`generateId` in `src/shared/adapters/`: `randomUUID`, or random bytes on plain-HTTP pages) and the current time.

## Shared code
- `src/shared/adapters/versionedLocalStorage.ts`: one list under one key as `{ schemaVersion, <list> }`, with corrupt/unavailable errors mapped to each feature's error. Used by trips and pins.
- `src/shared/adapters/generateId.ts`: UUIDs for trips and pins.

## Data flow
`src/app` page -> feature `ui` component -> application use case -> port -> adapter.
Domain objects cross boundaries as plain data.
