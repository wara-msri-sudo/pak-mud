# MVP brief

Agreed with the project owner on 2026-11-04. The slices are in [mvp-scope.md](mvp-scope.md), and how we check our guesses is in [research-plan.md](research-plan.md).

## One line
Pak Mud (ปักหมุด, "drop a pin") turns a pile of saved places into a day-by-day plan for a trip in Thailand, and tracks what the trip really costs.

## Why we are building it
1. For the owner's own trips first.
2. Then for friends.
3. Later, grow it to more visitors.

## Who it is for
Visitors to Thailand from any country ([0001](../decisions/0001-target-users.md)): backpackers, families, and friends travelling together.
A typical trip is about two weeks and covers several cities.

The first user is the project owner, on a real trip 3–6 months from November 2026.

## The problem
- Ideas are spread across Google Maps lists, spreadsheets and TikTok saves. There is no single list for the trip.
- A long list does not show what fits in a day: what is close together, how long it takes to get there, and when it is open.
- Planning takes too long, and plans go wrong on the trip.
- Money is hard to follow: what we planned to spend, what we really spent, and who owes whom.

## What the MVP lets a user do
1. Create a trip with several destinations, each with its own dates (for example Bangkok 8–11 Jan, then Chiang Mai 12–16 Jan).
2. Search Thai places and pin them. The pins are the trip's bucket list.
3. Put pins into days, in order, and tick each one off when visited.
4. See a day on a map, with travel time between stops.
5. See the planned cost per day, per destination and for the trip, in THB.
6. Log real spending as it happens, by category, and compare it with the plan.
7. Split costs with travel companions (names only) and see who owes whom.

## Design principles
- **Phone first.** People plan on their phone and use it on the trip. Design at 390 px first, then scale up.
- **Fast on the trip.** Ticking off a place or logging an expense takes seconds.
- **Your data stays on your device.** No login in the MVP ([0002](../decisions/0002-browser-storage-for-mvp.md)), and the app says so.
- **Honest data.** OpenStreetMap has no photos or ratings ([0003](../decisions/0003-openstreetmap-for-maps.md)). We don't fake them.

## Success
| Step | Signal |
|---|---|
| 1 | The owner plans a real trip in Pak Mud and uses it every day of the trip |
| 2 | 2–5 friends plan a real trip with it |
| 3 | On the trip, spending is logged in Pak Mud, not in a spreadsheet |

## Not in the MVP
| Item | When |
|---|---|
| Accounts and sync across devices | V2 ([0002](../decisions/0002-browser-storage-for-mvp.md)) |
| Sharing a trip, or friends seeing the split | V2 |
| Thai-language UI | V4 ([0001](../decisions/0001-target-users.md)) |
| Currencies other than THB | Later: display currency ([0001](../decisions/0001-target-users.md)) |
| Photos, ratings, reviews | Needs a new place-data provider decision |
| Offline map tiles | Later |
| Bookings, tickets, payments | Not planned |

## Proto-personas
These are guesses. Check them in interviews ([research-plan.md](research-plan.md)).

| Persona | Trip | Gets stuck on | Pak Mud must |
|---|---|---|---|
| **The owner** (MVP focus) | About 2 weeks, several cities | Turning saved places into days; tracking money on the trip | Everything in the MVP list above |
| The first-timer | 10–14 days: Bangkok, the north, an island | What is near what; how much fits in a day | Pins on a map; easy day planning |
| The returning explorer | 1–2 weeks somewhere less known | Place names spelled many ways; places search can't find | Search by English, romanised and Thai names |
| The group organiser | 5–7 days, 3–6 people | A pace that suits everyone; cost per person; who owes whom | Planned budget; split costs |

## Journey
| Stage | What they do | Pain | Pak Mud MVP |
|---|---|---|---|
| 1. Collect | Save places from posts, videos, friends | Ideas spread over many apps | Search and pin (Slice 2) |
| 2. Shape | Pick cities and dates, book travel | Hard to see distances | Destinations with dates (Slice 1), map (Slice 4) |
| 3. Plan days | Decide what to do each day | What fits in a day? | Days, order, times, travel time, planned cost (Slices 3–5) |
| 4. On the trip | Follow and change the plan, pay for things | Plan on a laptop, money in a spreadsheet | Phone view, tick off, log spending, split (Slices 3, 6, 7) |
| 5. After | Share and remember | Nothing to hand over | Later (V2 sharing) |

## Interview with the owner (2026-11-04)
| Topic | Answer |
|---|---|
| Why | Own trips first, grow later |
| Users | Visitors from anywhere: backpackers, families, friends. Trips of about 2 weeks |
| Plans with today | Google Maps lists, spreadsheets, TikTok saves |
| Must-haves | Trips with dates, search and pin places, day plan and map, budget in THB |
| Track | Bucket list (tick places off), planned budget, real spending |
| Real spending | Each expense, categories, daily totals, split with people |
| Cities | Several per trip, each with its own dates ([0004](../decisions/0004-trips-with-several-destinations.md)) |
| Device | Phone first |
| Sharing | Not needed in the MVP; 0002 stays |
| Split | Companions are names on the owner's phone ([0005](../decisions/0005-track-real-spending-in-mvp.md)) |
| Build order | Plan first, spending after; split last |
| Success | The owner's real trip, then 2–5 friends |
| Time | Trip in 3–6 months; 1–2 hours a day |
