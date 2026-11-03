# 0004. Trip storage schema in localStorage

- Status: accepted
- Date: 2026-11-03
- Decided by: project owner (wara-msri-sudo)

## Context
Slice 1 stores trips in the browser (decision 0002). The stored shape must stay readable as the
app grows, and a bad value must never crash the app or be silently thrown away.

## Options considered
- One versioned key: `pak-mud:trips` holds `{ schemaVersion: 1, trips: Trip[] }`. Easy to migrate, one read and one write per change.
- One key per trip plus an index key: smaller writes, but harder to keep consistent and to migrate.

## Decision
One versioned key, `pak-mud:trips`, holding `{ schemaVersion: 1, trips: Trip[] }`, where
`Trip = { id, name, destination, startDate, endDate, createdAt }`. All fields are strings: dates are `YYYY-MM-DD`,
`createdAt` is an ISO timestamp, and `id` is a UUID.

Reading rules (in `LocalStorageTripRepository`):
- A missing key means no trips.
- Bad JSON, an unknown `schemaVersion`, or a trip with a missing field means corrupt. The list shows a notice,
  and saving is refused so the corrupt value is never overwritten (fail closed).
- If storage is blocked or full, the list shows a notice and saving fails with a clear message.

## Consequences
- A later shape change bumps `schemaVersion` and adds a migration in the adapter.
- A visitor with corrupt data cannot save trips until it is fixed. Recovery (for example, backing up
  the raw value and starting fresh) is a follow-up that needs its own decision.
- A save reads and writes in one synchronous step, so trips in two open tabs do not overwrite each other.
  A tab does not refresh its list when another tab adds a trip.
