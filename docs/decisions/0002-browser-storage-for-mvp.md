# 0002. MVP storage: browser localStorage behind a repository port

- Status: accepted
- Date: 2026-11-03
- Decided by: project owner (wara-msri-sudo)

## Context
The MVP has to store trips, pins and itineraries. We want to ship fast without taking on auth and database risk.

## Options considered
- Browser only (localStorage), no login: fastest, with no backend and no secrets. Data stays on one device and is lost if the user clears it.
- Backend DB + login now (for example Supabase or Postgres): works across devices and makes sharing possible. More setup, auth risk, and hosting cost.

## Decision
Browser only for the MVP. All persistence goes through a `TripRepository` port defined in the
application layer. A `LocalStorageTripRepository` adapter implements it.

## Consequences
- No accounts and no sharing until V2. The V2 database replaces only the adapter.
- Stored data needs a schema version so later migrations stay possible.
- Reads must tolerate missing or corrupt storage (private mode, cleared site data).
