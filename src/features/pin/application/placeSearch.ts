import type { Place } from "../domain/place";

/** Port for finding places by name (decision 0007). */
export interface PlaceSearch {
  search(query: string): Promise<Place[]>;
}

export type PlaceSearchProblem = "too-short" | "unavailable" | "bad-response";

export class PlaceSearchError extends Error {
  constructor(
    readonly problem: PlaceSearchProblem,
    options?: { cause?: unknown },
  ) {
    super(`Place search failed: ${problem}`, options);
    this.name = "PlaceSearchError";
  }
}
