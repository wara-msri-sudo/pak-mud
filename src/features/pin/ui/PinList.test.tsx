import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PinList } from "./PinList";
import { makePin } from "./testPins";

describe("PinList", () => {
  it("invites the visitor to pin a place when there are none", () => {
    render(<PinList pins={[]} />);

    expect(screen.getByText("No pins yet. Search for a place above and pin it.")).toBeInTheDocument();
  });

  it("shows each pin's name, area, category, cost, hours and note", () => {
    render(<PinList pins={[makePin(), makePin({ id: "pin-2", name: "Jay Fai", category: "food", costThb: 1200, openingHours: "", note: "" })]} />);

    const [watPho, jayFai] = screen.getAllByRole("listitem");
    expect(watPho).toHaveTextContent("Wat Pho");
    expect(watPho).toHaveTextContent("Phra Nakhon District, Bangkok");
    expect(watPho).toHaveTextContent("Temple");
    expect(watPho).toHaveTextContent("฿300");
    expect(watPho).toHaveTextContent("08:00–18:30");
    expect(watPho).toHaveTextContent("Wear long trousers");
    expect(jayFai).toHaveTextContent("Food");
    expect(jayFai).toHaveTextContent("฿1,200");
  });

  it("shows a free pin as Free", () => {
    render(<PinList pins={[makePin({ costThb: 0 })]} />);

    expect(screen.getByRole("listitem")).toHaveTextContent("Free");
  });
});
