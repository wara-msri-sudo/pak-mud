import type { Pin } from "../domain/pin";
import type { Place } from "../domain/place";

export const WAT_PHO: Place = {
  placeId: "way/1",
  name: "Wat Pho",
  area: "Phra Nakhon District, Bangkok",
  lat: 13.7465,
  lon: 100.4927,
};
export const WAT_ARUN: Place = { placeId: "way/2", name: "Wat Arun", area: "Bangkok Yai, Bangkok", lat: 13.74, lon: 100.49 };

export function makePin(overrides: Partial<Pin> = {}): Pin {
  return {
    ...WAT_PHO,
    id: "pin-1",
    tripId: "trip-1",
    category: "temple",
    costThb: 300,
    openingHours: "08:00–18:30",
    note: "Wear long trousers",
    createdAt: "2026-11-03T08:00:00.000Z",
    ...overrides,
  };
}
