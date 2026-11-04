import type { Metadata } from "next";
import { Suspense } from "react";
import { AppHeader } from "@/components/AppHeader";
import { TripPinsScreen } from "@/features/pin/ui/TripPinsScreen";

export const metadata: Metadata = { title: "Trip · Pak Mud" };

/** The trip id is runtime data (Cache Components), so it is read inside Suspense behind a static loading shell. */
export default function TripPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<TripLoadingShell />}>
      {params.then(({ id }) => (
        <TripPinsScreen tripId={id} />
      ))}
    </Suspense>
  );
}

function TripLoadingShell() {
  return (
    <>
      <AppHeader back={{ href: "/trips", label: "Back to trips" }} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-8">
        <p className="text-muted">Loading trip…</p>
      </main>
    </>
  );
}
