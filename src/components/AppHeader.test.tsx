import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppHeader } from "./AppHeader";

describe("AppHeader", () => {
  it("shows the logo linking home", () => {
    render(<AppHeader />);

    expect(screen.getByRole("link", { name: "Pak Mud" })).toHaveAttribute("href", "/");
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("shows the page title, subtitle and band action", () => {
    render(
      <AppHeader
        title="Your trips"
        subtitle="Saved on this device only."
        action={{ href: "/trips/new", label: "New trip" }}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Your trips" })).toBeInTheDocument();
    expect(screen.getByText("Saved on this device only.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "New trip" })).toHaveAttribute("href", "/trips/new");
  });

  it("shows a labelled back link", () => {
    render(<AppHeader title="New trip" back={{ href: "/trips", label: "Back to trips" }} />);

    expect(screen.getByRole("link", { name: "Back to trips" })).toHaveAttribute("href", "/trips");
  });
});
