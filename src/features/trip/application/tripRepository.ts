import type { Trip } from "../domain/trip";

/** Port for storing trips. Adapters decide where trips live (decision 0002). */
export interface TripRepository {
  list(): Promise<Trip[]>;
  save(trip: Trip): Promise<void>;
}

export type TripStorageProblem = "unavailable" | "corrupt";

/** Raised by adapters when stored trips cannot be read or written. */
export class TripStorageError extends Error {
  constructor(
    readonly problem: TripStorageProblem,
    options?: { cause?: unknown },
  ) {
    super(
      problem === "unavailable"
        ? "Trip storage is not available in this browser"
        : "Saved trips could not be read",
      options,
    );
    this.name = "TripStorageError";
  }
}
