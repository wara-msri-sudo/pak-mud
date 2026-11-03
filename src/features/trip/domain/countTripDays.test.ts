import { describe, expect, it } from "vitest";
import { countTripDays, isIsoDate } from "./countTripDays";

describe("countTripDays", () => {
  it("counts a single-day trip as one day", () => {
    expect(countTripDays("2026-12-01", "2026-12-01")).toBe(1);
  });

  it("counts both the start and end day", () => {
    expect(countTripDays("2026-12-01", "2026-12-05")).toBe(5);
  });

  it("counts across a month boundary", () => {
    expect(countTripDays("2026-12-30", "2027-01-02")).toBe(4);
  });

  it("rejects an end date before the start date", () => {
    expect(() => countTripDays("2026-12-05", "2026-12-01")).toThrow(
      "End date must not be before start date",
    );
  });

  it("rejects a date that is not in YYYY-MM-DD form", () => {
    expect(() => countTripDays("01/12/2026", "2026-12-05")).toThrow(
      "Invalid date: 01/12/2026",
    );
  });
});

describe("isIsoDate", () => {
  it.each(["2026-12-01", "2028-02-29"])("accepts %s", (value) => {
    expect(isIsoDate(value)).toBe(true);
  });

  it.each(["", "2026-2-1", "01/12/2026", "2026-02-30", "2027-02-29"])(
    "rejects %j",
    (value) => {
      expect(isIsoDate(value)).toBe(false);
    },
  );
});
