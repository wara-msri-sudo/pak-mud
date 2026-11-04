import { describe, expect, it } from "vitest";
import { formatTripDates } from "./formatTripDates";

describe("formatTripDates", () => {
  it("shows a dd/mm/yyyy range and the number of days", () => {
    expect(formatTripDates("2026-12-01", "2026-12-05")).toBe("01/12/2026 – 05/12/2026 · 5 days");
  });

  it("shows a single day once, in the singular", () => {
    expect(formatTripDates("2026-12-01", "2026-12-01")).toBe("01/12/2026 · 1 day");
  });

  it("shows a trip over New Year", () => {
    expect(formatTripDates("2026-12-30", "2027-01-02")).toBe("30/12/2026 – 02/01/2027 · 4 days");
  });
});
