# 0004. Trips with several destinations

- Status: accepted
- Date: 2026-11-04
- Decided by: project owner (wara-msri-sudo)

## Context
In the discovery interview ([mvp-brief](../product/mvp-brief.md)) the owner said a typical trip lasts about two weeks
and covers several cities, for example Bangkok, then Chiang Mai, then an island. The glossary said a trip has one destination.

## Options considered
- Each destination has its own dates: a trip is an ordered list of destinations, each with a city and a date range.
  Each day belongs to one destination, so the day plan, search and map know which city they are in.
  There is more to store and validate (order, gaps, overlaps).
- A list of cities with one date range for the trip: simple, but days are not tied to a city, so the day view and search
  can't focus on the right place.
- Pins grouped by city only: the simplest option, but it does not help to plan days.
- One city per trip (keep as is): simple, but a two-week tour becomes several trips, and its budget and spending are split across them.

## Decision
Each destination has its own dates. A trip is an ordered list of destinations. A day belongs to the destination whose
dates include it.

## Consequences
- Glossary updated: Trip, Destination, Day.
- Slice 1 builds trips with destinations. Its design gate decides the stored shape with the owner's approval:
  schema version, rules for gaps and overlaps, and travel days between cities.
- Place search can focus on the current destination (Slice 2). Budget and spending can be shown per destination (Slices 5–6).
- `countTripDays` still applies to the whole trip, from the first destination's start date to the last destination's end date.
