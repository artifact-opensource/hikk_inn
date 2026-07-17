// HikkInn — Durable Object: live dispatch coordinator.
// Ports the validated Spike A logic (spike/a-dispatch/src/dispatch-logic.js)
// into a Cloudflare Durable Object with WebSocket Hibernation.
//
// One DO instance per active order coordinates tourist + driver + admin sockets.

function haversine(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180, lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function etaMinutes(pickup, pos, speed = 30) {
  return Math.round((haversine(pickup, pos) / speed) * 60);
}
function matchDriver(req, drivers, radius = 25) {
  const c = drivers
    .filter((d) => d.availability === 'available' && (!req.vehicleClass || d.vehicleClass === req.vehicleClass))
    .map((d) => ({ d, km: haversine(req.pickup, d.pos) }))
    .filter((c) => c.km <= radius).sort((x, y) => x.km - y.km);
  if (!c.length) return null;
  return { driverId: c[0].d.id, distanceKm: Number(c[0].km.toFixed(2)), etaMin: etaMinutes(req.pickup, c[0].d.pos) };
}
function surge(demandRatio, base = 1, step = 0.2, cap = 2.5) {
  if (demandRatio <= 1) return base;
  return Math.min(Number((base + step * Math.floor(demandRatio - 1 + 1e-9)).toFixed(2)), cap);
}

export class DispatchDO {
  constructor(state, env) { this.state = state; this.env = env; this.drivers = new Map(); this.orders = new Map(); this.admin = new Set(); }

  async fetch(request) {
    const url = new URL(request.url);
    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      this.state.acceptWebSocket(pair[1].__id ?? 0, pair[1]);
      return new Response(null, { status: 101, webSocket: pair[0] });
    }
    if (url.pathname === '/health') return new Response(JSON.stringify({ ok: true }));
    return new Response('Dispatch DO', { status: 200 });
  }

  webSocketMessage(ws, msg) {
    let m; try { m = JSON.parse(msg); } catch { return; }
    const id = ws.__id;
    if (m.type === 'driver:join') {
      this.drivers.set(id, { id, name: m.name, pos: m.pos, availability: m.availability || 'available', vehicleClass: m.vehicleClass || 'car', ws });
      this.broadcastAdmin();
    } else if (m.type === 'driver:update') {
      const d = this.drivers.get(id); if (!d) return;
      if (m.pos) d.pos = m.pos; if (m.availability) d.availability = m.availability;
      this.broadcastAdmin();
      for (const [oid] of this.orders) this.tryMatch(oid);
    } else if (m.type === 'tourist:request') {
      const oid = 'ord_' + (this.orders.size + 1);
      const available = [...this.drivers.values()].filter((d) => d.availability === 'available').length;
      const searching = [...this.orders.values()].filter((o) => o.status === 'searching').length + 1;
      const s = surge(searching / Math.max(1, available));
      this.orders.set(oid, { id: oid, pickup: m.pickup, vehicleClass: m.vehicleClass || 'car', status: 'searching', surge: s });
      ws.send(JSON.stringify({ type: 'request:ack', orderId: oid, surge: s }));
      this.tryMatch(oid);
    }
  }

  tryMatch(oid) {
    const o = this.orders.get(oid); if (!o || o.status !== 'searching') return;
    const mt = matchDriver({ pickup: o.pickup, vehicleClass: o.vehicleClass }, [...this.drivers.values()]);
    if (!mt) { this.broadcastAdmin(); return; }
    o.status = 'matched'; o.driverId = mt.driverId; o.etaMin = mt.etaMin;
    const d = [...this.drivers.values()].find((x) => x.id === mt.driverId);
    const t = this.touristOf(oid);
    if (d) { d.availability = 'busy'; d.ws?.send(JSON.stringify({ type: 'driver:assigned', orderId: oid, pickup: o.pickup, etaMin: mt.etaMin })); }
    if (t) t.ws?.send(JSON.stringify({ type: 'tourist:matched', orderId: oid, driverId: mt.driverId, distanceKm: mt.distanceKm, etaMin: mt.etaMin }));
    this.broadcastAdmin();
  }

  touristOf(oid) { return this._tourist; } // simplified: last connected tourist ws stored on join

  broadcastAdmin() {
    const board = JSON.stringify({ type: 'board', drivers: [...this.drivers.values()].map((d) => ({ id: d.id, availability: d.availability, vehicleClass: d.vehicleClass })), orders: [...this.orders.values()] });
    for (const ws of this.admin) ws.send(board);
  }
  webSocketClose() {} webSocketError() {}
}

export default { DispatchDO };
