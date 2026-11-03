import { hasStringFields, VersionedLocalStorageList } from "@/shared/adapters/versionedLocalStorage";
import { PinStorageError, type PinRepository } from "../application/pinRepository";
import { isPinCategory, type Pin } from "../domain/pin";

/** Stored shape, decision 0006: { schemaVersion: 1, pins: Pin[] }, separate from trips. */
export const PINS_STORAGE_KEY = "pak-mud:pins";
export const PINS_SCHEMA_VERSION = 1;

const PIN_STRING_FIELDS = ["id", "tripId", "placeId", "name", "area", "category", "openingHours", "note", "createdAt"] as const;
const PIN_NUMBER_FIELDS = ["lat", "lon", "costThb"] as const;

function isPin(value: unknown): value is Pin {
  if (!hasStringFields(value, PIN_STRING_FIELDS) || !isPinCategory(value.category)) return false;
  const record = value as Record<string, unknown>;
  return PIN_NUMBER_FIELDS.every((field) => typeof record[field] === "number" && Number.isFinite(record[field]));
}

/** Keeps pins in the browser's localStorage. */
export class LocalStoragePinRepository implements PinRepository {
  private readonly store: VersionedLocalStorageList<Pin>;

  constructor(getStorage: () => Storage) {
    this.store = new VersionedLocalStorageList({
      getStorage,
      key: PINS_STORAGE_KEY,
      schemaVersion: PINS_SCHEMA_VERSION,
      listField: "pins",
      isItem: isPin,
      toError: (problem, cause) => new PinStorageError(problem, { cause }),
    });
  }

  async listByTrip(tripId: string): Promise<Pin[]> {
    return this.store.read().filter((pin) => pin.tripId === tripId);
  }

  async save(pin: Pin): Promise<void> {
    const others = this.store.read().filter((existing) => existing.id !== pin.id);
    this.store.write([...others, pin]);
  }
}
