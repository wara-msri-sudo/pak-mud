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
      "End date must be on or after the start date Format: dd/mm/yyyy",
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

  it.each([
    ["month first", "12/31/2026"],
    ["an impossible day", "31/02/2027"],
    ["an ISO date", "2026-12-01"],
  ])("asks for dd/mm/yyyy when a date is typed as %s, and saves nothing", async (_label, typed) => {
    const repository = new InMemoryTripRepository();
    const onCreated = vi.fn();
    render(<TripForm repository={repository} clock={clock} onCreated={onCreated} />);

    fillForm({ name: "Northern loop", destination: "Chiang Mai", startDate: "01/12/2026", endDate: typed });
    submit();

    expect(await screen.findByText("Enter the date as dd/mm/yyyy, for example 01/12/2026")).toBeInTheDocument();
    expect(screen.getByLabelText("End date")).toHaveAttribute("aria-invalid", "true");
    expect(await repository.list()).toEqual([]);
    expect(onCreated).not.toHaveBeenCalled();
  });

  it("still says a date is missing when the field is empty", async () => {
    render(<TripForm repository={new InMemoryTripRepository()} clock={clock} onCreated={vi.fn()} />);

    fillForm({ name: "Northern loop", destination: "Chiang Mai", startDate: "", endDate: "05/12/2026" });
    submit();

    expect(await screen.findByText("Enter a start date")).toBeInTheDocument();
  });

  it("clears old field errors when a later save fails", async () => {
    const repository: TripRepository = {
      list: async () => [],
      save: () => Promise.reject(new TripStorageError("unavailable")),
    };
    render(<TripForm repository={repository} clock={clock} onCreated={vi.fn()} />);
    fillForm({ name: "", destination: "Chiang Mai", startDate: "01/12/2026", endDate: "05/12/2026" });
    submit();
    await screen.findByText("Enter a trip name");

    fireEvent.change(screen.getByLabelText("Trip name"), { target: { value: "Northern loop" } });
    submit();

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("Enter a trip name")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Trip name")).not.toHaveAttribute("aria-invalid");
  });
});
