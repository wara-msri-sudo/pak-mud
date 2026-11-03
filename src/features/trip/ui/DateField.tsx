"use client";

import { useRef, useState } from "react";
import { formatDayMonthYear, parseDayMonthYear } from "./dayMonthYear";

type DateFieldProps = {
  name: string;
  label: string;
  error?: string;
};

const FORMAT_HINT = "dd/mm/yyyy";

/**
 * A dd/mm/yyyy text field with a calendar button.
 * Browsers format <input type="date"> from the device language, so the visible field is text;
 * a hidden date input only provides the browser's calendar popup.
 */
export function DateField({ name, label, error }: DateFieldProps) {
  const [text, setText] = useState("");
  const pickerRef = useRef<HTMLInputElement>(null);
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;

  function openCalendar() {
    const picker = pickerRef.current;
    if (!picker) return;
    try {
      picker.showPicker();
    } catch {
      // Older browsers without showPicker: focusing still lets keyboard users type the date.
      document.getElementById(name)?.focus();
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="font-medium">
        {label}
      </label>
      <div className="relative flex gap-2">
        <input
          id={name}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={FORMAT_HINT}
          value={text}
          onChange={(event) => setText(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hintId}
          className="field-input"
        />
        <input
          ref={pickerRef}
          type="date"
          tabIndex={-1}
          aria-hidden="true"
          value={parseDayMonthYear(text) ?? ""}
          onChange={(event) => event.target.value && setText(formatDayMonthYear(event.target.value))}
          className="pointer-events-none absolute inset-0 opacity-0"
        />
        <button
          type="button"
          onClick={openCalendar}
          aria-label={`Choose ${label.toLowerCase()}`}
          className="inline-flex size-11 flex-none items-center justify-center rounded-[10px] border border-border bg-card"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </svg>
        </button>
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      ) : (
        <p id={hintId} className="sr-only">
          Format: {FORMAT_HINT}
        </p>
      )}
    </div>
  );
}
