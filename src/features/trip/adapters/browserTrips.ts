import type { TripClock } from "../application/tripUseCases";
import { generateTripId } from "./generateTripId";
import { LocalStorageTripRepository } from "./localStorageTripRepository";

/** The app's real trip storage. Touches window only when a method runs, so it is safe to import on the server. */
export const browserTripRepository = new LocalStorageTripRepository(() => window.localStorage);

export const browserTripClock: TripClock = {
  generateId: () => generateTripId(),
  now: () => new Date().toISOString(),
};
