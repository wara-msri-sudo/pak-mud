"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { TripRepository } from "../application/tripRepository";
import { addTrip, type TripClock } from "../application/tripUseCases";
import {
  TRIP_TEXT_MAX_LENGTH,
  type Trip,
  type TripDraft,
  type TripField,
  type TripValidationErrors,
} from "../domain/trip";
import { storageProblemMessage } from "./storageProblemMessage";

type TripFormProps = {
  repository: TripRepository;
  clock: TripClock;
  onCreated: (trip: Trip) => void;
};

type FieldConfig = { field: TripField; label: string; type: "text" | "date"; autoComplete?: string };

const FIELDS: readonly FieldConfig[] = [
  { field: "name", label: "Trip name", type: "text", autoComplete: "off" },
  { field: "destination", label: "Destination", type: "text", autoComplete: "off" },
  { field: "startDate", label: "Start date", type: "date" },
  { field: "endDate", label: "End date", type: "date" },
];

function readDraft(form: HTMLFormElement): TripDraft {
  const data = new FormData(form);
  const text = (field: TripField) => String(data.get(field) ?? "");
  return {
    name: text("name"),
    destination: text("destination"),
    startDate: text("startDate"),
    endDate: text("endDate"),
  };
}

export function TripForm({ repository, clock, onCreated }: TripFormProps) {
  const [errors, setErrors] = useState<TripValidationErrors>({});
  const [saveProblem, setSaveProblem] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setSaveProblem(null);
    try {
      const result = await addTrip(repository, readDraft(event.currentTarget), clock);
      if (result.ok) {
        onCreated(result.trip);
        return;
      }
      setErrors(result.errors);
    } catch (error) {
      setSaveProblem(storageProblemMessage(error));
    }
    setIsSaving(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      {saveProblem && (
        <p role="alert" className="rounded-xl border border-danger p-4">
          {saveProblem}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        {FIELDS.map(({ field, label, type, autoComplete }) => {
          const error = errors[field];
          const errorId = `${field}-error`;
          return (
            <div key={field} className={`flex flex-col gap-1.5 ${type === "text" ? "sm:col-span-2" : ""}`}>
              <label htmlFor={field} className="font-medium">
                {label}
              </label>
              <input
                id={field}
                name={field}
                type={type}
                autoComplete={autoComplete}
                maxLength={type === "text" ? TRIP_TEXT_MAX_LENGTH : undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className="field-input"
              />
              {error && (
                <p id={errorId} className="text-sm text-danger">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={isSaving} className="button-primary">
          Create trip
        </button>
        <Link href="/trips" className="link">
          Cancel
        </Link>
      </div>
    </form>
  );
}
