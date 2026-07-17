// P0 seed — 2 regions (Hunza, Skardu), 4 properties, sample menus & fleet.
// Mirrors domain-model.md. Used by P1 to populate Postgres.
// Coordinates are real (Karimabad/Hunza ~36.317,74.658; Skardu ~35.888,75.426).

import type { Region } from './schema';

export interface SeedProperty {
  id: string; ownerId: string; type: 'guest_house' | 'hotel' | 'resort';
  name: string; region: Region; lat: number; lng: number;
  amenities: string[]; rooms: { name: string; capacity: number; price: number; inventory: number }[];
  menu: { meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'; name: string; price: number; prepackaged: boolean; cap: number }[];
}
export interface SeedDriver { id: string; name: string; region: Region; lat: number; lng: number; vehicleClass: 'car' | 'atv'; plate: string; }

export const SEED_OWNER = { id: 'op_1', role: 'operator' as const, name: 'Eagle Nest Mgmt' };

export const SEED_PROPERTIES: SeedProperty[] = [
  {
    id: 'prop_eagle', ownerId: 'op_1', type: 'guest_house', name: 'Eagle Nest Guest House', region: 'Hunza',
    lat: 36.317, lng: 74.658, amenities: ['wifi', 'heating', 'mountain-view', 'breakfast-available'],
    rooms: [
      { name: 'Deluxe King', capacity: 2, price: 6500, inventory: 8 },
      { name: 'Family Suite', capacity: 4, price: 11000, inventory: 3 },
    ],
    menu: [
      { meal_type: 'breakfast', name: 'Local breakfast platter', price: 500, prepackaged: true, cap: 40 },
      { meal_type: 'dinner', name: 'Hunza trout dinner', price: 1200, prepackaged: true, cap: 25 },
    ],
  },
  {
    id: 'prop_altit', ownerId: 'op_1', type: 'guest_house', name: 'Altit View Homestay', region: 'Hunza',
    lat: 36.305, lng: 74.672, amenities: ['wifi', 'garden', 'home-cooking'],
    rooms: [{ name: 'Twin Room', capacity: 2, price: 4000, inventory: 6 }],
    menu: [{ meal_type: 'lunch', name: 'Walnut & apricot bowl', price: 700, prepackaged: true, cap: 20 }],
  },
  {
    id: 'prop_shangrila', ownerId: 'op_1', type: 'resort', name: 'Shangrila Resort', region: 'Skardu',
    lat: 35.888, lng: 75.426, amenities: ['lake-view', 'spa', 'restaurant', 'heating'],
    rooms: [
      { name: 'Lake View', capacity: 2, price: 18000, inventory: 12 },
      { name: 'Premium Suite', capacity: 3, price: 28000, inventory: 4 },
    ],
    menu: [
      { meal_type: 'breakfast', name: 'Continental breakfast', price: 1500, prepackaged: true, cap: 60 },
      { meal_type: 'dinner', name: 'Grilled trout & greens', price: 2200, prepackaged: true, cap: 40 },
    ],
  },
  {
    id: 'prop_k2', ownerId: 'op_1', type: 'hotel', name: 'K2 Motel', region: 'Skardu',
    lat: 35.895, lng: 75.430, amenities: ['parking', 'wifi', '24x7-reception'],
    rooms: [{ name: 'Standard Double', capacity: 2, price: 7000, inventory: 20 }],
    menu: [{ meal_type: 'dinner', name: 'Local thali', price: 900, prepackaged: true, cap: 50 }],
  },
];

export const SEED_DRIVERS: SeedDriver[] = [
  { id: 'drv_ali', name: 'Ali', region: 'Hunza', lat: 36.305, lng: 74.672, vehicleClass: 'car', plate: 'GB-1234' },
  { id: 'drv_sara', name: 'Sara', region: 'Hunza', lat: 36.388, lng: 74.866, vehicleClass: 'atv', plate: 'GB-ATV7' },
  { id: 'drv_kam', name: 'Kamran', region: 'Skardu', lat: 35.888, lng: 75.426, vehicleClass: 'car', plate: 'SKD-88' },
];
