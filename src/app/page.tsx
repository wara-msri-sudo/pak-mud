import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";

const STEPS = ["Create a trip with your dates", "Search and pin places", "Drop pins onto days"];

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Plan your Thailand trip</h1>
          <p className="max-w-md text-lg leading-7 text-muted">
            Pin the places you want to see, then turn your pins into a day-by-day plan.
          </p>
        </div>
        <ol className="flex flex-col gap-3">
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-center gap-3">
              <span className="flex size-7 flex-none items-center justify-center rounded-full border border-border bg-card text-sm font-semibold">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <div className="flex flex-col items-start gap-2">
          <Link href="/trips" className="button-primary">
            Plan a trip
          </Link>
          <p className="text-sm text-muted">No account needed. Trips stay in this browser.</p>
        </div>
      </main>
    </>
  );
}
