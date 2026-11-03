import { isIsoDate } from "../domain/countTripDays";

/** Day first, as written in Thailand and most of the world. Separators: / . or - */
const DAY_MONTH_YEAR_PATTERN = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/;

/** "2026-12-01" -> "01/12/2026". The domain and storage keep ISO dates. */
export function formatDayMonthYear(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

/** "1/12/2026" -> "2026-12-01", or null when the text is not a real dd/mm/yyyy date. */
export function parseDayMonthYear(text: string): string | null {
  const match = DAY_MONTH_YEAR_PATTERN.exec(text.trim());
  if (!match) return null;
  const [, day, month, year] = match;
  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return isIsoDate(isoDate) ? isoDate : null;
}
