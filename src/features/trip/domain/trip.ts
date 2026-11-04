import { isIsoDate } from "./countTripDays";

export const TRIP_TEXT_MAX_LENGTH = 80;

/** What a visitor fills in to plan a trip. Dates are ISO YYYY-MM-DD strings. */
export type TripDraft = {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
};

export type Trip = TripDraft & {
  id: string;
  /** ISO timestamp of when the trip was created. */
  createdAt: string;
};

export type TripField = keyof TripDraft;
export type TripValidationErrors = Partial<Record<TripField, string>>;

export type CreateTripResult =
  | { ok: true; trip: Trip }
  | { ok: false; errors: TripValidationErrors };

function validateText(value: string, blankMessage: string): string | undefined {
  if (value.length === 0) return blankMessage;
  if (value.length > TRIP_TEXT_MAX_LENGTH) {
    return `Use ${TRIP_TEXT_MAX_LENGTH} characters or fewer`;
  }
  return undefined;
}

function validateDates(startDate: string, endDate: string): TripValidationErrors {
  const errors: TripValidationErrors = {};
  if (!isIsoDate(startDate)) errors.startDate = "Enter a start date";
  if (!isIsoDate(endDate)) errors.endDate = "Enter an end date";
  // ISO dates of equal length sort the same way as strings and as calendar days.
  if (!errors.startDate && !errors.endDate && endDate < startDate) {
    errors.endDate = "End date must be on or after the start date";
  }
  return errors;
}

function withoutEmpty(errors: TripValidationErrors): TripValidationErrors {
  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message !== undefined),
  );
}

export function createTrip(draft: TripDraft, id: string, createdAt: string): CreateTripResult {
  const name = draft.name.trim();
  const destination = draft.destination.trim();

  const errors = withoutEmpty({
    name: validateText(name, "Enter a trip name"),
    destination: validateText(destination, "Enter a destination"),
    ...validateDates(draft.startDate, draft.endDate),
  });

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return {
    ok: true,
    trip: { id, name, destination, startDate: draft.startDate, endDate: draft.endDate, createdAt },
  };
}

/** Soonest trip first. Trips starting on the same day keep the order they were created in. */
export function sortTripsByStartDate(trips: readonly Trip[]): Trip[] {
  return [...trips].sort(
    (a, b) => a.startDate.localeCompare(b.startDate) || a.createdAt.localeCompare(b.createdAt),
  );
}
