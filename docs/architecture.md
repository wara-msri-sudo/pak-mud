# Architecture

Current state of Pak Mud. Keep this file matching the code. Decisions live in [decisions/](decisions/README.md).

## Stack
- Next.js 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS 4
- Vitest + Testing Library (unit and component), Playwright (e2e)
- Storage: browser localStorage ([0002](decisions/0002-browser-storage-for-mvp.md))
- Maps: OpenStreetMap ([0003](decisions/0003-openstreetmap-for-maps.md))

## Layers (clean architecture, inside to outside)
| Layer | Folder | May import |
|---|---|---|
| Domain (entities, rules) | `src/features/<feature>/domain/` | other domain code only |
| Application (use cases, ports) | `src/features/<feature>/application/` | domain |
| Adapters (localStorage, OSM, routing) | `src/features/<feature>/adapters/` | application, domain |
| UI + framework | `src/features/<feature>/ui/`, `src/app/` | everything above |

Dependencies point inward only. ESLint enforces the domain rule: files under `domain/` cannot
import React, Next.js or outer layers, or use browser globals (`eslint.config.mjs`).

## Features
Slice plan and user stories: [product/mvp-scope.md](product/mvp-scope.md).

| Feature | Status | Notes |
|---|---|---|
| `trip` | domain started (Slice 1) | `countTripDays` (inclusive day count). A trip has several destinations ([0004](decisions/0004-trips-with-several-destinations.md)) |
| `place` | planned (Slice 2) | `PlaceSearch` port |
| `itinerary` | planned (Slices 3–4) | Day plan, visited ticks, map and travel time |
| `budget` | planned (Slice 5) | Planned costs |
| `expense` | planned (Slices 6–7) | Real spending and split by traveller names ([0005](decisions/0005-track-real-spending-in-mvp.md)) |

## Planned ports
- `TripRepository`: persistence (adapter: localStorage)
- `PlaceSearch`: place lookup (adapter: Nominatim or Photon)
- `RoutingService`: travel time between stops (provider to be decided in Slice 4)

## Data flow
`src/app` page -> feature `ui` component -> application use case -> port -> adapter.
Domain objects cross boundaries as plain data.
