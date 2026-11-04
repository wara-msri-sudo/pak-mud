import {
  createTrip,
  sortTripsByStartDate,
  type CreateTripResult,
  type Trip,
  type TripDraft,
} from "../domain/trip";
import type { TripRepository } from "./tripRepository";

export type TripClock = {
  generateId: () => string;
  /** Current time as an ISO timestamp. */
  now: () => string;
};

export async function addTrip(
  repository: TripRepository,
  draft: TripDraft,
  clock: TripClock,
): Promise<CreateTripResult> {
  const result = createTrip(draft, clock.generateId(), clock.now());
  if (result.ok) {
    await repository.save(result.trip);
  }
  return result;
}

export async function listTrips(repository: TripRepository): Promise<Trip[]> {
  return sortTripsByStartDate(await repository.list());
}
