# Research: Technology & Competitive Landscape (Jul 2026)

> Subagent research deliverable. Search engines bot-blocked → Cloudflare/Next.js
> docs + Wikipedia direct. **[NO DATA FOUND]** = unverified.

## 1. Two-sided marketplace architecture
- **Next.js** (App Router) customer + admin; deploy to **Cloudflare Pages**.
- **Cloudflare Workers** for APIs; **PostgreSQL** (Hyperdrive/D1) for data.
- **Cloudflare Durable Objects** for stateful real-time (WebSocket Hibernation)
  — backbone for live dispatch. SQLite-backed DOs GA on Free plan (Jul 2026).
- Sources: nextjs.org/docs; developers.cloudflare.com/{pages,workers,durable-objects}.

## 2. Uber-style live dispatch
- **WebSockets** (DO Hibernation) primary; **SSE** fallback.
- Companion driver app: **React Native** (0.86.0, Jun 2026) or **Flutter**
  (3.44.0, May 2026).
- Uber = two-sided marketplace w/ **dynamic/surge pricing** to balance
  supply/demand. Internal matching internals **[NO DATA FOUND]**.
- Sources: Wikipedia (Server-sent_events, Uber, Dynamic_pricing); Wikipedia
  (React_Native, Flutter); Cloudflare DO docs.

## 3. Real-time food ordering
- **foodpanda** — three-sided marketplace (customer/vendor/rider); present in
  Pakistan. Platform live-menu internals **[NO DATA FOUND]**.
- **Airlift** — Pakistan q-commerce, sub-30-min prepackaged delivery; **closed
  13 Jul 2022 (insolvency)** — cautionary tale on unit economics.
- HikkInn model: live menu from Postgres pushed via SSE/WS; finite per-meal
  inventory windows → batch/prepackaged (Airlift-style, not made-to-order).
- Sources: Wikipedia (Foodpanda, Airlift_Technologies).

## 4. Charter marketplace (Cessna/Heli/ATV)
- **Air charter** = renting entire aircraft (vs seat). Source: Wikipedia
  (Air_charter).
- **Blade Air Mobility** (Nasdaq: BLDE) — asset-light: partners with vetted
  operators, sells **by-the-seat + full charter + crowdsourced fill** across
  helicopters + fixed-wing (Cessna-class); UberChopper/Uber Air proof-of-concept
  (Cessna Grand Caravan seat-booking via ride-hail). Closest HikkInn template.
- ATV real-time two-sided marketplace **[NO DATA FOUND]** (typically fixed
  hourly/day rental).
- Sources: Wikipedia (Blade_Air_Mobility, Air_charter).

## 5. 2025–2026 AI travel customization
- **Generative AI / LLMs** for itinerary generation.
- **RAG** — retrieve from external/data sources before responding; keeps LLM
  grounded in domain-specific/updated info (chunking, hybrid search; risk: RAG
  poisoning). Source: Wikipedia (Generative_AI, Retrieval-augmented_generation).
- Cloudflare-native: **Workers AI** + **Vectorize** (vector DB for semantic
  search) + Durable Objects for state. Source: Cloudflare Workers docs.
- Named 2025–2026 "AI travel agent" benchmarks **[NO DATA FOUND]**.

## Source list
Cloudflare (Durable Objects, Pages, Workers) · Next.js Docs · Wikipedia
(PostgreSQL, React Native, Flutter, Server-sent events, Uber, Dynamic pricing,
Foodpanda, Airlift Technologies, Air charter, Blade Air Mobility, Generative
AI, Retrieval-augmented generation).

## Gaps
foodpanda platform internals · Uber dispatch internals · ATV marketplace model ·
2025–26 AI travel-agent benchmarks · charter-broker Wikipedia articles (Victor
etc. absent).
