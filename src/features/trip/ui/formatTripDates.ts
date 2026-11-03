import { countTripDays } from "../domain/countTripDays";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type CalendarDay = { year: string; month: string; day: number };

function toCalendarDay(isoDate: string): CalendarDay {
  const [year, month, day] = isoDate.split("-");
  return { year, month: MONTH_NAMES[Number(month) - 1], day: Number(day) };
}

/**
 * Built by hand rather than with Intl.formatRange, whose spacing differs between browsers.
 * For example "1–5 Dec 2026", "28 Nov – 2 Dec 2026", "30 Dec 2026 – 2 Jan 2027".
 */
function formatDateRange(startDate: string, endDate: string): string {
  const start = toCalendarDay(startDate);
  const end = toCalendarDay(endDate);
  const endText = `${end.day} ${end.month} ${end.year}`;
  if (startDate === endDate) return endText;
  if (start.year !== end.year) return `${start.day} ${start.month} ${start.year} – ${endText}`;
  if (start.month !== end.month) return `${start.day} ${start.month} – ${endText}`;
  return `${start.day}–${endText}`;
}

/** For example "1–5 Dec 2026 · 5 days". */
export function formatTripDates(startDate: string, endDate: string): string {
  const days = countTripDays(startDate, endDate);
  return `${formatDateRange(startDate, endDate)} · ${days} ${days === 1 ? "day" : "days"}`;
}
