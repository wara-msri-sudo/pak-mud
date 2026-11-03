# Roadmap

Slices are built in order with [waraflow](waraflow.md). Each slice's final contract (story, criteria, design
decisions) is agreed with the owner when the slice starts. The drafts below are starting points, not approvals.

## Done
| Slice | What |
|---|---|
| 0 | Foundation: Next.js, tests, lint guard, docs |
| 1 | Create and list trips (localStorage) |
| 1.5 | Theme E3 · Slate-led, header band |
| 1.6 | dd/mm/yyyy dates |
| 1.7 | Code-review fixes |

## Next
| Slice | What | Status |
|---|---|---|
| 2 | Trip page, search places (Nominatim) and pin them | Plan ready, waiting for owner approval |
| 3 | Day-by-day itinerary with a wishlist | Planned |
| 4 | Map and route per day | Planned |
| 5 | Budget summary: cost per day, per trip, per category | Planned |
| 6 | Who paid and settle up | Planned (added 2026-11-03) |

## Slice 6 draft: who paid and settle up

Requested by the owner on 2026-11-03. Decisions already made:
- It's a **new slice after Budget**. Slice 5 stays a plain budget summary.
- **Travellers are names typed per trip** (no accounts), stored in this browser like trips.
- **Splits:** equal by default, with optional **custom amounts per person**.
- **Cost items:** pins (hotel, temple ticket) can carry a payer, and the visitor can also add **extra expenses** that
  aren't places (bus, taxi, SIM card).

**Story:** As a group travelling together, we want to record who paid for each activity and see who owes whom,
so we can settle up fairly at the end of the trip.

**Draft acceptance criteria**
1. A trip has a list of travellers. You can add a traveller by name, and rename or remove them while nothing is assigned to them.
2. Each cost item (a pin with a cost, or an extra expense such as "Bus Bangkok → Chiang Mai, ฿1,800") has
   one **payer** and the people who **share** it.
3. **Equal split** divides the amount between the sharers in whole baht. Any leftover baht goes to sharers in list
   order, so the shares always add up to the total.
4. **Custom split** lets you type an amount per sharer. It can only be saved when the amounts add up to the total, and the
   form shows how much is left to assign.
5. Each cost item shows its payer and the split, for example "Hotel ฿3,000 · paid by Wara · shared by 3".
6. A **per-person summary** shows what each traveller paid, what their share is, and their balance:
   "gets back ฿1,200" or "owes ฿800".
7. A **settle-up list** shows the fewest payments that clear every balance, for example "Mint pays Wara ฿800".
   The balances always sum to zero.
8. **B8:** trips and pins saved before this slice still load. Costs with no payer are listed as "not assigned yet" and left out
   of the settle-up until someone assigns them.

**Open questions for the slice's design gate:** where travellers and expenses are stored (new storage keys vs a schema
bump, a B8 decision), whether settle-up lists money the travellers already paid back to each other, and currency (THB only for now).

## Later (V2+)
Accounts, shared trips and co-editing, AI itinerary suggestions, route optimisation, weather, packing list, booking vault,
offline/PWA, export to PDF or calendar, Thai UI.
