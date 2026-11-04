import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home page", () => {
  it("shows the Pak Mud logo and the trip-planning headline", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: "Pak Mud" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Plan your Thailand trip" }),
    ).toBeInTheDocument();
  });

  it("links to the trip list", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: "Plan a trip" })).toHaveAttribute("href", "/trips");
  });
});
