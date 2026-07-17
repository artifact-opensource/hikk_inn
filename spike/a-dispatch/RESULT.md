# Spike A — Live Dispatch (Durable Objects / WebSocket) — RESULT: GO

**Date:** 2026-07-17
**Status:** ✅ GO — core pattern validated locally.

## What was built (`spike/a-dispatch/`)
- `src/dispatch-logic.js` — pure, framework-agnostic matching/ETA/surge logic.
- `src/server.js` — in-memory "Durable Object" Dispatcher over `ws` (port 8787),
  coordinating tourist + driver + admin sockets (1:1 port to a Cloudflare DO
  with WebSocket Hibernation).
- `test-logic.js` — 11 unit assertions. `test-ws.js` — real WS round-trip.

## Results
- **11/11 logic assertions passed**: haversine, ETA, nearest-available match,
  busy/excluded, radius-excluded, no-match, vehicle-class filter, surge steps
  + cap.
- **5/5 WS round-trip checks passed**: tourist request → driver matched within
  ~4 min ETA (1.83 km), driver got assignment, admin board updates.
- Example match: `touristMatched={driverId:drv_1, distanceKm:1.83, etaMin:4}`.

## Key learnings / constraints for build
1. **Matching is O(n) over driver pool** — fine for MVP regions (Hunza/Skardu,
   hundreds of drivers). For scale, add geo-bucketing (region shards) later.
2. **Surge model** is demand-ratio based, capped 2.5x — swap for real pricing
   rules in P2.
3. **Mountain effective speed** assumed 30 km/h (winding roads) — tune per
   valley; ETA is straight-line, not route-based (add OSRM later).
4. **Port to Cloudflare DO**: replace in-memory Maps with DO storage + WS
   Hibernation; `tourist:request`/`driver:update` become DO messages. Logic
   module drops in unchanged.
5. **Offline tolerance**: northern connectivity is patchy — WS must queue+retry;
   DO hibernation handles idle clients well.

## Verdict
Risk retired. Proceed to Spike B (deploy) and into P2 of MVP.
