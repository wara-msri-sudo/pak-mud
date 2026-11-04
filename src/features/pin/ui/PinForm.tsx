"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  PIN_CATEGORIES,
  PIN_HOURS_MAX_LENGTH,
  PIN_NOTE_MAX_LENGTH,
  type CreatePinResult,
  type PinDraft,
  type PinValidationErrors,
} from "../domain/pin";
import type { Place } from "../domain/place";
import { CATEGORY_DOT_CLASS } from "./categoryStyle";
import { pinProblemMessage } from "./pinProblemMessage";

type PinFormProps = {
  place: Place;
  onSave: (draft: PinDraft) => Promise<CreatePinResult>;
  onCancel: () => void;
};

function readDraft(form: HTMLFormElement): PinDraft {
  const data = new FormData(form);
  const text = (field: keyof PinDraft) => String(data.get(field) ?? "");
  return { category: text("category"), cost: text("cost"), openingHours: text("openingHours"), note: text("note") };
}

/** Category, cost, hours and note for a place being pinned. Shown inline under the chosen search result. */
export function PinForm({ place, onSave, onCancel }: PinFormProps) {
  const [errors, setErrors] = useState<PinValidationErrors>({});
  const [saveProblem, setSaveProblem] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const idPrefix = useId();
  const id = (field: string) => `${idPrefix}-${field}`;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setSaveProblem(null);
    setErrors({});
    try {
      const result = await onSave(readDraft(event.currentTarget));
      if (result.ok) return;
      setErrors(result.errors);
    } catch (error) {
      setSaveProblem(pinProblemMessage(error));
    }
    setIsSaving(false);
  }

  const describe = (field: keyof PinDraft, hintId?: string) =>
    [errors[field] ? id(`${field}-error`) : undefined, hintId].filter(Boolean).join(" ") || undefined;
  const fieldError = (field: keyof PinDraft) =>
    errors[field] && (
      <p id={id(`${field}-error`)} className="text-sm text-danger">
        {errors[field]}
      </p>
    );

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
      <h3 ref={headingRef} tabIndex={-1} className="text-lg font-semibold">
        Pin {place.name}
      </h3>
      {saveProblem && (
        <p role="alert" className="rounded-xl border border-danger p-3">
          {saveProblem}
        </p>
      )}
      <fieldset aria-describedby={describe("category")} className="flex flex-col gap-2">
        <legend className="mb-2 font-medium">Category</legend>
        <div className="flex flex-wrap gap-2">
          {PIN_CATEGORIES.map((category) => (
            <label
              key={category.id}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 has-checked:border-accent has-checked:font-semibold has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
            >
              <input type="radio" name="category" value={category.id} className="sr-only" />
              <span aria-hidden="true" className={`size-2.5 rounded-full ${CATEGORY_DOT_CLASS[category.id]}`} />
              {category.label}
            </label>
          ))}
        </div>
        {fieldError("category")}
      </fieldset>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id("cost")} className="font-medium">
          Estimated cost (฿)
        </label>
        <input
          id={id("cost")}
          name="cost"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-invalid={errors.cost ? true : undefined}
          aria-describedby={describe("cost", id("cost-hint"))}
          className="field-input"
        />
        {fieldError("cost")}
        <p id={id("cost-hint")} className="text-sm text-muted">
          Whole baht per person. Leave empty if free.
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id("openingHours")} className="font-medium">
          Opening hours (optional)
        </label>
        <input
          id={id("openingHours")}
          name="openingHours"
          type="text"
          autoComplete="off"
          maxLength={PIN_HOURS_MAX_LENGTH}
          placeholder="08:00–18:30 daily"
          aria-invalid={errors.openingHours ? true : undefined}
          aria-describedby={describe("openingHours")}
          className="field-input"
        />
        {fieldError("openingHours")}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id("note")} className="font-medium">
          Note (optional)
        </label>
        <textarea
          id={id("note")}
          name="note"
          rows={3}
          maxLength={PIN_NOTE_MAX_LENGTH}
          aria-invalid={errors.note ? true : undefined}
          aria-describedby={describe("note")}
          className="field-input py-2"
        />
        {fieldError("note")}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={isSaving} className="button-primary">
          Save pin
        </button>
        <button type="button" onClick={onCancel} className="link min-h-11">
          Cancel
        </button>
      </div>
    </form>
  );
}
