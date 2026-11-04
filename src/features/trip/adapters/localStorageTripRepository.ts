import { hasStringFields, VersionedLocalStorageList } from "@/shared/adapters/versionedLocalStorage";
import { TripStorageError, type TripRepository } from "../application/tripRepository";
import type { Trip } from "../domain/trip";

/** Stored shape, decision 0004: { schemaVersion: 1, trips: Trip[] } under one key. */
export const TRIPS_STORAGE_KEY = "pak-mud:trips";
export const TRIPS_SCHEMA_VERSION = 1;

const TRIP_STRING_FIELDS = ["id", "name", "destination", "startDate", "endDate", "createdAt"] as const;

function isTrip(value: unknown): value is Trip {
  return hasStringFields(value, TRIP_STRING_FIELDS);
}

/** Keeps trips in the browser's localStorage. */
export class LocalStorageTripRepository implements TripRepository {
  private readonly store: VersionedLocalStorageList<Trip>;

  constructor(getStorage: () => Storage) {
    this.store = new VersionedLocalStorageList({
      getStorage,
      key: TRIPS_STORAGE_KEY,
      schemaVersion: TRIPS_SCHEMA_VERSION,
      listField: "trips",
      isItem: isTrip,
      toError: (problem, cause) => new TripStorageError(problem, { cause }),
    });
  }

  async list(): Promise<Trip[]> {
    return this.store.read();
  }

  async save(trip: Trip): Promise<void> {
    const others = this.store.read().filter((existing) => existing.id !== trip.id);
    this.store.write([...others, trip]);
  }
}
