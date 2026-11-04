import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlaceSearchError, type PlaceSearch } from "../application/placeSearch";
import type { Place } from "../domain/place";
import { PlaceSearchPanel } from "./PlaceSearchPanel";
import { makePin, WAT_ARUN, WAT_PHO } from "./testPins";

function searchWith(run: (query: string) => Promise<Place[]>): PlaceSearch & { search: ReturnType<typeof vi.fn> } {
  return { search: vi.fn(run) };
}

function renderPanel(search: PlaceSearch, pinnedPlaceIds: string[] = []) {
  const onSavePin = vi.fn(async () => ({ ok: true as const, pin: makePin() }));
  render(<PlaceSearchPanel search={search} pinnedPlaceIds={new Set(pinnedPlaceIds)} onSavePin={onSavePin} />);
  return { onSavePin };
}

function searchFor(text: string) {
  fireEvent.change(screen.getByLabelText("Search places in Thailand"), { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
}

describe("PlaceSearchPanel", () => {
  it("does not search while typing, only on the button", () => {
    const search = searchWith(async () => []);
    renderPanel(search);

    fireEvent.change(screen.getByLabelText("Search places in Thailand"), { target: { value: "wat pho" } });

    expect(search.search).not.toHaveBeenCalled();
  });

  it("lists results with name and area, and credits OpenStreetMap", async () => {
    renderPanel(searchWith(async () => [WAT_PHO, WAT_ARUN]));

    searchFor("wat");

    const results = await screen.findByRole("list", { name: "Search results" });
    const items = within(results).getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Wat Pho");
    expect(items[0]).toHaveTextContent("Phra Nakhon District, Bangkok");
    expect(screen.getByRole("link", { name: "OpenStreetMap contributors" })).toHaveAttribute(
      "href",
      "https://www.openstreetmap.org/copyright",
    );
  });

  it("shows Pinned instead of the Pin button for places already on the trip", async () => {
    renderPanel(searchWith(async () => [WAT_PHO, WAT_ARUN]), [WAT_PHO.placeId]);

    searchFor("wat");

    const [watPho, watArun] = within(await screen.findByRole("list", { name: "Search results" })).getAllByRole("listitem");
    expect(watPho).toHaveTextContent("Pinned");
    expect(within(watPho).queryByRole("button", { name: /^Pin/ })).not.toBeInTheDocument();
    expect(within(watArun).getByRole("button", { name: "Pin Wat Arun" })).toBeInTheDocument();
  });

  it("opens the pin form under the chosen result and saves through it", async () => {
    const { onSavePin } = renderPanel(searchWith(async () => [WAT_PHO]));
    searchFor("wat pho");

    fireEvent.click(await screen.findByRole("button", { name: "Pin Wat Pho" }));
    fireEvent.click(screen.getByRole("radio", { name: "Temple" }));
    fireEvent.click(screen.getByRole("button", { name: "Save pin" }));

    await vi.waitFor(() => expect(onSavePin).toHaveBeenCalledWith(WAT_PHO, expect.objectContaining({ category: "temple" })));
    await vi.waitFor(() => expect(screen.queryByRole("heading", { name: "Pin Wat Pho" })).not.toBeInTheDocument());
  });

  it("says when nothing was found", async () => {
    renderPanel(searchWith(async () => []));

    searchFor("zzzz");

    expect(await screen.findByText("No places found. Try another name or spelling.")).toBeInTheDocument();
  });

  it("asks for at least 2 characters", async () => {
    const search = searchWith(async () => []);
    renderPanel(search);

    searchFor(" w ");

    expect(await screen.findByText("Type at least 2 characters to search.")).toBeInTheDocument();
    expect(search.search).not.toHaveBeenCalled();
  });

  it("explains when search is unavailable", async () => {
    renderPanel(searchWith(async () => Promise.reject(new PlaceSearchError("unavailable"))));

    searchFor("wat pho");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Search isn't available right now. Check your connection and try again in a moment.",
    );
  });

  it("ignores repeat presses while a search is running", async () => {
    let finish: (places: Place[]) => void = () => {};
    const search = searchWith(() => new Promise((resolve) => (finish = resolve)));
    renderPanel(search);

    searchFor("wat pho");
    fireEvent.click(screen.getByRole("button", { name: "Searching…" }));
    finish([WAT_PHO]);

    await screen.findByRole("list", { name: "Search results" });
    expect(search.search).toHaveBeenCalledTimes(1);
  });
});
