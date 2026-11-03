import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InMemoryTripRepository } from "../adapters/inMemoryTripRepository";
import { TripStorageError, type TripRepository } from "../application/tripRepository";
import type { Trip } from "../domain/trip";
import { TripList } from "./TripList";

function makeTrip(overrides: Partial<Trip>): Trip {
  return {
    id: "trip-1",
    name: "Northern loop",
    destination: "Chiang Mai",
    startDate: "2026-12-01",
    endDate: "2026-12-05",
    createdAt: "2026-11-03T08:00:00.000Z",
    ...overrides,
  };
}

function failingRepository(problem: "corrupt" | "unavailable"): TripRepository {
  return {
    list: () => Promise.reject(new TripStorageError(problem)),
    save: () => Promise.reject(new TripStorageError(problem)),
  };
}

describe("TripList", () => {
  it("shows an empty state that links to the new-trip form", async () => {
    render(<TripList repository={new InMemoryTripRepository()} />);

    const createLink = await screen.findByRole("link", { name: "Create your first trip" });
    expect(createLink).toHaveAttribute("href", "/trips/new");
  });

  it("lists trips soonest first with destination, dates and day count", async () => {
    const repository = new InMemoryTripRepository([
      makeTrip({ id: "later", name: "Islands", destination: "Krabi", startDate: "2027-01-10", endDate: "2027-01-14" }),
      makeTrip({ id: "sooner" }),
    ]);

    render(<TripList repository={repository} />);

    const items = await screen.findAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Northern loopChiang Mai01/12/2026 – 05/12/2026 · 5 days",
      "IslandsKrabi10/01/2027 – 14/01/2027 · 5 days",
    ]);
    // The "New trip" action lives on the page header band, not in the list.
    expect(screen.queryByRole("link", { name: "New trip" })).not.toBeInTheDocument();
  });

  it("explains when saved trips cannot be read", async () => {
    render(<TripList repository={failingRepository("corrupt")} />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We couldn't read your saved trips.",
    );
  });

  it("explains when the browser blocks storage", async () => {
    render(<TripList repository={failingRepository("unavailable")} />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Your browser is blocking storage, so trips can't be saved on this device.",
    );
  });
});
