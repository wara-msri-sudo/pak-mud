import { countTripDays } from "../domain/countTripDays";
import { formatDayMonthYear } from "./dayMonthYear";

/** For example "01/12/2026 – 05/12/2026 · 5 days", or "01/12/2026 · 1 day". */
export function formatTripDates(startDate: string, endDate: string): string {
  const days = countTripDays(startDate, endDate);
  const range =
    startDate === endDate
      ? formatDayMonthYear(startDate)
      : `${formatDayMonthYear(startDate)} – ${formatDayMonthYear(endDate)}`;
  return `${range} · ${days} ${days === 1 ? "day" : "days"}`;
}
