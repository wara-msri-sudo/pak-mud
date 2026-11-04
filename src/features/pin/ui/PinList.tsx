import type { Pin } from "../domain/pin";
import { categoryLabel, CATEGORY_DOT_CLASS } from "./categoryStyle";
import { formatBaht } from "./formatBaht";

export function PinList({ pins }: { pins: readonly Pin[] }) {
  if (pins.length === 0) {
    return <p className="text-muted">No pins yet. Search for a place above and pin it.</p>;
  }
  return (
    <ul aria-label="Pins" className="flex flex-col gap-3">
      {pins.map((pin) => (
        <li key={pin.id} className="card flex flex-col gap-1">
          <h3 className="font-semibold break-words">{pin.name}</h3>
          <p className="text-sm text-muted break-words">{pin.area}</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className={`size-2.5 rounded-full ${CATEGORY_DOT_CLASS[pin.category]}`} />
              {categoryLabel(pin.category)}
            </span>
            <span>{formatBaht(pin.costThb)}</span>
            {pin.openingHours && <span className="text-muted">{pin.openingHours}</span>}
          </p>
          {pin.note && <p className="text-sm break-words">{pin.note}</p>}
        </li>
      ))}
    </ul>
  );
}
