# Research plan

How we check the riskiest guesses behind the MVP ([mvp-brief.md](mvp-brief.md)) before and while we build.
Results go in `docs/product/research/`. When a result changes a decision, write a new decision note.

## Assumptions
| # | We believe | Type | Risk | How we check | Feeds |
|---|---|---|---|---|---|
| A1 | OSM search finds most places we want, by English, romanised or Thai name | Feasibility | High | Search spike | Slice 2: Nominatim or Photon; custom pins sooner? |
| A2 | OSM has opening hours for enough places; otherwise people type them in | Feasibility | Med | Search spike | Slice 2 pin fields |
| A3 | Planning days on a phone (move, reorder) is easy | Usability | High | Click-through test | Slice 3: drag or buttons |
| A4 | Logging an expense on a phone takes under 10 seconds, so people do it on the trip | Usability | High | Click-through test, owner's trip | Slice 6 form |
| A5 | Friends want to plan day by day, not just keep a list | Desirability | Med | Friend interviews | Order of Slices 3–5 |
| A6 | An equal split by names, on one phone, is enough for groups | Desirability | Med | Friend interviews | Slice 7 scope |
| A7 | Keeping data on one device, with no login, is fine for the MVP | Desirability | Med | Friend interviews | When to start V2 |
| A8 | A simple travel-time estimate is good enough to judge a day | Feasibility | Med | Slice 4 gate: straight line vs OSRM on 20 real legs | Slice 4 routing |

## 1. Search spike (before Slice 2)
Checks A1 and A2. About 2–3 hours. No users needed.

1. List 50 places from the owner's own Google Maps lists and TikTok saves. Mix Bangkok, the north and an island; big sights, cafés, markets and street-food stalls.
2. For each place, search by its English name, by another romanised spelling, and by its Thai name when known.
3. Search by hand in Nominatim and in Photon, at most 1 request a second, following the [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/).
4. Record for each search: found in the top 3? Right location? Has opening hours?

Output: `docs/product/research/search-spike.md`, with the hit rate per name type and per provider.
Feeds: the Slice 2 provider choice, and whether "drop a custom pin" moves into the MVP.

## 2. Friend interviews (during Slices 1–2)
Checks A5, A6, A7 and the proto-personas.

- **Who:** 2–5 friends who travelled (in Thailand or elsewhere) in the last 12 months.
- **How:** 30 minutes, by video or in person. Ask about what they did, not what they would do.
- **Notes:** one file per interview, `docs/product/research/interview-01.md` and so on. First names only, no contact details.

Questions:
1. Tell me about your last trip. Where, how long, with whom?
2. Before the trip, how did you find places to go? Show me where you saved them.
3. What did you do with that list?
4. Did you plan day by day? Show me the plan if you still have it. What was hard?
5. Which device did you plan on? Which did you use on the trip?
6. Tell me about a day that didn't go as planned. What happened?
7. How did you keep track of money? Did you split costs with anyone? How?
8. Did you share your plan or places with anyone? How?
9. If you could fix one thing about planning a trip, what would it be?
10. Can I show you a prototype later?

## 3. Click-through test (before Slice 3, again before Slice 6)
Checks A3 and A4. Uses the concept screens on the discovery canvas (Play mode), on a phone, with 3–5 people.

Tasks:
1. "You're going to Bangkok and Chiang Mai in January. Add Wat Arun to your trip."
2. "Put Wat Arun on your first day in Bangkok, before lunch."
3. "You're at Wat Arun now. Mark it as visited."
4. "You just paid 120 baht for lunch. Log it." (Time this one.)
5. "You and two friends shared a 900 baht dinner, and you paid. Who owes you what?"

Watch for hesitation, wrong taps and questions.
Pass: at least 4 of 5 people finish each task without help, and task 4 takes under 10 seconds.

## 4. The owner's trip (the real test)
Use Pak Mud every day of the trip. Keep a short daily log in `docs/product/research/trip-log.md`:
- what worked,
- what was missing,
- what was done outside Pak Mud.

After the trip, run a retrospective and rank the "Next" list in [mvp-scope.md](mvp-scope.md).

## Schedule
| When | What |
|---|---|
| Before Slice 2 | Search spike |
| During Slices 1–2 | Friend interviews |
| Before Slice 3 and before Slice 6 | Click-through test |
| On the trip | Daily log |
