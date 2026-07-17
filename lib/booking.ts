// HikkInn booking management — booked rooms/meals/rides tracked & manageable.
// Persisted in IndexedDB (lib/agent/db) so it works offline; in P3+ the same
// shape syncs to Postgres (lib/schema.ts bookings/food_orders/ride_orders).

import { dbPut, dbGetAll, dbGet, dbDelete } from './agent/db';

export type BookingKind = 'stay' | 'meal' | 'ride' | 'charter' | 'activity';
export type BookingStatus = 'confirmed' | 'checked_in' | 'active' | 'completed' | 'cancelled' | 'modified';

export interface Booking {
  id: string;
  kind: BookingKind;
  touristId: string;
  propertyId?: string;
  roomTypeId?: string;
  label: string;          // human label e.g. "Eagle Nest — Deluxe King (Jul 20-23)"
  checkIn?: string;       // ISO date
  checkOut?: string;      // ISO date
  guests?: number;
  totalPkr: number;
  status: BookingStatus;
  createdAt: number;
  updatedAt?: number;
  note?: string;
}

export async function createBooking(b: Omit<Booking, 'createdAt' | 'status'> & { status?: BookingStatus }): Promise<Booking> {
  const full: Booking = { ...b, status: b.status ?? 'confirmed', createdAt: Date.now() };
  await dbPut('bookings', full);
  return full;
}

export async function listBookings(touristId?: string): Promise<Booking[]> {
  const all = await dbGetAll('bookings');
  return (touristId ? all.filter((x) => x.touristId === touristId) : all)
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export async function getBooking(id: string): Promise<Booking | undefined> {
  return dbGet('bookings', id);
}

export async function updateBooking(id: string, patch: Partial<Booking>): Promise<void> {
  const existing = await dbGet('bookings', id);
  if (!existing) throw new Error(`Booking ${id} not found`);
  await dbPut('bookings', { ...existing, ...patch, id, updatedAt: Date.now() });
}

export async function cancelBooking(id: string, reason?: string): Promise<void> {
  await updateBooking(id, { status: 'cancelled', note: reason });
}

// Convenience: today's active stays for an operator dashboard.
export async function activeStays(propertyId?: string): Promise<Booking[]> {
  const all = await listBookings();
  return all.filter((b) => b.kind === 'stay' && b.status !== 'cancelled' && (!propertyId || b.propertyId === propertyId));
}
