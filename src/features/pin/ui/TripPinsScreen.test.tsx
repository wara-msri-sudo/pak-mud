import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InMemoryTripRepository } from "@/features/trip/adapters/inMemoryTripRepository";
import type { Trip } from "@/features/trip/domain/trip";
import { InMemoryPinRepository } from "../adapters/inMemoryPinRepository";
import { TripPinsScreen } from "./TripPinsScreen";
import { makePin, WAT_ARUN } from "./testPins";

const trip: Trip = {
  id: "trip-1",
  name: "Northern loop",
  destination: "Chiang Mai",
  startDate: "2026-12-01",
  endDate: "2026-12-05",
  createdAt: "2026-11-03T08:00:00.000Z",
};
const clock = { generateId: () => "pin-new", now: () => "2026-11-03T09:00:00.000Z" };

function renderScreen(tripId: string, pinRepository = new InMemoryPinRepository([makePin()])) {
  render(
    <TripPinsScreen
      tripId={tripId}
      tripRepository={new InMemoryTripRepository([trip])}
      pinRepository={pinRepository}
      placeSearch={{ search: async () => [WAT_ARUN] }}
      clock={clock}
    />,
  );
  return { pinRepository };
}

describe("TripPinsScreen", () => {
  it("shows the trip name, dates, a way back and the trip's pins", async () => {
    renderScreen("trip-1");

    expect(await screen.findByRole("heading", { level: 1, name: "Northern loop" })).toBeInTheDocument();
    expect(screen.getByText("01/12/2026 – 05/12/2026 · 5 days")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to trips" })).toHaveAttribute("href", "/trips");
    expect(screen.getByRole("heading", { level: 2, name: "Pins" })).toBeInTheDocument();
    expect(within(screen.getByRole("list", { name: "Pins" })).getByText("Wat Pho")).toBeInTheDocument();
  });

  it("says when the trip doesn't exist", async () => {
    renderScreen("missing");

    expect(await screen.findByRole("heading", { level: 1, name: "Trip not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to your trips" })).toHaveAttribute("href", "/trips");
  });

  it("adds a pinned place to the list and marks the result as Pinned", async () => {
    const { pinRepository } = renderScreen("trip-1");
    await screen.findByRole("heading", { level: 1, name: "Northern loop" });

    fireEvent.change(screen.getByLabelText("Search places in Thailand"), { target: { value: "wat arun" } });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    fireEvent.click(await screen.findByRole("button", { name: "Pin Wat Arun" }));
    fireEvent.click(screen.getByRole("radio", { name: "Temple" }));
    fireEvent.click(screen.getByRole("button", { name: "Save pin" }));

    expect(await within(screen.getByRole("list", { name: "Pins" })).findByText("Wat Arun")).toBeInTheDocument();
    expect(within(screen.getByRole("list", { name: "Search results" })).getByText("Pinned")).toBeInTheDocument();
    expect(await pinRepository.listByTrip("trip-1")).toHaveLength(2);
  });
});
