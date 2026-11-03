# 0007. Place search: OpenStreetMap Nominatim

- Status: accepted
- Date: 2026-11-03
- Decided by: project owner (wara-msri-sudo)
- Refines: 0003 (which allowed Nominatim or Photon)

## Context
Slice 2 needs a place search limited to Thailand, with English names, no API key and no backend.

## Options considered
- Nominatim: the official OSM search, with a clear usage policy and a `countrycodes` filter. It forbids search-as-you-type.
- Photon (komoot): built for as-you-type search. A public server under fair use, with no guarantee and sometimes thinner results.

## Decision
Nominatim, behind the `PlaceSearch` port (`NominatimPlaceSearch`). Request:
`GET https://nominatim.openstreetmap.org/search?q=…&format=jsonv2&countrycodes=th&limit=10&accept-language=en&addressdetails=1`.
Usage policy:
- search only on an explicit button press
- at most 1 request per second
- an 8 s timeout
- the browser's Referer identifies the app
- results credit "© OpenStreetMap contributors"

## Consequences
- The browser calls Nominatim directly, so no server is needed. Heavy traffic would need our own Nominatim or a paid provider
  (swap the adapter only).
- Area text comes from the address (suburb/district/town/village/county + city/state), so some places show a broad area.
- The development container can't reach Nominatim (network policy), so e2e tests intercept it with recorded-format responses,
  and a real-service check runs once the domain is allowed.
