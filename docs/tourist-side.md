# HikkInn — Tourist / End-User Side Specification

Used by travelers planning or undertaking a North-Pakistan trip.

## Trip customization
- **Stay**: browse properties by region (Hunza, Skardu, Swat, Naran, Chitral,
  Kumrat, Gilgit, Astore, Fairy Meadows); pick room type + dates; see live
  availability & price.
- **Meals**: per-day, per-meal selection — NOT "breakfast included". Choose
  individual meals from the live menu; opt into **prepackaged** daily plans.
  Scheduled (future day) or live (order now, kitchen fulfills).
- **Transport**:
  - On-demand taxi/vehicle hire, **Uber-style**: see drivers available in
    vicinity, request, watch ETA, pay in-app.
  - **Charter** vehicle classes: ATV, Cessna, Helicopter — book by seat, full
    charter, or join a crowdsourced fill.
- **Activities**: wind gliding, parachuting, skydiving, rafting, treks, scenic
  flights — book slots with live availability.

## AI customization assistant
- Conversational planner: "3 days in Hunza, want paragliding + local food +
  a heli sightseeing hop." → generates an **itinerary** grounded in live
  inventory (RAG over HikkInn catalog: rooms, meal caps, driver ETAs, charter
  slots). Tourist edits and books directly from the plan.

## Live features (real-time)
- Live menu refresh (SSE/WS).
- Live driver map + ETA during a ride.
- Order status for food (queued → cooking → en route → delivered).

## Account
- Profile, trip history, saved itineraries, payment methods (PKR rails),
  reviews.

## Companion driver app (separate target)
- See nearby ride requests, toggle availability, accept jobs, GPS share,
  earnings. (See `live-dispatch.md`.)
