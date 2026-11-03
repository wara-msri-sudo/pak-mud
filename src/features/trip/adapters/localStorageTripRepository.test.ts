import { beforeEach, describe, expect, it } from "vitest";
import { TripStorageError } from "../application/tripRepository";
import type { Trip } from "../domain/trip";
import {
  LocalStorageTripRepository,
  TRIPS_SCHEMA_VERSION,
  TRIPS_STORAGE_KEY,
} from "./localStorageTripRepository";

const trip: Trip = {
  id: "trip-1",
  name: "Northern loop",
  destination: "Chiang Mai",
  startDate: "2026-12-01",
  endDate: "2026-12-05",
  createdAt: "2026-11-03T08:00:00.000Z",
};

function repositoryOnJsdomStorage() {
  return new LocalStorageTripRepository(() => window.localStorage);
}

async function expectStorageError(promise: Promise<unknown>, problem: string) {
  const error = await promise.then(
    () => undefined,
    (reason: unknown) => reason,
  );
  expect(error).toBeInstanceOf(TripStorageError);
  expect((error as TripStorageError).problem).toBe(problem);
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("LocalStorageTripRepository", () => {
  it("lists no trips when nothing is stored", async () => {
    expect(await repositoryOnJsdomStorage().list()).toEqual([]);
  });

  it("stores trips under one versioned key", async () => {
    await repositoryOnJsdomStorage().save(trip);

    const stored = JSON.parse(window.localStorage.getItem(TRIPS_STORAGE_KEY) ?? "null");
    expect(stored).toEqual({ schemaVersion: TRIPS_SCHEMA_VERSION, trips: [trip] });
  });

  it("reads saved trips back in a new repository instance", async () => {
    await repositoryOnJsdomStorage().save(trip);
    await repositoryOnJsdomStorage().save({ ...trip, id: "trip-2" });

    const trips = await repositoryOnJsdomStorage().list();

    expect(trips.map((saved) => saved.id)).toEqual(["trip-1", "trip-2"]);
  });

  it("replaces a trip saved again with the same id", async () => {
    const repository = repositoryOnJsdomStorage();
    await repository.save(trip);

    await repository.save({ ...trip, name: "Renamed" });

    expect(await repository.list()).toEqual([{ ...trip, name: "Renamed" }]);
  });

  it.each([
    ["text that is not JSON", "{not json"],
    ["an unknown schema version", JSON.stringify({ schemaVersion: 99, trips: [] })],
    ["trips that are not a list", JSON.stringify({ schemaVersion: 1, trips: {} })],
    [
      "a trip with a missing field",
      JSON.stringify({ schemaVersion: 1, trips: [{ ...trip, destination: undefined }] }),
    ],
  ])("reports corrupt data when storage holds %s", async (_label, raw) => {
    window.localStorage.setItem(TRIPS_STORAGE_KEY, raw);

    await expectStorageError(repositoryOnJsdomStorage().list(), "corrupt");
  });

  it("refuses to overwrite corrupt data when saving", async () => {
    window.localStorage.setItem(TRIPS_STORAGE_KEY, "{not json");

    await expectStorageError(repositoryOnJsdomStorage().save(trip), "corrupt");
    expect(window.localStorage.getItem(TRIPS_STORAGE_KEY)).toBe("{not json");
  });

  it("reports unavailable storage when the browser blocks access", async () => {
    const blocked = new LocalStorageTripRepository(() => {
      throw new DOMException("Access denied", "SecurityError");
    });

    await expectStorageError(blocked.list(), "unavailable");
    await expectStorageError(blocked.save(trip), "unavailable");
  });

  it("reports unavailable storage when a write fails", async () => {
    const full = new LocalStorageTripRepository(() => ({
      ...window.localStorage,
      getItem: () => null,
      setItem: () => {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      },
    }) as Storage);

    await expectStorageError(full.save(trip), "unavailable");
  });
});
