import type { Metadata } from "next";
import { NewTripForm } from "@/features/trip/ui/NewTripForm";

export const metadata: Metadata = { title: "New trip · Pak Mud" };

export default function NewTripPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-12 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight">New trip</h1>
      <NewTripForm />
    </main>
  );
}
