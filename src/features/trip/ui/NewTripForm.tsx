"use client";

import { useRouter } from "next/navigation";
import { browserTripClock, browserTripRepository } from "../adapters/browserTrips";
import { TripForm } from "./TripForm";

/** Wires the trip form to browser storage and returns to the trip list after saving. */
export function NewTripForm() {
  const router = useRouter();
  return (
    <TripForm
      repository={browserTripRepository}
      clock={browserTripClock}
      onCreated={() => router.push("/trips")}
    />
  );
}
