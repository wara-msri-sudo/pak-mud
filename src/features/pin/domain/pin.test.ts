import { describe, expect, it } from "vitest";
import type { Place } from "./place";
import { createPin, PIN_CATEGORIES, PIN_NOTE_MAX_LENGTH, PIN_HOURS_MAX_LENGTH, type PinDraft } from "./pin";

const place: Place = { placeId: "way/123", name: "Wat Pho", area: "Phra Nakhon, Bangkok", lat: 13.7465, lon: 100.4927 };
const draft: PinDraft = { category: "temple", cost: "300", openingHours: " 08:00–18:30 ", note: " Wear long trousers " };
const ids = { id: "pin-1", tripId: "trip-1", createdAt: "2026-11-03T08:00:00.000Z" };

describe("createPin", () => {
  it("creates a pin from a place and a valid draft", () => {
    expect(createPin(place, draft, ids)).toEqual({
      ok: true,
      pin: {
        ...ids,
        placeId: "way/123",
        name: "Wat Pho",
        area: "Phra Nakhon, Bangkok",
        lat: 13.7465,
        lon: 100.4927,
        category: "temple",
        costThb: 300,
        openingHours: "08:00–18:30",
        note: "Wear long trousers",
      },
    });
  });

  it("treats an empty cost as free", () => {
    const result = createPin(place, { ...draft, cost: "  " }, ids);

    expect(result.ok && result.pin.costThb).toBe(0);
  });

  it("accepts a cost written with a thousands separator", () => {
    const result = createPin(place, { ...draft, cost: "1,200" }, ids);

    expect(result.ok && result.pin.costThb).toBe(1200);
  });

  it.each(["abc", "-50", "12.5", "1e3"])("rejects the cost %j", (cost) => {
    expect(createPin(place, { ...draft, cost }, ids)).toEqual({
      ok: false,
      errors: { cost: "Enter the cost in whole baht, for example 300, or leave it empty if free" },
    });
  });

  it("requires a known category", () => {
    expect(createPin(place, { ...draft, category: "" }, ids)).toEqual({
      ok: false,
      errors: { category: "Choose a category" },
    });
  });

  it("limits opening hours and note length", () => {
    const result = createPin(
      place,
      { ...draft, openingHours: "a".repeat(PIN_HOURS_MAX_LENGTH + 1), note: "a".repeat(PIN_NOTE_MAX_LENGTH + 1) },
      ids,
    );

    expect(result).toEqual({
      ok: false,
      errors: {
        openingHours: `Use ${PIN_HOURS_MAX_LENGTH} characters or fewer`,
        note: `Use ${PIN_NOTE_MAX_LENGTH} characters or fewer`,
      },
    });
  });

  it("offers the six categories from the design", () => {
    expect(PIN_CATEGORIES.map((category) => category.id)).toEqual([
      "food",
      "temple",
      "nature",
      "shopping",
      "nightlife",
      "stay",
    ]);
  });
});
