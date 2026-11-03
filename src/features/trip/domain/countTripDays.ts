const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function parseIsoDate(isoDate: string): number {
  const timestamp = Date.parse(`${isoDate}T00:00:00Z`);
  if (!ISO_DATE_PATTERN.test(isoDate) || Number.isNaN(timestamp)) {
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
