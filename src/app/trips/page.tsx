import type { Metadata } from "next";
import { TripList } from "@/features/trip/ui/TripList";

export const metadata: Metadata = { title: "Your trips · Pak Mud" };

export default function TripsPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-12 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Your trips</h1>
      <TripList />
    </main>
  );
}
