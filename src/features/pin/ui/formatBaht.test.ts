import { describe, expect, it } from "vitest";
import { formatBaht } from "./formatBaht";

describe("formatBaht", () => {
  it.each([
    [0, "Free"],
    [300, "฿300"],
    [1200, "฿1,200"],
    [1250000, "฿1,250,000"],
  ])("shows %i as %s", (amount, text) => {
    expect(formatBaht(amount)).toBe(text);
  });
});
