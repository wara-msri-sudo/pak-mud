# 0006. Pin storage: its own localStorage key

- Status: accepted
- Date: 2026-11-03
- Decided by: project owner (wara-msri-sudo)

## Context
Slice 2 saves pins (places pinned to a trip). Stored data is a compatibility surface (waraflow B8): trips saved
under `pak-mud:trips` v1 (decision 0004) must keep loading.

## Options considered
- New key `pak-mud:pins` = `{ schemaVersion: 1, pins: Pin[] }`, each pin linked by `tripId`. Additive: trips are untouched and need no migration.
- Pins inside each trip: bumps trips to v2 with a migration. One read per trip, but a breaking change to existing data.

## Decision
A new key, `pak-mud:pins`, holding `{ schemaVersion: 1, pins: Pin[] }`.
`Pin = { id, tripId, placeId, name, area, lat, lon, category, costThb, openingHours, note, createdAt }`.
`category` is one of food, temple, nature, shopping, nightlife or stay. `costThb` is a whole, non-negative number (0 = free).
Reading follows decision 0004: corrupt data shows a notice and is never overwritten, and blocked storage shows a notice.
Both keys share `src/shared/adapters/versionedLocalStorage.ts`.

## Consequences
- Trips v1 is unchanged. A test proves saving pins leaves the trips key byte-for-byte the same.
- Deleting a trip (a later slice) must also delete its pins.
- Slice 6 (who paid) will extend pins and add expenses. That is a v2 change for pins, with a migration test.
