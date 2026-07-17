// Unit tests for Spike A dispatch logic (no network). Run: node test-logic.js
const assert = require('assert');
const { haversine, etaMinutes, matchDriver, surgeMultiplier } = require('./src/dispatch-logic');

// Hunza/Karimabad area coords for realism
const KARIMABAD = { lat: 36.317, lng: 74.658 };
const ALTIT = { lat: 36.305, lng: 74.672 }; // ~1.8km away
const GULMIT = { lat: 36.388, lng: 74.866 }; // ~25km away (outside radius)

let pass = 0;
const ok = (name, cond) => { assert.ok(cond, name); console.log('  ✓', name); pass++; };

// 1. haversine sanity
ok('haversine Karimabad->Altit ~1.8km', Math.abs(haversine(KARIMABAD, ALTIT) - 1.8) < 0.5);
ok('haversine same point = 0', haversine(KARIMABAD, KARIMABAD) === 0);

// 2. ETA
ok('eta Altit->Karimabad ~4min @30km/h', etaMinutes(KARIMABAD, ALTIT) >= 3 && etaMinutes(KARIMABAD, ALTIT) <= 5);

// 3. matchDriver nearest available within radius
const drivers = [
  { id: 'd1', pos: ALTIT, availability: 'available', vehicleClass: 'car' },
  { id: 'd2', pos: GULMIT, availability: 'available', vehicleClass: 'car' }, // too far
  { id: 'd3', pos: KARIMABAD, availability: 'busy', vehicleClass: 'car' },   // busy
];
const m = matchDriver({ pickup: KARIMABAD, vehicleClass: 'car' }, drivers, 25);
ok('match picks d1 (nearest available)', m && m.driverId === 'd1');
ok('match excludes busy d3', m && m.driverId !== 'd3');
ok('match excludes far d2 (radius 25km)', m && m.driverId !== 'd2');

// 4. no available -> null
ok('no match when all offline',
  matchDriver({ pickup: KARIMABAD, vehicleClass: 'car' },
    [{ id: 'x', pos: ALTIT, availability: 'offline', vehicleClass: 'car' }], 25) === null);

// 5. vehicle class filter
ok('class filter: SUV request ignores car-only pool',
  matchDriver({ pickup: KARIMABAD, vehicleClass: 'suv' },
    [{ id: 'c', pos: ALTIT, availability: 'available', vehicleClass: 'car' }], 25) === null);

// 6. surge
ok('surge = 1.0 when demand <= supply', surgeMultiplier(0.5) === 1.0 && surgeMultiplier(1.0) === 1.0);
ok('surge steps up', surgeMultiplier(2.0) === 1.2 && surgeMultiplier(3.0) === 1.4);
ok('surge capped at 2.5', surgeMultiplier(20) === 2.5);

console.log(`\nAll ${pass} logic assertions passed.`);
