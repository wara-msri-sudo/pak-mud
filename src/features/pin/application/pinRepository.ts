import type { StorageProblem } from "@/shared/adapters/versionedLocalStorage";
import type { Pin } from "../domain/pin";

/** Port for storing pins (decision 0006). */
export interface PinRepository {
  listByTrip(tripId: string): Promise<Pin[]>;
  save(pin: Pin): Promise<void>;
}

export class PinStorageError extends Error {
  constructor(
    readonly problem: StorageProblem,
    options?: { cause?: unknown },
  ) {
    super(problem === "unavailable" ? "Pin storage is not available" : "Saved pins could not be read", options);
    this.name = "PinStorageError";
  }
}
