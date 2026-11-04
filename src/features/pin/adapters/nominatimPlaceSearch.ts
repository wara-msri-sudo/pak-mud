import { PlaceSearchError, type PlaceSearch } from "../application/placeSearch";
import type { Place } from "../domain/place";

/** The parts of fetch this adapter uses, so tests can pass a fake. */
export type FetchLike = (
  url: string,
  init: { signal: AbortSignal; headers: Record<string, string> },
) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

type NominatimOptions = {
  fetch?: FetchLike;
  now?: () => number;
  wait?: (ms: number) => Promise<void>;
  timeoutMs?: number;
};

const SEARCH_URL = "https://nominatim.openstreetmap.org/search";
const RESULT_LIMIT = 10;
/** Nominatim usage policy: at most one request per second. */
const MIN_INTERVAL_MS = 1000;
const DEFAULT_TIMEOUT_MS = 8000;

// Most local name first. "quarter" is skipped: it's often a ward too small for visitors to recognise.
const LOCAL_AREA_KEYS = ["suburb", "city_district", "town", "village", "county"] as const;
const REGION_KEYS = ["city", "state"] as const;

type NominatimResult = {
  osm_type?: unknown;
  osm_id?: unknown;
  lat?: unknown;
  lon?: unknown;
  name?: unknown;
  display_name?: unknown;
  address?: Record<string, unknown>;
};

function firstText(source: Record<string, unknown> | undefined, keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === "string" && value.trim() !== "") return value.trim();
  }
  return undefined;
}

function displayParts(result: NominatimResult): string[] {
  return typeof result.display_name === "string" ? result.display_name.split(",").map((part) => part.trim()) : [];
}

function areaOf(result: NominatimResult): string {
  const local = firstText(result.address, LOCAL_AREA_KEYS);
  const region = firstText(result.address, REGION_KEYS);
  const parts = [local, region].filter((part): part is string => Boolean(part));
  if (parts.length === 0) return displayParts(result).slice(1, 3).join(", ");
  return [...new Set(parts)].join(", ");
}

function toPlace(result: NominatimResult): Place | null {
  const lat = Number(result.lat);
  const lon = Number(result.lon);
  const name = (typeof result.name === "string" && result.name.trim()) || displayParts(result)[0];
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !name || typeof result.osm_type !== "string") return null;
  return { placeId: `${result.osm_type}/${String(result.osm_id)}`, name, area: areaOf(result), lat, lon };
}

function searchUrl(query: string): string {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    countrycodes: "th",
    limit: String(RESULT_LIMIT),
    "accept-language": "en",
    addressdetails: "1",
  });
  return `${SEARCH_URL}?${params}`;
}

/**
 * Searches places in Thailand with OpenStreetMap Nominatim (decision 0007).
 * Follows the usage policy: one request per second, only on an explicit search (no autocomplete).
 * The browser sends the Referer header that identifies the app.
 */
export class NominatimPlaceSearch implements PlaceSearch {
  private readonly fetch: FetchLike;
  private readonly now: () => number;
  private readonly wait: (ms: number) => Promise<void>;
  private readonly timeoutMs: number;
  private lastRequestAt: number | null = null;

  constructor(options: NominatimOptions = {}) {
    this.fetch = options.fetch ?? ((url, init) => globalThis.fetch(url, init));
    this.now = options.now ?? (() => Date.now());
    this.wait = options.wait ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async search(query: string): Promise<Place[]> {
    await this.keepRequestsApart();
    const body = await this.request(searchUrl(query));
    if (!Array.isArray(body)) throw new PlaceSearchError("bad-response");
    return body.map((result: NominatimResult) => toPlace(result)).filter((place): place is Place => place !== null);
  }

  private async keepRequestsApart(): Promise<void> {
    if (this.lastRequestAt !== null) {
      const remaining = MIN_INTERVAL_MS - (this.now() - this.lastRequestAt);
      if (remaining > 0) await this.wait(remaining);
    }
    this.lastRequestAt = this.now();
  }

  /** The timeout covers the whole exchange, including reading the body. */
  private async request(url: string): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      let response: Awaited<ReturnType<FetchLike>>;
      try {
        response = await this.fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
      } catch (cause) {
        throw new PlaceSearchError("unavailable", { cause });
      }
      if (!response.ok) throw new PlaceSearchError("unavailable", { cause: `HTTP ${response.status}` });
      try {
        return await response.json();
      } catch (cause) {
        throw new PlaceSearchError(controller.signal.aborted ? "unavailable" : "bad-response", { cause });
      }
    } finally {
      clearTimeout(timer);
    }
  }
}
