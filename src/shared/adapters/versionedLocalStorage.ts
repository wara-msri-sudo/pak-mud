export type StorageProblem = "unavailable" | "corrupt";

type VersionedListOptions<Item> = {
  getStorage: () => Storage;
  key: string;
  schemaVersion: number;
  /** Property holding the list, for example "trips" in { schemaVersion: 1, trips: [...] }. */
  listField: string;
  isItem: (value: unknown) => value is Item;
  /** Builds the feature's own error so the UI can explain the problem in its words. */
  toError: (problem: StorageProblem, cause?: unknown) => Error;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** True when every named field of the value is a string. */
export function hasStringFields(value: unknown, fields: readonly string[]): value is Record<string, string> {
  return isRecord(value) && fields.every((field) => typeof value[field] === "string");
}

/**
 * A list stored under one localStorage key as { schemaVersion, <listField>: Item[] }.
 * Reads never overwrite data they cannot understand, so a corrupt value is left for recovery.
 */
export class VersionedLocalStorageList<Item> {
  constructor(private readonly options: VersionedListOptions<Item>) {}

  read(): Item[] {
    const { getStorage, key, toError } = this.options;
    let raw: string | null;
    try {
      raw = getStorage().getItem(key);
    } catch (cause) {
      throw toError("unavailable", cause);
    }
    return raw === null ? [] : this.parse(raw);
  }

  write(items: Item[]): void {
    const { getStorage, key, schemaVersion, listField, toError } = this.options;
    try {
      getStorage().setItem(key, JSON.stringify({ schemaVersion, [listField]: items }));
    } catch (cause) {
      throw toError("unavailable", cause);
    }
  }

  private parse(raw: string): Item[] {
    const { schemaVersion, listField, isItem, toError } = this.options;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (cause) {
      throw toError("corrupt", cause);
    }
    if (!isRecord(parsed) || parsed.schemaVersion !== schemaVersion) throw toError("corrupt");
    const items = parsed[listField];
    if (!Array.isArray(items) || !items.every(isItem)) throw toError("corrupt");
    return items;
  }
}
