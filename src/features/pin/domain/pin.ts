import type { Place } from "./place";

export const PIN_CATEGORIES = [
  { id: "food", label: "Food" },
  { id: "temple", label: "Temple" },
  { id: "nature", label: "Nature" },
  { id: "shopping", label: "Shopping" },
  { id: "nightlife", label: "Nightlife" },
  { id: "stay", label: "Stay" },
] as const;

export type PinCategory = (typeof PIN_CATEGORIES)[number]["id"];

export const PIN_HOURS_MAX_LENGTH = 80;
export const PIN_NOTE_MAX_LENGTH = 500;

/** A place saved to a trip. Money is whole Thai baht; 0 means free. */
export type Pin = Place & {
  id: string;
  tripId: string;
  category: PinCategory;
  costThb: number;
  openingHours: string;
  note: string;
  createdAt: string;
};

/** What the visitor fills in when pinning a place. Cost is the typed text. */
export type PinDraft = {
  category: string;
  cost: string;
  openingHours: string;
  note: string;
};

export type PinField = keyof PinDraft;
export type PinValidationErrors = Partial<Record<PinField, string>>;
export type CreatePinResult = { ok: true; pin: Pin } | { ok: false; errors: PinValidationErrors };

type PinIdentity = { id: string; tripId: string; createdAt: string };

const WHOLE_BAHT_PATTERN = /^\d{1,3}(,\d{3})*$|^\d+$/;

export function isPinCategory(value: string): value is PinCategory {
  return PIN_CATEGORIES.some((category) => category.id === value);
}

/** Empty means free (0). Returns null when the text is not a whole, non-negative baht amount. */
function parseCost(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  return WHOLE_BAHT_PATTERN.test(trimmed) ? Number(trimmed.replaceAll(",", "")) : null;
}

function tooLong(value: string, maxLength: number): string | undefined {
  return value.length > maxLength ? `Use ${maxLength} characters or fewer` : undefined;
}

export function createPin(place: Place, draft: PinDraft, identity: PinIdentity): CreatePinResult {
  const costThb = parseCost(draft.cost);
  const openingHours = draft.openingHours.trim();
  const note = draft.note.trim();
  const category = draft.category;

  const errors: PinValidationErrors = {};
  if (!isPinCategory(category)) errors.category = "Choose a category";
  if (costThb === null) errors.cost = "Enter the cost in whole baht, for example 300, or leave it empty if free";
  const hoursError = tooLong(openingHours, PIN_HOURS_MAX_LENGTH);
  if (hoursError) errors.openingHours = hoursError;
  const noteError = tooLong(note, PIN_NOTE_MAX_LENGTH);
  if (noteError) errors.note = noteError;

  if (!isPinCategory(category) || costThb === null || Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, pin: { ...identity, ...place, category, costThb, openingHours, note } };
}
