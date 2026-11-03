import type { TripRepository } from "../application/tripRepository";
import type { Trip } from "../domain/trip";

/** Keeps trips in memory. Used by tests and as a stand-in when no storage is wired. */
export class InMemoryTripRepository implements TripRepository {
  private trips: Trip[];

  constructor(initialTrips: readonly Trip[] = []) {
    this.trips = [...initialTrips];
  }

  async list(): Promise<Trip[]> {
    return [...this.trips];
  }

  async save(trip: Trip): Promise<void> {
    this.trips = [...this.trips.filter((existing) => existing.id !== trip.id), trip];
  }
}
