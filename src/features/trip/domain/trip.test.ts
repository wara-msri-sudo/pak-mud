import { describe, expect, it } from "vitest";
import {
  createTrip,
  sortTripsByStartDate,
  TRIP_TEXT_MAX_LENGTH,
  type Trip,
  type TripDraft,
} from "./trip";

const ID = "trip-1";
const CREATED_AT = "2026-11-03T08:00:00.000Z";

const validDraft: TripDraft = {
  name: "Northern loop",
  destination: "Chiang Mai",
  startDate: "2026-12-01",
  endDate: "2026-12-05",
};

function tripStarting(startDate: string, id: string): Trip {
  return { ...validDraft, id, startDate, endDate: startDate, createdAt: CREATED_AT };
}

describe("createTrip", () => {
  it("creates a trip from a valid draft", () => {
    const result = createTrip(validDraft, ID, CREATED_AT);

    expect(result).toEqual({
      ok: true,
      trip: { ...validDraft, id: ID, createdAt: CREATED_AT },
    });
  });

  it("trims the name and destination", () => {
    const result = createTrip(
      { ...validDraft, name: "  Northern loop ", destination: " Chiang Mai  " },
      ID,
      CREATED_AT,
    );

    expect(result.ok && result.trip.name).toBe("Northern loop");
    expect(result.ok && result.trip.destination).toBe("Chiang Mai");
  });

  it("accepts a one-day trip", () => {
    const result = createTrip({ ...validDraft, endDate: validDraft.startDate }, ID, CREATED_AT);

    expect(result.ok).toBe(true);
  });

  it("requires a name and destination that are not blank", () => {
    const result = createTrip({ ...validDraft, name: "   ", destination: "" }, ID, CREATED_AT);

    expect(result).toEqual({
      ok: false,
      errors: {
        name: "Enter a trip name",
        destination: "Enter a destination",
      },
    });
  });

  it("limits the name and destination length", () => {
    const tooLong = "a".repeat(TRIP_TEXT_MAX_LENGTH + 1);

    const result = createTrip({ ...validDraft, name: tooLong, destination: tooLong }, ID, CREATED_AT);

    expect(result).toEqual({
      ok: false,
      errors: {
        name: `Use ${TRIP_TEXT_MAX_LENGTH} characters or fewer`,
        destination: `Use ${TRIP_TEXT_MAX_LENGTH} characters or fewer`,
      },
    });
  });

  it("requires valid start and end dates", () => {
    const result = createTrip({ ...validDraft, startDate: "", endDate: "2026-02-30" }, ID, CREATED_AT);

    expect(result).toEqual({
      ok: false,
      errors: {
        startDate: "Enter a start date",
        endDate: "Enter an end date",
      },
    });
  });

  it("rejects an end date before the start date", () => {
    const result = createTrip({ ...validDraft, endDate: "2026-11-30" }, ID, CREATED_AT);

    expect(result).toEqual({
      ok: false,
      errors: { endDate: "End date must be on or after the start date" },
    });
  });
});

describe("sortTripsByStartDate", () => {
  it("puts the soonest trip first without changing the input", () => {
    const later = tripStarting("2027-01-10", "later");
    const sooner = tripStarting("2026-12-01", "sooner");
    const trips = [later, sooner];

    const sorted = sortTripsByStartDate(trips);

    expect(sorted.map((trip) => trip.id)).toEqual(["sooner", "later"]);
    expect(trips.map((trip) => trip.id)).toEqual(["later", "sooner"]);
  });
});
