import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InMemoryTripRepository } from "../adapters/inMemoryTripRepository";
import { TripStorageError, type TripRepository } from "../application/tripRepository";
import { TripForm } from "./TripForm";

const clock = { generateId: () => "trip-1", now: () => "2026-11-03T08:00:00.000Z" };

function fillForm(values: { name: string; destination: string; startDate: string; endDate: string }) {
  fireEvent.change(screen.getByLabelText("Trip name"), { target: { value: values.name } });
  fireEvent.change(screen.getByLabelText("Destination"), { target: { value: values.destination } });
  fireEvent.change(screen.getByLabelText("Start date"), { target: { value: values.startDate } });
  fireEvent.change(screen.getByLabelText("End date"), { target: { value: values.endDate } });
}

function submit() {
  fireEvent.click(screen.getByRole("button", { name: "Create trip" }));
}

describe("TripForm", () => {
  it("saves a valid trip and reports it", async () => {
    const repository = new InMemoryTripRepository();
    const onCreated = vi.fn();
    render(<TripForm repository={repository} clock={clock} onCreated={onCreated} />);

    fillForm({ name: "Northern loop", destination: "Chiang Mai", startDate: "01/12/2026", endDate: "05/12/2026" });
    submit();

    await vi.waitFor(() => expect(onCreated).toHaveBeenCalledOnce());
    expect(await repository.list()).toEqual([
      {
        id: "trip-1",
        name: "Northern loop",
        destination: "Chiang Mai",
        startDate: "2026-12-01",
        endDate: "2026-12-05",
        createdAt: "2026-11-03T08:00:00.000Z",
      },
    ]);
  });

  it("shows an error next to each invalid field and saves nothing", async () => {
    const repository = new InMemoryTripRepository();
    const onCreated = vi.fn();
    render(<TripForm repository={repository} clock={clock} onCreated={onCreated} />);

    fillForm({ name: " ", destination: "", startDate: "05/12/2026", endDate: "01/12/2026" });
    submit();

    expect(await screen.findByText("Enter a trip name")).toBeInTheDocument();
    expect(screen.getByLabelText("Trip name")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Trip name")).toHaveAccessibleDescription("Enter a trip name");
    expect(screen.getByLabelText("Destination")).toHaveAccessibleDescription("Enter a destination");
    expect(screen.getByLabelText("End date")).toHaveAccessibleDescription(
      "End date must be on or after the start date",
    );
    expect(screen.getByLabelText("Start date")).not.toHaveAttribute("aria-invalid");
    expect(await repository.list()).toEqual([]);
    expect(onCreated).not.toHaveBeenCalled();
  });

  it("explains when the trip cannot be saved", async () => {
    const repository: TripRepository = {
      list: async () => [],
      save: () => Promise.reject(new TripStorageError("unavailable")),
    };
    const onCreated = vi.fn();
    render(<TripForm repository={repository} clock={clock} onCreated={onCreated} />);

    fillForm({ name: "Northern loop", destination: "Chiang Mai", startDate: "01/12/2026", endDate: "05/12/2026" });
    submit();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Your browser is blocking storage, so trips can't be saved on this device.",
    );
    expect(onCreated).not.toHaveBeenCalled();
  });
});
