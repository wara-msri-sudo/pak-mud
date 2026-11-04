import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";
import { NewTripForm } from "@/features/trip/ui/NewTripForm";

export const metadata: Metadata = { title: "New trip · Pak Mud" };

export default function NewTripPage() {
  return (
    <>
      <AppHeader
        title="New trip"
        subtitle="You can pin places once the trip is created."
        back={{ href: "/trips", label: "Back to trips" }}
      />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 sm:px-8">
        <NewTripForm />
      </main>
    </>
  );
}
