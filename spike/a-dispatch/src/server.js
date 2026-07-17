// HikkInn Spike A — local WebSocket dispatch server. One in-memory "Durable
// Object" Dispatcher coordinating tourist + driver + admin sockets. Ports 1:1
// to a Cloudflare Durable Object with WebSocket Hibernation.

const { WebSocketServer } = require('ws');
const { matchDriver, surgeMultiplier } = require('./dispatch-logic');

const state = {
  drivers: new Map(),   // id -> {id, ws, name, pos, availability, vehicleClass}
  tourists: new Map(),  // id -> {id, ws, pickup}
  admin: new Set(),     // ws[]
  orders: new Map(),    // orderId -> {id, touristId, vehicleClass, status, etaMin, surge}
};
let nextId = 1;
const id = (p) => `${p}_${nextId++}`;
const board = () => ({
  type: 'board',
  drivers: [...state.drivers.values()].map((d) => ({
    id: d.id, name: d.name, availability: d.availability,
    vehicleClass: d.vehicleClass, pos: d.pos,
  })),
  orders: [...state.orders.values()],
});
const broadcastAdmin = () =>
  state.admin.forEach((ws) => ws.readyState === 1 && ws.send(JSON.stringify(board())));

function assign(oid, match) {
  const o = state.orders.get(oid);
  if (!o || o.status !== 'searching') return;
  o.status = 'matched'; o.driverId = match.driverId; o.etaMin = match.etaMin;
  const d = [...state.drivers.values()].find((x) => x.id === match.driverId);
  const t = state.tourists.get(o.touristId);
  if (d) {
    d.availability = 'busy';
    d.ws.send(JSON.stringify({ type: 'driver:assigned', orderId: oid,
      pickup: t.pickup, etaMin: match.etaMin }));
  }
  if (t) t.ws.send(JSON.stringify({ type: 'tourist:matched', orderId: oid,
    driverId: match.driverId, distanceKm: match.distanceKm, etaMin: match.etaMin }));
  broadcastAdmin();
}

function tryMatch(oid) {
  const o = state.orders.get(oid);
  if (!o || o.status !== 'searching') return;
  const t = state.tourists.get(o.touristId);
  const match = matchDriver({ pickup: t.pickup, vehicleClass: o.vehicleClass },
    [...state.drivers.values()]);
  if (match) assign(oid, match);
  else broadcastAdmin();
}

const wss = new WebSocketServer({ port: 8787 });
console.log('[spike-a] dispatch WS server on ws://localhost:8787');

wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    let m; try { m = JSON.parse(raw); } catch { return; }

    if (m.type === 'admin:join') {
      state.admin.add(ws);
      ws.send(JSON.stringify(board()));
    } else if (m.type === 'driver:join') {
      const d = { id: id('drv'), ws, name: m.name || 'Driver',
        pos: m.pos, availability: m.availability || 'available',
        vehicleClass: m.vehicleClass || 'car' };
      state.drivers.set(d.id, d);
      ws.send(JSON.stringify({ type: 'driver:welcome', id: d.id }));
      broadcastAdmin();
    } else if (m.type === 'driver:update') {
      const d = [...state.drivers.values()].find((x) => x.ws === ws);
      if (!d) return;
      if (m.pos) d.pos = m.pos;
      if (m.availability) d.availability = m.availability;
      broadcastAdmin();
      // retry any searching orders against the now-updated driver pool
      for (const [oid] of state.orders) tryMatch(oid);
    } else if (m.type === 'tourist:request') {
      const t = { id: id('tui'), ws, pickup: m.pickup };
      state.tourists.set(t.id, t);
      const oid = id('ord');
      const available = [...state.drivers.values()].filter((d) => d.availability === 'available').length;
      const searching = [...state.orders.values()].filter((o) => o.status === 'searching').length + 1;
      const demandRatio = searching / Math.max(1, available);
      const surge = surgeMultiplier(demandRatio);
      state.orders.set(oid, { id: oid, touristId: t.id,
        vehicleClass: m.vehicleClass || 'car', status: 'searching',
        etaMin: null, surge });
      ws.send(JSON.stringify({ type: 'request:ack', orderId: oid, surge }));
      tryMatch(oid);
      if (state.orders.get(oid).status === 'searching')
        ws.send(JSON.stringify({ type: 'request:searching' }));
    }
  });

  ws.on('close', () => {
    for (const [k, d] of state.drivers) if (d.ws === ws) state.drivers.delete(k);
    for (const [k, t] of state.tourists) if (t.ws === ws) state.tourists.delete(k);
    state.admin.delete(ws);
    broadcastAdmin();
  });
});

module.exports = { wss, state };
if (require.main === module) { /* server runs on import for tests */ }
