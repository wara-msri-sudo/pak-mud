import { expect, test } from "@playwright/test";

test("home page introduces Pak Mud", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Pak Mud");
  await expect(
    page.getByRole("heading", { level: 1, name: "Plan your Thailand trip" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Pak Mud" })).toBeVisible();
});
