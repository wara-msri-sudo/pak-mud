import { createPin, type CreatePinResult, type Pin, type PinDraft } from "../domain/pin";
import type { Place } from "../domain/place";
import type { PinRepository } from "./pinRepository";
import { PlaceSearchError, type PlaceSearch } from "./placeSearch";

export const SEARCH_MIN_LENGTH = 2;

export type PinClock = {
  generateId: () => string;
  /** Current time as an ISO timestamp. */
  now: () => string;
};

export async function addPin(
  repository: PinRepository,
  tripId: string,
  place: Place,
  draft: PinDraft,
  clock: PinClock,
): Promise<CreatePinResult> {
  const result = createPin(place, draft, { id: clock.generateId(), tripId, createdAt: clock.now() });
  if (result.ok) {
    await repository.save(result.pin);
  }
  return result;
}

/** The trip's pins in the order they were added. */
export async function listPins(repository: PinRepository, tripId: string): Promise<Pin[]> {
  const pins = await repository.listByTrip(tripId);
  return [...pins].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function searchPlaces(search: PlaceSearch, query: string): Promise<Place[]> {
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_LENGTH) {
    throw new PlaceSearchError("too-short");
  }
  return search.search(trimmed);
}
