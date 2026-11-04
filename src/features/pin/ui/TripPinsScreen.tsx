"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { browserTripRepository } from "@/features/trip/adapters/browserTrips";
import type { TripRepository } from "@/features/trip/application/tripRepository";
import { listTrips } from "@/features/trip/application/tripUseCases";
import type { Trip } from "@/features/trip/domain/trip";
import { formatTripDates } from "@/features/trip/ui/formatTripDates";
import { storageProblemMessage } from "@/features/trip/ui/storageProblemMessage";
import { browserPinClock, browserPinRepository, browserPlaceSearch } from "../adapters/browserPins";
import type { PinRepository } from "../application/pinRepository";
import type { PlaceSearch } from "../application/placeSearch";
import { addPin, listPins, type PinClock } from "../application/pinUseCases";
import type { Pin, PinDraft } from "../domain/pin";
import type { Place } from "../domain/place";
import { PinList } from "./PinList";
import { pinProblemMessage } from "./pinProblemMessage";
import { PlaceSearchPanel } from "./PlaceSearchPanel";

type TripPinsScreenProps = {
  tripId: string;
  tripRepository?: TripRepository;
  pinRepository?: PinRepository;
  placeSearch?: PlaceSearch;
  clock?: PinClock;
};

type ScreenState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "failed"; message: string }
  | { status: "ready"; trip: Trip; pins: Pin[]; pinsProblem: string | null };

const BACK_TO_TRIPS = { href: "/trips", label: "Back to trips" };

async function loadPins(repository: PinRepository, tripId: string) {
  try {
    return { pins: await listPins(repository, tripId), pinsProblem: null };
  } catch (error) {
    return { pins: [], pinsProblem: pinProblemMessage(error) };
  }
}

/** A trip's page: search places and pin them (Slice 2). */
export function TripPinsScreen({
  tripId,
  tripRepository = browserTripRepository,
  pinRepository = browserPinRepository,
  placeSearch = browserPlaceSearch,
  clock = browserPinClock,
}: TripPinsScreenProps) {
  const [state, setState] = useState<ScreenState>({ status: "loading" });

  useEffect(() => {
    let isCurrent = true;
    async function load(): Promise<ScreenState> {
      try {
        const trip = (await listTrips(tripRepository)).find((candidate) => candidate.id === tripId);
        if (!trip) return { status: "not-found" };
        return { status: "ready", trip, ...(await loadPins(pinRepository, tripId)) };
      } catch (error) {
        return { status: "failed", message: storageProblemMessage(error) };
      }
    }
    load().then((next) => isCurrent && setState(next));
    return () => {
      isCurrent = false;
    };
  }, [tripId, tripRepository, pinRepository]);

  const savePin = useCallback(
    async (place: Place, draft: PinDraft) => {
      const result = await addPin(pinRepository, tripId, place, draft, clock);
      if (result.ok) {
        const pin = result.pin;
        setState((current) => (current.status === "ready" ? { ...current, pins: [...current.pins, pin] } : current));
      }
      return result;
    },
    [pinRepository, tripId, clock],
  );

  const pinnedPlaceIds = useMemo(
    () => new Set(state.status === "ready" ? state.pins.map((pin) => pin.placeId) : []),
    [state],
  );

  if (state.status === "loading") {
    return (
      <>
        <AppHeader back={BACK_TO_TRIPS} />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-8">
          <p className="text-muted">Loading trip…</p>
        </main>
      </>
    );
  }
  if (state.status !== "ready") {
    const message =
      state.status === "failed" ? state.message : "This trip isn't saved in this browser. It may have been made on another device.";
    return (
      <>
        <AppHeader title="Trip not found" back={BACK_TO_TRIPS} />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start gap-4 px-4 py-6 sm:px-8">
          <p role={state.status === "failed" ? "alert" : undefined}>{message}</p>
          <Link href="/trips" className="link">
            Back to your trips
          </Link>
        </main>
      </>
    );
  }

  const { trip, pins, pinsProblem } = state;
  return (
    <>
      <AppHeader title={trip.name} subtitle={formatTripDates(trip.startDate, trip.endDate)} back={BACK_TO_TRIPS} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-6 sm:px-8">
        <section aria-labelledby="find-places" className="flex flex-col gap-3">
          <h2 id="find-places" className="text-xl font-semibold">
            Find places in {trip.destination}
          </h2>
          <PlaceSearchPanel search={placeSearch} pinnedPlaceIds={pinnedPlaceIds} onSavePin={savePin} />
        </section>
        <section aria-labelledby="pins-heading" className="flex flex-col gap-3">
          <h2 id="pins-heading" className="text-xl font-semibold">
            Pins
          </h2>
          {pinsProblem ? (
            <p role="alert" className="rounded-xl border border-danger p-3">
              {pinsProblem}
            </p>
          ) : (
            <PinList pins={pins} />
          )}
        </section>
      </main>
    </>
  );
}
