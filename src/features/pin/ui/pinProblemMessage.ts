import { PinStorageError } from "../application/pinRepository";
import { PlaceSearchError } from "../application/placeSearch";
import { SEARCH_MIN_LENGTH } from "../application/pinUseCases";

/** Turns a pin storage or search failure into a sentence a visitor can act on. */
export function pinProblemMessage(error: unknown): string {
  if (error instanceof PlaceSearchError) {
    if (error.problem === "too-short") return `Type at least ${SEARCH_MIN_LENGTH} characters to search.`;
    if (error.problem === "bad-response") return "Search sent back something we couldn't read. Try again in a moment.";
    return "Search isn't available right now. Check your connection and try again in a moment.";
  }
  if (error instanceof PinStorageError) {
    return error.problem === "corrupt"
      ? "We couldn't read your saved pins. They are left as they are, and new pins can't be saved until this is fixed."
      : "Your browser is blocking storage, so pins can't be saved on this device.";
  }
  return "Something went wrong. Please try again.";
}
