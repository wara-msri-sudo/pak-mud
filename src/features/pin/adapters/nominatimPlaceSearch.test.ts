import { describe, expect, it } from "vitest";
import { PlaceSearchError } from "../application/placeSearch";
import { NominatimPlaceSearch, type FetchLike } from "./nominatimPlaceSearch";

// Shaped like Nominatim's documented format=jsonv2&addressdetails=1 response.
const WAT_PHO = {
  place_id: 123,
  osm_type: "way",
  osm_id: 26768913,
  lat: "13.7465",
  lon: "100.4927",
  category: "amenity",
  type: "place_of_worship",
  name: "Wat Pho",
  display_name: "Wat Pho, Sanam Chai Road, Phra Borom Maha Ratchawang, Phra Nakhon District, Bangkok, 10200, Thailand",
  address: {
    amenity: "Wat Pho",
    road: "Sanam Chai Road",
    quarter: "Phra Borom Maha Ratchawang",
    city_district: "Phra Nakhon District",
    city: "Bangkok",
    postcode: "10200",
    country: "Thailand",
    country_code: "th",
  },
};

const DOI_SUTHEP = {
  osm_type: "node",
  osm_id: 42,
  lat: "18.8049",
  lon: "98.9216",
  name: "",
  display_name: "Wat Phra That Doi Suthep, Suthep, Mueang Chiang Mai, Chiang Mai Province, Thailand",
  address: { village: "Suthep", county: "Mueang Chiang Mai", state: "Chiang Mai Province", country_code: "th" },
};

type Call = { url: string; at: number };

function setup(respond: () => Promise<Awaited<ReturnType<FetchLike>>>) {
  const calls: Call[] = [];
  let now = 10_000;
  const waits: number[] = [];
  const fetchFake: FetchLike = async (url) => {
    calls.push({ url, at: now });
    return respond();
  };
  const search = new NominatimPlaceSearch({
    fetch: fetchFake,
    now: () => now,
    wait: async (ms) => {
      waits.push(ms);
      now += ms;
    },
  });
  return { search, calls, waits, advance: (ms: number) => (now += ms) };
}

const okWith = (body: unknown) => async () => ({ ok: true, status: 200, json: async () => body });

describe("NominatimPlaceSearch", () => {
  it("asks Nominatim for up to 10 places in Thailand, in English, with address details", async () => {
    const { search, calls } = setup(okWith([]));

    await search.search("wat pho");

    const url = new URL(calls[0].url);
    expect(url.origin + url.pathname).toBe("https://nominatim.openstreetmap.org/search");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      q: "wat pho",
      format: "jsonv2",
      countrycodes: "th",
      limit: "10",
      "accept-language": "en",
      addressdetails: "1",
    });
  });

  it("turns results into places with a short area", async () => {
    const { search } = setup(okWith([WAT_PHO, DOI_SUTHEP]));

    expect(await search.search("wat")).toEqual([
      { placeId: "way/26768913", name: "Wat Pho", area: "Phra Nakhon District, Bangkok", lat: 13.7465, lon: 100.4927 },
      {
        placeId: "node/42",
        name: "Wat Phra That Doi Suthep",
        area: "Suthep, Chiang Mai Province",
        lat: 18.8049,
        lon: 98.9216,
      },
    ]);
  });

  it("skips results without usable coordinates", async () => {
    const { search } = setup(okWith([{ ...WAT_PHO, lat: "not a number" }]));

    expect(await search.search("wat pho")).toEqual([]);
  });

  it("waits so requests are at least one second apart", async () => {
    const { search, calls, waits, advance } = setup(okWith([]));

    await search.search("wat pho");
    advance(300);
    await search.search("wat arun");

    expect(waits).toEqual([700]);
    expect(calls[1].at - calls[0].at).toBeGreaterThanOrEqual(1000);
  });

  it.each([
    ["the network fails", async () => Promise.reject(new TypeError("Failed to fetch")), "unavailable"],
    ["Nominatim rate-limits us", async () => ({ ok: false, status: 429, json: async () => ({}) }), "unavailable"],
    ["the body is not JSON", async () => ({ ok: true, status: 200, json: async () => Promise.reject(new SyntaxError("x")) }), "bad-response"],
    ["the body is not a list", okWith({ error: "nope" }), "bad-response"],
  ] as const)("reports a problem when %s", async (_label, respond, problem) => {
    const { search } = setup(respond);

    const error = await search.search("wat pho").catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(PlaceSearchError);
    expect((error as PlaceSearchError).problem).toBe(problem);
  });

  it("gives up after the timeout", async () => {
    const search = new NominatimPlaceSearch({
      fetch: (_url, init) =>
        new Promise((_resolve, reject) =>
          init.signal.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError"))),
        ),
      now: () => 0,
      wait: async () => {},
      timeoutMs: 10,
    });

    const error = await search.search("wat pho").catch((reason: unknown) => reason);

    expect((error as PlaceSearchError).problem).toBe("unavailable");
  });
});
