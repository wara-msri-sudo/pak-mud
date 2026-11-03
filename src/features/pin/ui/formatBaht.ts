const bahtFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** Whole Thai baht for display: "฿1,200", or "Free" for 0. */
export function formatBaht(amountThb: number): string {
  return amountThb === 0 ? "Free" : `฿${bahtFormat.format(amountThb)}`;
}
