# Research plan

How we check the riskiest guesses behind the MVP ([mvp-brief.md](mvp-brief.md)) while we build.
Results go in `docs/product/research/`. When a result changes a decision, write a new decision note.

## Assumptions
| # | We believe | Type | Risk | How we check | Feeds |
|---|---|---|---|---|---|
| A1 | Nominatim search ([0007](../decisions/0007-nominatim-place-search.md)) finds most places we want, by English, romanised or Thai name | Feasibility | High | Search check with real lists | Whether "drop a custom pin" moves into the MVP |
| A2 | Planning days on a phone (move, reorder) is easy | Usability | High | Click-through test | Slice 3: drag or buttons |
| A3 | Logging an expense on a phone takes under 10 seconds, so people do it on the trip | Usability | High | Click-through test, owner's trip | Slice 6 form |
| A4 | Friends want to plan day by day, not just keep a list | Desirability | Med | Friend interviews | Order of Slices 3–5 |
| A5 | Travellers as names on one phone are enough for groups | Desirability | Med | Friend interviews | Slice 7 scope |
| A6 | Keeping data on one device, with no login, is fine for the MVP | Desirability | Med | Friend interviews | When to start V2 |
| A7 | A simple route estimate is good enough to judge a day | Feasibility | Med | Slice 4 gate: straight line vs OSRM on 20 real legs | Slice 4 routing |

## 1. Search check with real lists (now)
Checks A1. About 1–2 hours, in the app as built (Slice 2). No other users needed.

1. Take 30 places from the owner's own Google Maps lists and TikTok saves. Mix Bangkok, the north and an island;
   big sights, cafés, markets and street-food stalls.
2. Search each one in Pak Mud by its English name, by another romanised spelling, and by its Thai name when known.
3. Record for each search: found? Right place? Has opening hours?

Output: `docs/product/research/search-check.md`, with the hit rate per name type.
Feeds: whether "drop a custom pin" moves from "after the MVP" into the MVP.

## 2. Friend interviews (during Slices 2.5–3)
Checks A4, A5, A6 and the proto-personas.

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
Checks A2 and A3. Uses the concept screens on the discovery canvas (Play mode), on a phone, with 3–5 people.

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

After the trip, run a retrospective and rank the "After the MVP" list in the [roadmap](../roadmap.md).

## Schedule
| When | What |
|---|---|
| Now | Search check with real lists |
| During Slices 2.5–3 | Friend interviews |
| Before Slice 3 and before Slice 6 | Click-through test |
| On the trip | Daily log |
