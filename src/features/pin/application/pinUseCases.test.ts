import { describe, expect, it } from "vitest";
import { InMemoryPinRepository } from "../adapters/inMemoryPinRepository";
import type { Place } from "../domain/place";
import { PlaceSearchError, type PlaceSearch } from "./placeSearch";
import { addPin, listPins, searchPlaces, SEARCH_MIN_LENGTH } from "./pinUseCases";

const watPho: Place = { placeId: "way/1", name: "Wat Pho", area: "Phra Nakhon, Bangkok", lat: 13.7, lon: 100.5 };
const draft = { category: "temple", cost: "300", openingHours: "", note: "" };
let tick = 0;
const clock = { generateId: () => `pin-${++tick}`, now: () => `2026-11-03T08:00:0${tick}.000Z` };

function searchReturning(places: Place[]): PlaceSearch & { queries: string[] } {
  const queries: string[] = [];
  return {
    queries,
    search: async (query) => {
      queries.push(query);
      return places;
    },
  };
}

describe("addPin", () => {
  it("saves a valid pin to the trip", async () => {
    const repository = new InMemoryPinRepository();

    const result = await addPin(repository, "trip-1", watPho, draft, clock);

    expect(result.ok).toBe(true);
    expect(await repository.listByTrip("trip-1")).toHaveLength(1);
  });

  it("saves nothing when the draft is invalid", async () => {
    const repository = new InMemoryPinRepository();

    const result = await addPin(repository, "trip-1", watPho, { ...draft, cost: "abc" }, clock);

    expect(result.ok).toBe(false);
    expect(await repository.listByTrip("trip-1")).toEqual([]);
  });
});

describe("listPins", () => {
  it("returns only the trip's pins, oldest first", async () => {
    const repository = new InMemoryPinRepository();
    await addPin(repository, "trip-1", watPho, draft, clock);
    await addPin(repository, "trip-2", watPho, draft, clock);
    await addPin(repository, "trip-1", { ...watPho, placeId: "way/2", name: "Wat Arun" }, draft, clock);

    const pins = await listPins(repository, "trip-1");

    expect(pins.map((pin) => pin.name)).toEqual(["Wat Pho", "Wat Arun"]);
  });
});

describe("searchPlaces", () => {
  it("trims the query before searching", async () => {
    const search = searchReturning([watPho]);

    expect(await searchPlaces(search, "  wat pho ")).toEqual([watPho]);
    expect(search.queries).toEqual(["wat pho"]);
  });

  it(`does not search for fewer than ${SEARCH_MIN_LENGTH} characters`, async () => {
    const search = searchReturning([watPho]);

    await expect(searchPlaces(search, " w ")).rejects.toThrow(PlaceSearchError);
    expect(search.queries).toEqual([]);
  });
});
