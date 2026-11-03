import { beforeEach, describe, expect, it } from "vitest";
import { TRIPS_STORAGE_KEY } from "@/features/trip/adapters/localStorageTripRepository";
import { PinStorageError } from "../application/pinRepository";
import type { Pin } from "../domain/pin";
import { LocalStoragePinRepository, PINS_SCHEMA_VERSION, PINS_STORAGE_KEY } from "./localStoragePinRepository";

const pin: Pin = {
  id: "pin-1",
  tripId: "trip-1",
  placeId: "way/1",
  name: "Wat Pho",
  area: "Phra Nakhon, Bangkok",
  lat: 13.7465,
  lon: 100.4927,
  category: "temple",
  costThb: 300,
  openingHours: "08:00–18:30",
  note: "",
  createdAt: "2026-11-03T08:00:00.000Z",
};

const repository = () => new LocalStoragePinRepository(() => window.localStorage);

async function problemOf(promise: Promise<unknown>) {
  const error = await promise.then(() => undefined, (reason: unknown) => reason);
  expect(error).toBeInstanceOf(PinStorageError);
  return (error as PinStorageError).problem;
}

beforeEach(() => window.localStorage.clear());

describe("LocalStoragePinRepository", () => {
  it("stores pins under their own versioned key", async () => {
    await repository().save(pin);

    expect(JSON.parse(window.localStorage.getItem(PINS_STORAGE_KEY) ?? "null")).toEqual({
      schemaVersion: PINS_SCHEMA_VERSION,
      pins: [pin],
    });
  });

  it("leaves the trips key untouched", async () => {
    const trips = JSON.stringify({ schemaVersion: 1, trips: [] });
    window.localStorage.setItem(TRIPS_STORAGE_KEY, trips);

    await repository().save(pin);

    expect(window.localStorage.getItem(TRIPS_STORAGE_KEY)).toBe(trips);
  });

  it("lists only the pins of the asked trip, across instances", async () => {
    await repository().save(pin);
    await repository().save({ ...pin, id: "pin-2", tripId: "trip-2" });

    expect((await repository().listByTrip("trip-1")).map((saved) => saved.id)).toEqual(["pin-1"]);
  });

  it.each([
    ["text that is not JSON", "{oops"],
    ["an unknown schema version", JSON.stringify({ schemaVersion: 2, pins: [] })],
    ["a pin with a text cost", JSON.stringify({ schemaVersion: 1, pins: [{ ...pin, costThb: "300" }] })],
    ["a pin with an unknown category", JSON.stringify({ schemaVersion: 1, pins: [{ ...pin, category: "spa" }] })],
  ])("reports corrupt data when storage holds %s, and never overwrites it", async (_label, raw) => {
    window.localStorage.setItem(PINS_STORAGE_KEY, raw);

    expect(await problemOf(repository().listByTrip("trip-1"))).toBe("corrupt");
    expect(await problemOf(repository().save(pin))).toBe("corrupt");
    expect(window.localStorage.getItem(PINS_STORAGE_KEY)).toBe(raw);
  });

  it("reports blocked storage", async () => {
    const blocked = new LocalStoragePinRepository(() => {
      throw new DOMException("denied", "SecurityError");
    });

    expect(await problemOf(blocked.listByTrip("trip-1"))).toBe("unavailable");
  });
});
