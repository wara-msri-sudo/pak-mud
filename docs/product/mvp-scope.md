# MVP scope

The MVP story map, agreed on 2026-11-04. Why we build it: [mvp-brief.md](mvp-brief.md).
Each slice is one branch and PR and follows [waraflow](../waraflow.md). Slice 0 (foundation) is done.

**Order:** plan first, then spending. Slice 7 is last, so it can slip past the owner's trip if time runs short.
**Pace:** about one slice every 2–3 weeks at 1–2 hours a day, to fit the trip in 3–6 months.

| Slice | Feature | A user can… |
|---|---|---|
| 1 | `trip` | Create trips made of destinations with dates |
| 2 | `place` | Search and pin places: the bucket list |
| 3 | `itinerary` | Plan days and tick stops off |
| 4 | `itinerary` | See a day on a map with travel time |
| 5 | `budget` | See the planned budget |
| 6 | `expense` | Log real spending and compare it with the plan |
| 7 | `expense` | Split costs with travel companions |

## Slice 1: Trips
- Create a trip: a name, then one or more destinations in order, each with a city and start and end dates ([0004](../decisions/0004-trips-with-several-destinations.md)).
- See all my trips, soonest first.
- Edit or delete a trip.
- Trips survive a reload. Stored data has a schema version and copes with missing or corrupt storage.

Design gate: the stored shape of a trip and its destinations, including gaps and travel days between cities.

## Slice 2: Places
- Search places in Thailand. Search is debounced, sends at most 1 request a second and names the app ([0003](../decisions/0003-openstreetmap-for-maps.md)).
- Pin a result to the trip.
- Add a note, a category, a planned cost (THB) and opening hours.
- See the wishlist: pins not yet on a day, grouped by destination.

Design gate: the pin shape; Nominatim or Photon (based on the [search spike](research-plan.md#1-search-spike-before-slice-2)).

## Slice 3: Days
- See the trip day by day. Each day shows its destination.
- Move a pin from the wishlist to a day; reorder pins; move a pin to another day.
- Set an optional time for a stop.
- Tick a stop as visited, and see "visited 3 of 5".

Design gate: what happens to scheduled pins when a destination's dates change.

## Slice 4: Map
- See a day's stops on a map, numbered in order.
- See travel time and distance between stops.
- OpenStreetMap attribution on the map.

Design gate: the Leaflet dependency; routing by OSRM or straight line ([0003](../decisions/0003-openstreetmap-for-maps.md)).

## Slice 5: Planned budget
- Planned cost per day, per destination and for the trip.
- Wishlist costs shown separately from the plan.

## Slice 6: Spending
- Log an expense: amount (THB), category, day, an optional note and an optional pin ([0005](../decisions/0005-track-real-spending-in-mvp.md)).
- Daily and trip totals of real spending.
- Plan vs spent, per day and for the trip.

Design gate: the expense shape, the category list, and which repository port stores expenses.

## Slice 7: Split
- Add travellers to a trip (names only).
- For each expense, record who paid and who shares it (equal split).
- See who owes whom, with as few payments as possible.

Design gate: the traveller and share shape; how to round THB amounts that don't divide evenly.

## Next (after the MVP; rank after testing)
- Drop a custom pin when search finds nothing.
- Paste a list of place names and pin them all; import a Google Maps list.
- Warn when a stop is outside its opening hours.
- Suggest days by grouping nearby pins.
- A "Today" view for use on the trip.
- Print or copy a day as text.
- Uneven splits (by amount or by share).
- Display currency next to THB.
- Duplicate a trip.

## Later
- Accounts and sync across devices (V2).
- Share a trip and plan it together; friends see the split (V2).
- Thai-language UI (V4).
- Photos and ratings (needs a new place-data provider).
- Offline map tiles.

## In every slice
- Phone first: designed at 390 px, and works at 375 px with no sideways scroll.
- UI text goes through one place, so Thai can be added later (V4).
- At most 200 kB first-load JS per route.
- Tests, evidence under `docs/evidence/<slice>/`, and updated docs.
