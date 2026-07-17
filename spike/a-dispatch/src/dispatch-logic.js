// HikkInn Spike A — dispatch core logic (framework-agnostic, testable).
// Mirrors what the Cloudflare Durable Object will do. Pure functions so we can
// unit-test matching/ETA without a live edge.

// Haversine distance in km between two {lat,lng} points.
function haversine(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Straight-line ETA at avg speed (km/h). Mountain roads ~30km/h effective.
function etaMinutes(pickup, driverPos, speedKmh = 30) {
  const km = haversine(pickup, driverPos);
  return Math.round((km / speedKmh) * 60);
}

// Match a ride request to the nearest AVAILABLE driver within radiusKm.
// drivers: [{id, pos:{lat,lng}, availability:'available'|'busy'|'offline', vehicleClass}]
// request: {pickup:{lat,lng}, vehicleClass}
function matchDriver(request, drivers, radiusKm = 25) {
  const candidates = drivers
    .filter(
      (d) =>
        d.availability === 'available' &&
        (!request.vehicleClass || d.vehicleClass === request.vehicleClass)
    )
    .map((d) => ({ driver: d, km: haversine(request.pickup, d.pos) }))
    .filter((c) => c.km <= radiusKm)
    .sort((x, y) => x.km - y.km);
  if (candidates.length === 0) return null;
  const best = candidates[0];
  return {
    driverId: best.driver.id,
    distanceKm: Number(best.km.toFixed(2)),
    etaMin: etaMinutes(request.pickup, best.driver.pos),
  };
}

// Surge multiplier: 1.0 base, +0.2 per unavailable-tier of demand.
// demandRatio = waitingRequests / availableDrivers (>=1 triggers surge).
function surgeMultiplier(demandRatio, base = 1.0, step = 0.2, cap = 2.5) {
  if (demandRatio <= 1) return base;
  const m = base + step * Math.floor(demandRatio - 1 + 1e-9);
  return Math.min(Number(m.toFixed(2)), cap);
}

module.exports = { haversine, etaMinutes, matchDriver, surgeMultiplier };
