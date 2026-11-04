# Roadmap

Slices are built in order with [waraflow](waraflow.md). Each slice's final contract (story, criteria, design
decisions) is agreed with the owner when the slice starts. The drafts below are starting points, not approvals.

MVP discovery (2026-11-04): why and for whom in [product/mvp-brief.md](product/mvp-brief.md), and how we check our
guesses in [product/research-plan.md](product/research-plan.md). The MVP is Slices 0–7, aimed at the owner's own trip
in 3–6 months. Slice 7 is last, so it can slip past the trip if time runs short.

## Done
| Slice | What |
|---|---|
| 0 | Foundation: Next.js, tests, lint guard, docs |
| 1 | Create and list trips (localStorage) |
| 1.5 | Theme E3 · Slate-led, header band |
| 1.6 | dd/mm/yyyy dates |
| 1.7 | Code-review fixes |
| 2 | Trip page, search places (Nominatim) and pin them |

## Next
| Slice | What | Status |
|---|---|---|
| 2.5 | Multi-city trips: several destinations, each with its own dates | Planned (added 2026-11-04) |
| 3 | Day-by-day itinerary with a wishlist; tick a stop as visited | Planned |
| 4 | Map and route per day | Planned |
| 5 | Budget summary: estimated cost per day, per destination, per trip, per category | Planned |
| 6 | Spending log: real expenses, plan vs spent | Planned (added 2026-11-04) |
| 7 | Who paid and settle up | Planned (added 2026-11-03 as Slice 6; moved to 7 on 2026-11-04) |

## Slice 2.5 draft: multi-city trips

Decided by the owner on 2026-11-04 ([0008](decisions/0008-trips-with-several-destinations.md)). It comes before Slice 3,
because each day needs to know which city it is in.

**Story:** As a visitor touring several cities, I want one trip that holds each city with its own dates, so my days,
pins and costs stay in one plan.

**Draft acceptance criteria**
1. A trip has one or more destinations in order, each with a city and a start and end date (dd/mm/yyyy).
2. Destinations do not overlap. The trip runs from the first destination's start date to the last one's end date.
3. You can add, edit and remove a destination.
4. The trip list shows the cities in order, for example "Bangkok → Chiang Mai → Krabi", and the whole date range.
5. **B8:** trips saved with one destination (trips v1) still load, as a trip with one destination. The migration to v2
   has a migration test.

**Open questions for the slice's design gate:** the v2 stored shape; whether gaps between destinations (travel days)
are allowed; whether a pin belongs to a destination.

## Slice 6 draft: spending log

Decided by the owner on 2026-11-04 ([0009](decisions/0009-track-real-spending-in-mvp.md)).

**Story:** As a traveller on the trip, I want to log what I really spend, so I can see whether I'm keeping to my plan.

**Draft acceptance criteria**
1. Add an expense: an amount in whole THB, a category, a day, and an optional note and pin. On a phone it takes under 10 seconds.
2. Edit or delete an expense.
3. See the real spending for each day and for the whole trip.
4. See plan vs spent per day and for the trip, where the plan is the estimated cost of the pins on that day.
5. **B8:** trips and pins saved before this slice still load.

**Open questions for the slice's design gate:** the expense category list (pins use Food, Temple, Nature, Shopping,
Nightlife, Stay; expenses also need things like transport and SIM cards), and storage (a new key vs a pins schema bump).

## Slice 7 draft: who paid and settle up

Requested by the owner on 2026-11-03 as Slice 6. On 2026-11-04 the owner moved it after the spending log, so it can slip if
time is short. Decisions already made:
- It's a **new slice after the spending log**. Slice 5 stays a plain budget summary.
- **Travellers are names typed per trip** (no accounts), stored in this browser like trips.
- **Splits:** equal by default, with optional **custom amounts per person**.
- **Cost items:** pins with a cost (hotel, temple ticket) and the expenses logged in Slice 6 (bus, taxi, SIM card).

**Story:** As a group travelling together, we want to record who paid for each activity and see who owes whom,
so we can settle up fairly at the end of the trip.

**Draft acceptance criteria**
1. A trip has a list of travellers. You can add a traveller by name, and rename or remove them while nothing is assigned to them.
2. Each cost item (a pin with a cost, or an expense such as "Bus Bangkok → Chiang Mai, ฿1,800") has
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
8. **B8:** trips, pins and expenses saved before this slice still load. Costs with no payer are listed as "not assigned yet"
   and left out of the settle-up until someone assigns them.

**Open questions for the slice's design gate:** where travellers are stored (new storage key vs a schema bump, a B8
decision), whether settle-up lists money the travellers already paid back to each other, and currency (THB only for now).

## After the MVP (candidates; rank after the owner's trip)
Drop a custom pin when search finds nothing, paste a list of places or import a Google Maps list, opening-hours warnings,
suggest days by grouping nearby pins, a "Today" view for the trip, print or copy a day as text, display currency next to THB.

## Later (V2+)
Accounts, shared trips and co-editing, AI itinerary suggestions, route optimisation, weather, packing list, booking vault,
offline/PWA, export to PDF or calendar, Thai UI.
