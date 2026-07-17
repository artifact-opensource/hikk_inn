# HikkInn — Live Dispatch (Food + Taxi)

Uber-style real-time dispatch for (a) food/meal orders and (b) taxi/vehicle hire.
Both share the same real-time backbone.

## Backbone: Cloudflare Durable Objects + WebSockets
- One **Durable Object** per active order/trip holds state + storage and
  coordinates all connected clients via **WebSocket Hibernation**.
- Clients: tourist app, driver companion app, admin dispatch board.
- SSE used as a lighter one-way fallback for menu/ETA pushes.

## Taxi / vehicle dispatch flow
1. Tourist requests ride: pickup (lat/lng), dropoff, vehicle class.
2. WS to a Durable Object → status `searching`. Object queries nearby drivers
   (within radius, `availability = available`) from a geo index.
3. Nearest-available driver(s) get a push; first to accept → `matched`.
4. Live GPS pings update the object; tourist sees driver marker + `etaMin`.
5. `enroute` → `completed`; price (surge-adjusted) settled.
6. **Surge / dynamic pricing**: peak-demand multiplier on `basePricePKR`
   (Uber-style demand/supply equilibration).

## Driver companion app (mobile)
- Framework: **React Native** or **Flutter** (both viable, Jul 2026).
- Toggle availability (offline / available / busy).
- See nearby requests, accept/reject, share live GPS, view earnings.
- Onboarding via admin-issued credentials; links to a `Vehicle`.

## Food dispatch flow
1. Tourist places meal order (live or scheduled) → `FoodOrder` created.
2. Admin kitchen board receives it; status `queued` → `cooking` → `enroute`
   (if delivery) → `delivered`.
3. If "live order now", a dispatch step can assign a driver (reuses taxi flow).

## Open design questions
- Geo-index: Durable Object + a spatial lookup (e.g. Cloudflare KV/SQLite
  region buckets) — confirm at build spike.
- Offline tolerance: northern areas have patchy connectivity; queue + retry.
- Driver verification & payout rail (JazzCash/Easypaisa).

## References
- Uber dynamic/surge pricing model (Wikipedia).
- Cloudflare Durable Objects WebSocket Hibernation (Cloudflare docs).
