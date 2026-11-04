import { generateId } from "@/shared/adapters/generateId";
import type { PinClock } from "../application/pinUseCases";
import { LocalStoragePinRepository } from "./localStoragePinRepository";
import { NominatimPlaceSearch } from "./nominatimPlaceSearch";

/** Real pin storage. Touches window only when a method runs, so it is safe to import on the server. */
export const browserPinRepository = new LocalStoragePinRepository(() => window.localStorage);

/** One shared instance, so the one-request-per-second spacing holds across the whole page. */
export const browserPlaceSearch = new NominatimPlaceSearch();

export const browserPinClock: PinClock = {
  generateId: () => generateId(),
  now: () => new Date().toISOString(),
};
