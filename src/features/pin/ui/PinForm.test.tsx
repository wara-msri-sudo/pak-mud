import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PinStorageError } from "../application/pinRepository";
import type { CreatePinResult } from "../domain/pin";
import { PinForm } from "./PinForm";
import { makePin, WAT_PHO } from "./testPins";

function renderForm(onSave: (draft: unknown) => Promise<CreatePinResult>) {
  const onCancel = vi.fn();
  render(<PinForm place={WAT_PHO} onSave={onSave} onCancel={onCancel} />);
  return { onCancel };
}

describe("PinForm", () => {
  it("names the place and moves focus to the form", () => {
    renderForm(vi.fn());

    expect(screen.getByRole("heading", { name: "Pin Wat Pho" })).toHaveFocus();
  });

  it("sends the chosen category, cost, hours and note", async () => {
    const onSave = vi.fn(async () => ({ ok: true as const, pin: makePin() }));
    renderForm(onSave);

    fireEvent.click(screen.getByRole("radio", { name: "Temple" }));
    fireEvent.change(screen.getByLabelText("Estimated cost (฿)"), { target: { value: "300" } });
    fireEvent.change(screen.getByLabelText("Opening hours (optional)"), { target: { value: "08:00–18:30" } });
    fireEvent.change(screen.getByLabelText("Note (optional)"), { target: { value: "Wear long trousers" } });
    fireEvent.click(screen.getByRole("button", { name: "Save pin" }));

    await vi.waitFor(() =>
      expect(onSave).toHaveBeenCalledWith({
        category: "temple",
        cost: "300",
        openingHours: "08:00–18:30",
        note: "Wear long trousers",
      }),
    );
  });

  it("shows errors next to the fields", async () => {
    const onSave = vi.fn(async () => ({
      ok: false as const,
      errors: { category: "Choose a category", cost: "Enter the cost in whole baht, for example 300, or leave it empty if free" },
    }));
    renderForm(onSave);

    fireEvent.click(screen.getByRole("button", { name: "Save pin" }));

    expect(await screen.findByText("Choose a category")).toBeInTheDocument();
    expect(screen.getByLabelText("Estimated cost (฿)")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Estimated cost (฿)")).toHaveAccessibleDescription(
      "Enter the cost in whole baht, for example 300, or leave it empty if free Whole baht per person. Leave empty if free.",
    );
  });

  it("explains when the pin can't be saved", async () => {
    renderForm(async () => Promise.reject(new PinStorageError("unavailable")));

    fireEvent.click(screen.getByRole("radio", { name: "Food" }));
    fireEvent.click(screen.getByRole("button", { name: "Save pin" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Your browser is blocking storage, so pins can't be saved on this device.");
  });

  it("can be cancelled", () => {
    const { onCancel } = renderForm(vi.fn());

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
