# 0003. Maps and place search: OpenStreetMap

- Status: accepted
- Date: 2026-11-03
- Decided by: project owner (wara-msri-sudo)

## Context
Pinning places needs a map and place search.

## Options considered
- OpenStreetMap (Leaflet + Nominatim/Photon): free, no API key. Place data is thinner, with no photos or ratings.
- Google Maps/Places: best data, photos and hours. Needs an API key and billing, and costs money at scale.
- Mapbox: good-looking maps and a free tier. Needs an API key, and its place search is weaker.

## Decision
OpenStreetMap: Leaflet for the map, and Nominatim or Photon for search. Search sits behind a `PlaceSearch`
port, so another provider can replace it later.

## Consequences
- We follow the Nominatim usage policy: at most 1 request per second, a debounced search, an
  identifying app name, and attribution on the map.
- Leaflet is added in Slice 4 (dependency approval at that slice's gate).
- Routing (OSRM vs straight-line) stays open and is decided at the Slice 4 design gate.
