import type { TripClock } from "../application/tripUseCases";
import { generateId } from "@/shared/adapters/generateId";
import { LocalStorageTripRepository } from "./localStorageTripRepository";

/** The app's real trip storage. Touches window only when a method runs, so it is safe to import on the server. */
export const browserTripRepository = new LocalStorageTripRepository(() => window.localStorage);

export const browserTripClock: TripClock = {
  generateId: () => generateId(),
  now: () => new Date().toISOString(),
};
