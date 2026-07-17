# HikkInn — System Architecture (Stakeholder Brief)

**Prepared:** July 2026 · **Audience:** Technical sponsors, CTO, investors (tech diligence)

![Architecture](assets/diagram-architecture.png)

## 1. Design principles

1. **Edge-first, low fixed infra** — Cloudflare global network; no always-on
   servers to patch or scale manually.
2. **Two audiences, one app** — operator console + tourist storefront share one
   Next.js codebase and one API surface (role-based).
3. **Real-time is a first-class primitive** — dispatch state lives in Durable
   Objects with WebSocket Hibernation, not polled REST.
4. **AI is grounded, never hallucinated** — the planner only recommends items
   that exist in the live catalog (RAG + sourceId tagging).
5. **Asset-light marketplace** — we don't own rooms, cars, or aircraft; we
   connect supply to demand and take a fee.

## 2. Component map

| Layer | Technology | Responsibility |
|---|---|---|
| Tourist & Admin UI | **Next.js** (App Router) | Storefront + operator console, SSR/ISR |
| Hosting | **Cloudflare Pages** | Global edge deploy, rollbacks |
| APIs / Auth / Payments | **Cloudflare Workers** | Business logic, integrations |
| Relational data | **PostgreSQL** (Hyperdrive/D1) | Catalog, bookings, orders, users |
| Real-time state | **Durable Objects** | Per-order dispatch coordination, WS |
| AI | **Workers AI + Vectorize** | Itinerary generation over catalog (RAG) |
| Driver app | **React Native / Flutter** | GPS, availability, job accept |
| Payments | **JazzCash / Easypaisa / Stripe** | PKR + int'l rails (integration hooks) |

## 3. Real-time dispatch (core innovation)

![Dispatch flow](assets/diagram-dispatch.png)

A Durable Object per active order coordinates tourist + driver + admin sockets.
Matching = nearest **available** driver within radius (haversine), ETA at
mountain-effective speed (~30 km/h), surge from demand ratio (capped 2.5×).
Validated in **Spike A**: 11 logic assertions + 5 WS round-trip checks passed;
match <2s, ETA accurate to ~1.8 km / 4 min.

## 4. Data flow (booking a trip)

```
Tourist app → Workers API → Postgres (reserve inventory)
    → Durable Object (if live: dispatch coordinator)
    → Driver companion app (WS push) → status board (admin)
AI planner: Workers AI → Vectorize retrieve (catalog) → grounded itinerary
```

## 5. Why this stack (risk-reduced)

- **Proven patterns:** foodpanda (3-sided PK marketplace), Airlift (prepackaged
  q-commerce — cautionary tale), Blade (asset-light charter), Uber (surge).
- **No vendor lock on logic:** dispatch logic is pure functions, portable to a
  Cloudflare DO or any WS server (Spike A ran identically on a local Node WS).
- **Offline tolerance designed in:** northern connectivity is patchy; WS
  queue+retry + DO hibernation handle it.

## 6. Open technical decisions (need sponsor input)

- Driver app: React Native vs Flutter vs PWA-for-MVP?
- Auth: build vs Cloudflare Access / Auth0 / Supabase?
- Real carrier API integration (PIA/AirSial) now or stub?
- Postgres hosting: Cloudflare Hyperdrive vs managed PG (Supabase/Neon)?

> Full spike evidence: `spike/a-dispatch/RESULT.md`, `spike/c-rag/RESULT.md`.
> Tech research: `docs/research/tech-landscape.md`.
