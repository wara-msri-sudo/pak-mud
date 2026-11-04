import { TripStorageError } from "../application/tripRepository";

/** Turns a storage failure into a sentence a visitor can act on. */
export function storageProblemMessage(error: unknown): string {
  if (!(error instanceof TripStorageError)) {
    return "Something went wrong. Please try again.";
  }
  if (error.problem === "corrupt") {
    return "We couldn't read your saved trips. They are left as they are, and new trips can't be saved until this is fixed.";
  }
  return "Your browser is blocking storage, so trips can't be saved on this device.";
}
