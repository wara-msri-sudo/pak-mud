import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DateField } from "./DateField";

function renderField() {
  const view = render(<DateField name="startDate" label="Start date" />);
  const picker = view.container.querySelector<HTMLInputElement>('input[type="date"]');
  if (!picker) throw new Error("date picker input missing");
  return { field: screen.getByLabelText("Start date"), picker };
}

describe("DateField", () => {
  it("is a dd/mm/yyyy text field", () => {
    const { field } = renderField();

    expect(field).toHaveAttribute("type", "text");
    expect(field).toHaveAttribute("placeholder", "dd/mm/yyyy");
    expect(field).toHaveAttribute("name", "startDate");
    expect(field).toHaveAccessibleDescription("Format: dd/mm/yyyy");
  });

  it("fills the field as dd/mm/yyyy when a date is picked from the calendar", () => {
    const { field, picker } = renderField();

    fireEvent.change(picker, { target: { value: "2026-12-01" } });

    expect(field).toHaveValue("01/12/2026");
  });

  it("opens the calendar with the typed date selected", () => {
    const { field, picker } = renderField();

    fireEvent.change(field, { target: { value: "5/1/2027" } });

    expect(picker).toHaveValue("2027-01-05");
  });

  it("offers a labelled calendar button that does not submit the form", () => {
    renderField();

    const button = screen.getByRole("button", { name: "Choose start date" });

    expect(button).toHaveAttribute("type", "button");
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it("keeps the calendar input out of the form data and the tab order", () => {
    const { picker } = renderField();

    expect(picker).not.toHaveAttribute("name");
    expect(picker).toHaveAttribute("tabindex", "-1");
    expect(picker).toHaveAttribute("aria-hidden", "true");
  });

  it("describes the error instead of the format when there is one", () => {
    render(<DateField name="endDate" label="End date" error="Enter an end date" />);

    expect(screen.getByLabelText("End date")).toHaveAccessibleDescription("Enter an end date");
    expect(screen.getByLabelText("End date")).toHaveAttribute("aria-invalid", "true");
  });
});
