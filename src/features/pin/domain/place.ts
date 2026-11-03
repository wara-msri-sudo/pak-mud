/** A place found by search, before it is pinned. */
export type Place = {
  /** Stable id from the search provider, for example "way/123" for OpenStreetMap. */
  placeId: string;
  name: string;
  /** Where it is, for example "Phra Nakhon, Bangkok". */
  area: string;
  lat: number;
  lon: number;
};
