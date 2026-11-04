# 0005. Track real spending in the MVP

- Status: accepted
- Date: 2026-11-04
- Decided by: project owner (wara-msri-sudo)

## Context
The MVP had planned costs only (Slice 5). In the discovery interview ([mvp-brief](../product/mvp-brief.md)) the owner asked
to also track real spending on the trip: each expense, categories, daily totals, and a split with travel companions.
The MVP has no accounts ([0002](0002-browser-storage-for-mvp.md)).

## Options considered
- Planned budget only (as before): the smallest MVP, but no help on the trip, where money is a real pain.
- Spending after planning: Slice 6 (expenses) and Slice 7 (split). The core planning flow comes first. Split is last,
  so it can slip if time runs short.
- Spending early, right after trips: useful on any trip, but it delays the core planning flow.
- A split that friends see on their own phones: needs accounts and a database, which conflicts with 0002 (V2 work).

## Decision
Spending is in the MVP, built after planning:
- Slice 6: expenses with a category and a day, daily and trip totals, and plan vs spent.
- Slice 7: travellers as names only, on one device; equal split; who owes whom.

Amounts are integer THB.

## Consequences
- New `expense` feature (Slices 6–7). Storage goes through a repository port with a localStorage adapter. The Slice 6 gate
  decides whether that is `TripRepository` or a new port.
- Glossary updated: Planned cost, Expense, Traveller.
- Friends cannot see the split on their own phones until V2.
- A display currency for visitors stays later ([0001](0001-target-users.md)).
- The MVP grows to seven slices. If time is short before the owner's trip, Slice 7 moves to after the trip.
