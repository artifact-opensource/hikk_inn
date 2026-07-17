# HikkInn — Recommended Architecture (2026)

> Source: `docs/research/tech-landscape.md` (Cloudflare, Next.js, Wikipedia —
> loaded Jul 2026).

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Customer + Admin web | **Next.js** (App Router) | One app, role-based views; SSR/ISR. |
| Hosting | **Cloudflare Pages** | Global edge, Git deploy, rollbacks. |
| Serverless APIs | **Cloudflare Workers** | Business logic, auth, payments hooks. |
| Relational DB | **PostgreSQL** (via Cloudflare Hyperdrive / D1) | Catalog, bookings, orders. |
| Real-time state | **Cloudflare Durable Objects** | WebSocket Hibernation — backbone for live dispatch. |
| AI | **Workers AI + Vectorize** | RAG over HikkInn catalog for itinerary gen. |
| Driver companion app | **React Native** or **Flutter** | GPS pings, availability toggle, job accept. |

## Why Durable Objects
Durable Objects combine compute + storage with a globally-unique identity and
**WebSocket Hibernation** — the canonical Cloudflare primitive for coordinating
many concurrent client connections (rider app + driver app + dispatcher) on a
single stateful object. Used for: live order tracking, driver dispatch, chat.

## Transport for live features
- **WebSockets** (primary, via Durable Objects) for driver/customer live state.
- **SSE** (Server-Sent Events) as a lighter fallback for one-way menu/ETA pushes.

## Real-time building blocks
1. **Live food ordering** — catalog/availability from Postgres pushed via
   SSE/WS; finite per-meal inventory windows (breakfast/lunch/dinner caps) →
   batch/prepackaged fulfillment (Airlift-style, not made-to-order).
2. **Live taxi dispatch** — driver app holds persistent WS to a Durable Object
   per active trip; GPS pings update position; nearest-available matching;
   dynamic/surge pricing for peak demand.
3. **Charter marketplace** — asset-light model (Blade Air Mobility analogue):
   sell by-the-seat + full charter + crowdsourced empty-seat fill across
   helicopter / Cessna-class fixed-wing / ATV ground excursions.
4. **AI customization** — LLM itinerary planner (Workers AI) retrieves from a
   Vectorize index of HikkInn's own catalog via RAG; Durable Objects hold
   conversational state per traveler.

## Competitive references
- **foodpanda** — three-sided marketplace (customer/vendor/rider); present in
  Pakistan.
- **Airlift** — Pakistan q-commerce, sub-30-min prepackaged delivery (defunct
  2022 — cautionary tale on unit economics).
- **Blade Air Mobility** — asset-light heli/Cessna charter marketplace; closest
  template for HikkInn charter line.
- **Uber** — dynamic/surge pricing marketplace matching riders to nearby
  drivers.
