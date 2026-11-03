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
import { DateField } from "./DateField";
import { parseDayMonthYear } from "./dayMonthYear";
import { storageProblemMessage } from "./storageProblemMessage";

type TripFormProps = {
  repository: TripRepository;
  clock: TripClock;
  onCreated: (trip: Trip) => void;
};

const TEXT_FIELDS = [
  { field: "name", label: "Trip name" },
  { field: "destination", label: "Destination" },
] as const;

const DATE_FIELDS = [
  { field: "startDate", label: "Start date" },
  { field: "endDate", label: "End date" },
] as const;

const DATE_FORMAT_ERROR = "Enter the date as dd/mm/yyyy, for example 01/12/2026";

type DateFieldName = (typeof DATE_FIELDS)[number]["field"];

type FormInput = {
  draft: TripDraft;
  /** Date fields holding text that is not a dd/mm/yyyy date. */
  unreadableDates: DateFieldName[];
};

/** Dates are typed as dd/mm/yyyy. The domain only ever receives ISO dates, or "" when the text can't be read. */
function readForm(form: HTMLFormElement): FormInput {
  const data = new FormData(form);
  const text = (field: TripField) => String(data.get(field) ?? "").trim();
  const unreadableDates = DATE_FIELDS.map(({ field }) => field).filter(
    (field) => text(field) !== "" && parseDayMonthYear(text(field)) === null,
  );
  const isoDate = (field: DateFieldName) => parseDayMonthYear(text(field)) ?? "";
  return {
    draft: {
      name: text("name"),
      destination: text("destination"),
      startDate: isoDate("startDate"),
      endDate: isoDate("endDate"),
    },
    unreadableDates,
  };
}

/** A date the visitor typed in the wrong format needs a format hint, not "Enter a date". */
function withDateFormatErrors(errors: TripValidationErrors, unreadableDates: DateFieldName[]) {
  const formatErrors = Object.fromEntries(unreadableDates.map((field) => [field, DATE_FORMAT_ERROR]));
  return { ...errors, ...formatErrors };
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
    setErrors({});
    try {
      const { draft, unreadableDates } = readForm(event.currentTarget);
      const result = await addTrip(repository, draft, clock);
      if (result.ok) {
        onCreated(result.trip);
        return;
      }
      setErrors(withDateFormatErrors(result.errors, unreadableDates));
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
        {TEXT_FIELDS.map(({ field, label }) => {
          const error = errors[field];
          const errorId = `${field}-error`;
          return (
            <div key={field} className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor={field} className="font-medium">
                {label}
              </label>
              <input
                id={field}
                name={field}
                type="text"
                autoComplete="off"
                maxLength={TRIP_TEXT_MAX_LENGTH}
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
        {DATE_FIELDS.map(({ field, label }) => (
          <DateField key={field} name={field} label={label} error={errors[field]} />
        ))}
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
