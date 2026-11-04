import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";
import { TripList } from "@/features/trip/ui/TripList";

export const metadata: Metadata = { title: "Your trips · Pak Mud" };

export default function TripsPage() {
  return (
    <>
      <AppHeader
        title="Your trips"
        subtitle="Saved on this device only."
        action={{ href: "/trips/new", label: "New trip" }}
      />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 sm:px-8">
        <TripList />
      </main>
    </>
  );
}
