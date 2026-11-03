const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function toUtcTimestamp(isoDate: string): number | null {
  if (!ISO_DATE_PATTERN.test(isoDate)) return null;
  const timestamp = Date.parse(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(timestamp)) return null;
  // Date.parse rolls impossible days (2026-02-30) into the next month, so compare the round trip.
  const isRealCalendarDay = new Date(timestamp).toISOString().slice(0, 10) === isoDate;
  return isRealCalendarDay ? timestamp : null;
}

/** True when the value is a real calendar date written as YYYY-MM-DD. */
export function isIsoDate(value: string): boolean {
  return toUtcTimestamp(value) !== null;
}

function parseIsoDate(isoDate: string): number {
  const timestamp = toUtcTimestamp(isoDate);
  if (timestamp === null) {
    throw new Error(`Invalid date: ${isoDate}`);
  }
  return timestamp;
}

/** Number of calendar days in a trip, counting both the start and end day. */
export function countTripDays(startDate: string, endDate: string): number {
  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);
  if (end < start) {
    throw new Error("End date must not be before start date");
  }
  return Math.round((end - start) / MILLISECONDS_PER_DAY) + 1;
}
