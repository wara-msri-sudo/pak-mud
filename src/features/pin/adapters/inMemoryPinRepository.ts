import type { PinRepository } from "../application/pinRepository";
import type { Pin } from "../domain/pin";

/** Keeps pins in memory. Used by tests. */
export class InMemoryPinRepository implements PinRepository {
  private pins: Pin[];

  constructor(initialPins: readonly Pin[] = []) {
    this.pins = [...initialPins];
  }

  async listByTrip(tripId: string): Promise<Pin[]> {
    return this.pins.filter((pin) => pin.tripId === tripId);
  }

  async save(pin: Pin): Promise<void> {
    this.pins = [...this.pins.filter((existing) => existing.id !== pin.id), pin];
  }
}
