import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home page", () => {
  it("shows the Pak Mud heading and tagline", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Pak Mud" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Plan your Thailand trip")).toBeInTheDocument();
  });
});
