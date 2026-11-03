import { describe, expect, it } from "vitest";
import { formatTripDates } from "./formatTripDates";

describe("formatTripDates", () => {
  it("shows a range and the number of days", () => {
    expect(formatTripDates("2026-12-01", "2026-12-05")).toBe("1–5 Dec 2026 · 5 days");
  });

  it("shows a single day in the singular", () => {
    expect(formatTripDates("2026-12-01", "2026-12-01")).toBe("1 Dec 2026 · 1 day");
  });

  it("shows both months for a trip across a month end", () => {
    expect(formatTripDates("2026-11-28", "2026-12-02")).toBe("28 Nov – 2 Dec 2026 · 5 days");
  });

  it("shows both years for a trip over New Year", () => {
    expect(formatTripDates("2026-12-30", "2027-01-02")).toBe("30 Dec 2026 – 2 Jan 2027 · 4 days");
  });
});
