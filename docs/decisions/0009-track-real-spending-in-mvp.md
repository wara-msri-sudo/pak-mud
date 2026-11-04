# 0009. Track real spending in the MVP

- Status: accepted
- Date: 2026-11-04
- Decided by: project owner (wara-msri-sudo)

## Context
The roadmap had a budget summary of estimated costs (Slice 5), and since 2026-11-03 a "who paid and settle up" slice
(then Slice 6). In the MVP discovery interview ([mvp-brief](../product/mvp-brief.md)) the owner also asked to track
real spending on the trip: each expense, categories, and daily totals compared with the plan. The MVP has no accounts
([0002](0002-browser-storage-for-mvp.md)), and the owner's trip is 3–6 months away, with 1–2 hours a day to build.

## Options considered
- Estimated budget only, plus who paid: the smallest change, but no record of what was really spent.
- Spending log after planning, then who paid: Slice 6 logs expenses, Slice 7 splits them. The core planning flow comes
  first. Who paid is last, so it can slip if time runs short.
- Spending early, right after trips: useful on any trip, but it delays the core planning flow.
- A split that friends see on their own phones: needs accounts and a database, which conflicts with 0002 (V2 work).

## Decision
Both are in the MVP, after planning:
- Slice 6, spending log: expenses in whole THB with a category and a day, daily and trip totals, and plan vs spent.
- Slice 7, who paid and settle up: travellers as names only, on one device; equal split by default with optional custom
  amounts; balances and settle-up (draft criteria in the [roadmap](../roadmap.md)).

## Consequences
- New `expense` feature (Slices 6–7). Storage goes through a repository port with a localStorage adapter; the Slice 6
  gate decides the key and shape (B8: trips and pins must keep loading).
- Expenses are cost items for Slice 7, next to pins with a cost.
- Friends cannot see the split on their own phones until V2.
- A display currency for visitors stays later ([0001](0001-target-users.md)).
- If time is short before the owner's trip, Slice 7 moves to after the trip.
