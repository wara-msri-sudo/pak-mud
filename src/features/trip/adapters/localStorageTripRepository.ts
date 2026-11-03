import { TripStorageError, type TripRepository } from "../application/tripRepository";
import type { Trip } from "../domain/trip";

/** Stored shape, decision 0004: { schemaVersion: 1, trips: Trip[] } under one key. */
export const TRIPS_STORAGE_KEY = "pak-mud:trips";
export const TRIPS_SCHEMA_VERSION = 1;

type StoredTrips = { schemaVersion: typeof TRIPS_SCHEMA_VERSION; trips: Trip[] };

const TRIP_STRING_FIELDS = ["id", "name", "destination", "startDate", "endDate", "createdAt"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTrip(value: unknown): value is Trip {
  return isRecord(value) && TRIP_STRING_FIELDS.every((field) => typeof value[field] === "string");
}

function parseStoredTrips(raw: string): Trip[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (cause) {
    throw new TripStorageError("corrupt", { cause });
  }
  if (
    !isRecord(parsed) ||
    parsed.schemaVersion !== TRIPS_SCHEMA_VERSION ||
    !Array.isArray(parsed.trips) ||
    !parsed.trips.every(isTrip)
  ) {
    throw new TripStorageError("corrupt");
  }
  return parsed.trips;
}

/**
 * Keeps trips in the browser's localStorage.
 * Reads never overwrite data they cannot understand, so a corrupt value is left for recovery.
 */
export class LocalStorageTripRepository implements TripRepository {
  constructor(private readonly getStorage: () => Storage) {}

  async list(): Promise<Trip[]> {
    return this.readTrips();
  }

  async save(trip: Trip): Promise<void> {
    const others = this.readTrips().filter((existing) => existing.id !== trip.id);
    const stored: StoredTrips = { schemaVersion: TRIPS_SCHEMA_VERSION, trips: [...others, trip] };
    try {
      this.getStorage().setItem(TRIPS_STORAGE_KEY, JSON.stringify(stored));
    } catch (cause) {
      throw new TripStorageError("unavailable", { cause });
    }
  }

  private readTrips(): Trip[] {
    let raw: string | null;
    try {
      raw = this.getStorage().getItem(TRIPS_STORAGE_KEY);
    } catch (cause) {
      throw new TripStorageError("unavailable", { cause });
    }
    return raw === null ? [] : parseStoredTrips(raw);
  }
}
