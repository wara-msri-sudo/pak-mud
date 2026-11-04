import { describe, expect, it } from "vitest";
import { InMemoryTripRepository } from "../adapters/inMemoryTripRepository";
import type { TripDraft } from "../domain/trip";
import { addTrip, listTrips } from "./tripUseCases";

const draft: TripDraft = {
  name: "Islands",
  destination: "Krabi",
  startDate: "2027-01-10",
  endDate: "2027-01-14",
};

const fixedClock = {
  generateId: () => "trip-1",
  now: () => "2026-11-03T08:00:00.000Z",
};

describe("addTrip", () => {
  it("saves a valid trip and returns it", async () => {
    const repository = new InMemoryTripRepository();

    const result = await addTrip(repository, draft, fixedClock);

    expect(result).toEqual({
      ok: true,
      trip: { ...draft, id: "trip-1", createdAt: "2026-11-03T08:00:00.000Z" },
    });
    expect(await repository.list()).toHaveLength(1);
  });

  it("saves nothing when the draft is invalid", async () => {
    const repository = new InMemoryTripRepository();

    const result = await addTrip(repository, { ...draft, name: "" }, fixedClock);

    expect(result.ok).toBe(false);
    expect(await repository.list()).toEqual([]);
  });
});

describe("listTrips", () => {
  it("returns trips soonest first", async () => {
    const repository = new InMemoryTripRepository();
    let nextId = 0;
    const clock = { generateId: () => `trip-${++nextId}`, now: fixedClock.now };
    await addTrip(repository, draft, clock);
    await addTrip(repository, { ...draft, startDate: "2026-12-01", endDate: "2026-12-02" }, clock);

    const trips = await listTrips(repository);

    expect(trips.map((trip) => trip.id)).toEqual(["trip-2", "trip-1"]);
  });
});
