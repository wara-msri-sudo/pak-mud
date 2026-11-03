"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { browserTripRepository } from "../adapters/browserTrips";
import type { TripRepository } from "../application/tripRepository";
import { listTrips } from "../application/tripUseCases";
import type { Trip } from "../domain/trip";
import { formatTripDates } from "./formatTripDates";
import { storageProblemMessage } from "./storageProblemMessage";

type ListState =
  | { status: "loading" }
  | { status: "ready"; trips: Trip[] }
  | { status: "failed"; message: string };

const NEW_TRIP_PATH = "/trips/new";

export function TripList({ repository = browserTripRepository }: { repository?: TripRepository }) {
  const [state, setState] = useState<ListState>({ status: "loading" });

  useEffect(() => {
    let isCurrent = true;
    listTrips(repository).then(
      (trips) => isCurrent && setState({ status: "ready", trips }),
      (error: unknown) => isCurrent && setState({ status: "failed", message: storageProblemMessage(error) }),
    );
    return () => {
      isCurrent = false;
    };
  }, [repository]);

  if (state.status === "loading") {
    return <p className="text-muted">Loading your trips…</p>;
  }
  if (state.status === "failed") {
    return (
      <p role="alert" className="rounded-xl border border-danger p-4">
        {state.message}
      </p>
    );
  }
  if (state.trips.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-border bg-card p-6">
        <p className="text-muted">No trips yet. Start one and pin the places you want to visit.</p>
        <Link href={NEW_TRIP_PATH} className="button-primary">
          Create your first trip
        </Link>
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {state.trips.map((trip) => (
        <li key={trip.id} className="card flex flex-col gap-0.5">
          <h2 className="text-lg font-semibold break-words">{trip.name}</h2>
          <p className="break-words">{trip.destination}</p>
          <p className="text-sm text-muted">{formatTripDates(trip.startDate, trip.endDate)}</p>
        </li>
      ))}
    </ul>
  );
}
