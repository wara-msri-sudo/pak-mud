import { expect, test, type Page } from "@playwright/test";

const NOMINATIM = "https://nominatim.openstreetmap.org/search**";
const TRIP = {
  id: "trip-bkk",
  name: "Bangkok weekend",
  destination: "Bangkok",
  startDate: "2026-12-12",
  endDate: "2026-12-13",
  createdAt: "2026-11-03T08:00:00.000Z",
};
// Shaped like Nominatim's format=jsonv2&addressdetails=1 response.
const RESULTS = [
  {
    osm_type: "way",
    osm_id: 26768913,
    lat: "13.7465",
    lon: "100.4927",
    name: "Wat Pho",
    display_name: "Wat Pho, Phra Nakhon District, Bangkok, Thailand",
    address: { city_district: "Phra Nakhon District", city: "Bangkok", country_code: "th" },
  },
  {
    osm_type: "way",
    osm_id: 42,
    lat: "13.7437",
    lon: "100.4888",
    name: "Wat Arun",
    display_name: "Wat Arun, Bangkok Yai District, Bangkok, Thailand",
    address: { city_district: "Bangkok Yai District", city: "Bangkok", country_code: "th" },
  },
];

async function seedTrip(page: Page) {
  await page.goto("/trips");
  await page.evaluate((trip) => {
    localStorage.setItem("pak-mud:trips", JSON.stringify({ schemaVersion: 1, trips: [trip] }));
  }, TRIP);
}

async function search(page: Page, text: string) {
  await page.getByLabel("Search places in Thailand").fill(text);
  await page.getByRole("button", { name: "Search", exact: true }).click();
}

test("a visitor searches, pins a place, and still sees it after a reload", async ({ page }) => {
  const requests: URL[] = [];
  await page.route(NOMINATIM, (route) => {
    requests.push(new URL(route.request().url()));
    return route.fulfill({ json: RESULTS });
  });
  await seedTrip(page);
  await page.reload();

  await page.getByRole("link", { name: /Bangkok weekend/ }).click();
  await expect(page).toHaveURL(`/trips/${TRIP.id}`);
  await expect(page.getByRole("heading", { level: 1, name: "Bangkok weekend" })).toBeVisible();

  await search(page, "wat");
  await expect(page.getByRole("list", { name: "Search results" }).getByRole("listitem")).toHaveCount(2);
  expect(requests[0].searchParams.get("countrycodes")).toBe("th");
  expect(requests[0].searchParams.get("q")).toBe("wat");

  await page.getByRole("button", { name: "Pin Wat Pho" }).click();
  await page.getByText("Temple", { exact: true }).click();
  await page.getByLabel("Estimated cost (฿)").fill("300");
  await page.getByLabel("Note (optional)").fill("Wear long trousers");
  await page.getByRole("button", { name: "Save pin" }).click();

  const pins = page.getByRole("list", { name: "Pins" });
  await expect(pins.getByRole("listitem")).toHaveCount(1);
  await expect(pins).toContainText("Wat Pho");
  await expect(pins).toContainText("฿300");

  await page.reload();
  await expect(page.getByRole("list", { name: "Pins" })).toContainText("Wear long trousers");
  await search(page, "wat");
  const watPho = page.getByRole("list", { name: "Search results" }).getByRole("listitem").first();
  await expect(watPho).toContainText("Pinned");
});

test("an invalid cost shows an error and saves nothing", async ({ page }) => {
  await page.route(NOMINATIM, (route) => route.fulfill({ json: RESULTS }));
  await seedTrip(page);
  await page.goto(`/trips/${TRIP.id}`);

  await search(page, "wat");
  await page.getByRole("button", { name: "Pin Wat Arun" }).click();
  await page.getByText("Food", { exact: true }).click();
  await page.getByLabel("Estimated cost (฿)").fill("cheap");
  await page.getByRole("button", { name: "Save pin" }).click();

  await expect(page.getByText("Enter the cost in whole baht, for example 300, or leave it empty if free")).toBeVisible();
  await expect(page.getByText("No pins yet. Search for a place above and pin it.")).toBeVisible();
});

test("a failed search explains itself", async ({ page }) => {
  await page.route(NOMINATIM, (route) => route.abort("internetdisconnected"));
  await seedTrip(page);
  await page.goto(`/trips/${TRIP.id}`);

  await search(page, "wat pho");

  await expect(page.getByRole("main").getByRole("alert")).toContainText("Search isn't available right now.");
});

test("an unknown trip shows a way back", async ({ page }) => {
  await page.goto("/trips/does-not-exist");

  await expect(page.getByRole("heading", { level: 1, name: "Trip not found" })).toBeVisible();
  await page.getByRole("link", { name: "Back to your trips" }).click();
  await expect(page).toHaveURL("/trips");
});
