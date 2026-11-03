import { expect, test, type Page } from "@playwright/test";

const TRIPS_STORAGE_KEY = "pak-mud:trips";

type TripInput = { name: string; destination: string; startDate: string; endDate: string };

async function createTrip(page: Page, trip: TripInput) {
  await page.goto("/trips/new");
  await page.getByLabel("Trip name").fill(trip.name);
  await page.getByLabel("Destination").fill(trip.destination);
  await page.getByLabel("Start date", { exact: true }).fill(trip.startDate);
  await page.getByLabel("End date", { exact: true }).fill(trip.endDate);
  await page.getByRole("button", { name: "Create trip" }).click();
  await expect(page).toHaveURL("/trips");
}

test("a visitor creates trips and still sees them after a reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Plan a trip" }).click();
  await expect(page.getByRole("link", { name: "Create your first trip" })).toBeVisible();

  await createTrip(page, { name: "Islands", destination: "Krabi", startDate: "10/01/2027", endDate: "14/01/2027" });
  await createTrip(page, {
    name: "Northern loop",
    destination: "Chiang Mai",
    startDate: "01/12/2026",
    endDate: "05/12/2026",
  });

  await page.reload();
  const items = page.getByRole("listitem");
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toContainText("Northern loop");
  await expect(items.nth(0)).toContainText("01/12/2026 – 05/12/2026 · 5 days");
  await expect(items.nth(1)).toContainText("Islands");
});

test("an invalid form shows errors and saves nothing", async ({ page }) => {
  await page.goto("/trips/new");
  await page.getByLabel("Start date", { exact: true }).fill("05/12/2026");
  await page.getByLabel("End date", { exact: true }).fill("01/12/2026");
  await page.getByRole("button", { name: "Create trip" }).click();

  await expect(page.getByText("Enter a trip name")).toBeVisible();
  await expect(page.getByText("Enter a destination")).toBeVisible();
  await expect(page.getByText("End date must be on or after the start date")).toBeVisible();
  await expect(page).toHaveURL("/trips/new");
  expect(await page.evaluate((key) => localStorage.getItem(key), TRIPS_STORAGE_KEY)).toBeNull();
});

test("corrupt saved data shows a notice instead of crashing", async ({ page }) => {
  await page.goto("/trips");
  await page.evaluate((key) => localStorage.setItem(key, "{not json"), TRIPS_STORAGE_KEY);

  await page.reload();

  await expect(page.getByRole("heading", { name: "Your trips" })).toBeVisible();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("We couldn't read your saved trips.");
});

test("the header band offers a new trip and a way back", async ({ page }) => {
  await page.goto("/trips");
  await page.getByRole("banner").getByRole("link", { name: "New trip" }).click();
  await expect(page).toHaveURL("/trips/new");

  await page.getByRole("link", { name: "Back to trips" }).click();
  await expect(page).toHaveURL("/trips");
});

test("a trip saved before dd/mm/yyyy still shows, in the new format", async ({ page }) => {
  await page.goto("/trips");
  await page.evaluate((key) => {
    const trip = { id: "old", name: "Old trip", destination: "Ayutthaya", startDate: "2026-12-01",
      endDate: "2026-12-02", createdAt: "2026-11-01T00:00:00.000Z" };
    localStorage.setItem(key, JSON.stringify({ schemaVersion: 1, trips: [trip] }));
  }, TRIPS_STORAGE_KEY);

  await page.reload();

  await expect(page.getByRole("listitem")).toContainText("01/12/2026 – 02/12/2026 · 2 days");
});

test("the calendar button fills the date as dd/mm/yyyy", async ({ page }) => {
  await page.goto("/trips/new");
  await page.getByRole("button", { name: "Choose start date" }).click();
  await page.locator('input[type="date"]').first().fill("2026-12-24");

  await expect(page.getByLabel("Start date", { exact: true })).toHaveValue("24/12/2026");
});
