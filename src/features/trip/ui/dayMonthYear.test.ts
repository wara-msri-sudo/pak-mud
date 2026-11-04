import { describe, expect, it } from "vitest";
import { formatDayMonthYear, parseDayMonthYear } from "./dayMonthYear";

describe("formatDayMonthYear", () => {
  it("writes an ISO date as dd/mm/yyyy", () => {
    expect(formatDayMonthYear("2026-12-01")).toBe("01/12/2026");
  });
});

describe("parseDayMonthYear", () => {
  it.each([
    ["01/12/2026", "2026-12-01"],
    ["1/12/2026", "2026-12-01"],
    [" 5/1/2027 ", "2027-01-05"],
    ["29/02/2028", "2028-02-29"],
    ["01.12.2026", "2026-12-01"],
    ["01-12-2026", "2026-12-01"],
  ])("reads %j as %s", (text, iso) => {
    expect(parseDayMonthYear(text)).toBe(iso);
  });

  it.each(["", "abc", "31/02/2027", "12/31/2026", "01/12/26", "2026-12-01"])(
    "returns null for %j",
    (text) => {
      expect(parseDayMonthYear(text)).toBeNull();
    },
  );
});
