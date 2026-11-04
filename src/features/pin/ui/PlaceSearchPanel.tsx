"use client";

import { Fragment, useState, type FormEvent } from "react";
import type { PlaceSearch } from "../application/placeSearch";
import { searchPlaces } from "../application/pinUseCases";
import type { CreatePinResult, PinDraft } from "../domain/pin";
import type { Place } from "../domain/place";
import { PinForm } from "./PinForm";
import { pinProblemMessage } from "./pinProblemMessage";

type SearchState =
  | { status: "idle" }
  | { status: "searching" }
  | { status: "done"; places: Place[] }
  | { status: "failed"; message: string };

type PlaceSearchPanelProps = {
  search: PlaceSearch;
  pinnedPlaceIds: ReadonlySet<string>;
  onSavePin: (place: Place, draft: PinDraft) => Promise<CreatePinResult>;
};

/** Search runs only when the button is pressed: Nominatim's usage policy forbids search-as-you-type. */
export function PlaceSearchPanel({ search, pinnedPlaceIds, onSavePin }: PlaceSearchPanelProps) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<SearchState>({ status: "idle" });
  const [pinningId, setPinningId] = useState<string | null>(null);
  const isSearching = state.status === "searching";

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSearching) return;
    setState({ status: "searching" });
    setPinningId(null);
    try {
      setState({ status: "done", places: await searchPlaces(search, query) });
    } catch (error) {
      setState({ status: "failed", message: pinProblemMessage(error) });
    }
  }

  async function savePin(place: Place, draft: PinDraft) {
    const result = await onSavePin(place, draft);
    if (result.ok) setPinningId(null);
    return result;
  }

  return (
    <div className="flex flex-col gap-4">
      <form role="search" onSubmit={handleSearch} className="flex gap-2">
        <label htmlFor="place-query" className="sr-only">
          Search places in Thailand
        </label>
        <input
          id="place-query"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search places in Thailand"
          autoComplete="off"
          className="field-input"
        />
        <button type="submit" disabled={isSearching} aria-disabled={isSearching} className="button-primary flex-none">
          {isSearching ? "Searching…" : "Search"}
        </button>
      </form>

      {state.status === "failed" && (
        <p role="alert" className="rounded-xl border border-danger p-3">
          {state.message}
        </p>
      )}
      {state.status === "done" && state.places.length === 0 && (
        <p className="text-muted">No places found. Try another name or spelling.</p>
      )}
      {state.status === "done" && state.places.length > 0 && (
        <div className="flex flex-col gap-2">
          <ul aria-label="Search results" className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
            {state.places.map((place) => (
              <Fragment key={place.placeId}>
                <li className="flex items-center gap-3 px-4 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium break-words">{place.name}</p>
                    <p className="text-sm text-muted break-words">{place.area}</p>
                  </div>
                  {pinnedPlaceIds.has(place.placeId) ? (
                    <span className="flex-none text-sm font-medium text-muted">Pinned</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPinningId(place.placeId)}
                      aria-label={`Pin ${place.name}`}
                      aria-expanded={pinningId === place.placeId}
                      className="inline-flex min-h-11 flex-none items-center rounded-[10px] border border-border px-4 font-medium"
                    >
                      Pin
                    </button>
                  )}
                </li>
                {pinningId === place.placeId && (
                  <li className="list-none px-2 py-2" aria-label={`Pin ${place.name} form`}>
                    <PinForm place={place} onSave={(draft) => savePin(place, draft)} onCancel={() => setPinningId(null)} />
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
          <p className="text-xs text-muted">
            Search by Nominatim · ©{" "}
            <a href="https://www.openstreetmap.org/copyright" className="link" target="_blank" rel="noreferrer">
              OpenStreetMap contributors
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
