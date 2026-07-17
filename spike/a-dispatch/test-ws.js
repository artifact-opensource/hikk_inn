// Integration test: real WS round-trip (tourist -> driver matched -> admin board).
// Run server first: node src/server.js  (background), then: node test-ws.js
const WebSocket = require('ws');
const PORT = 8787;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const events = { tourist: [], driver: [] };
  const admin = new WebSocket(`ws://localhost:${PORT}`);
  await new Promise((r) => admin.on('open', r));
  admin.send(JSON.stringify({ type: 'admin:join' }));

  const driver = new WebSocket(`ws://localhost:${PORT}`);
  await new Promise((r) => driver.on('open', r));
  driver.send(JSON.stringify({ type: 'driver:join', name: 'Ali-ATV',
    pos: { lat: 36.305, lng: 74.672 }, availability: 'available', vehicleClass: 'car' }));
  const dwelcome = await new Promise((r) => driver.once('message', (m) => r(JSON.parse(m))));
  console.log('  driver welcome:', dwelcome.type, dwelcome.id);

  const tourist = new WebSocket(`ws://localhost:${PORT}`);
  await new Promise((r) => tourist.on('open', r));
  tourist.on('message', (m) => events.tourist.push(JSON.parse(m)));
  driver.on('message', (m) => events.driver.push(JSON.parse(m)));

  tourist.send(JSON.stringify({ type: 'tourist:request',
    pickup: { lat: 36.317, lng: 74.658 }, vehicleClass: 'car' }));

  await sleep(400);
  const matched = events.tourist.find((e) => e.type === 'tourist:matched');
  const assigned = events.driver.find((e) => e.type === 'driver:assigned');

  let pass = 0;
  const ok = (n, c) => { if (!c) { console.error('FAIL:', n); process.exit(1); } console.log('  ✓', n); pass++; };
  ok('tourist got matched event', !!matched);
  ok('matched has driverId + etaMin', matched && matched.driverId && typeof matched.etaMin === 'number');
  ok('driver got assigned event', !!assigned);
  ok('eta is plausible (1-15 min)', matched && matched.etaMin >= 1 && matched.etaMin <= 15);
  ok('distanceKm reported', matched && typeof matched.distanceKm === 'number');

  console.log(`\nWS round-trip OK (${pass} checks). touristMatched=${JSON.stringify(matched)}`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
