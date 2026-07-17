# HikkInn — MVP Scope

> Goal of MVP: prove a tourist can, in ONE session on ONE platform, book a
> **stay + per-meal plan + a live taxi + one charter/activity**, while an
> operator runs it from the admin side. Manual-system replacement, end to end,
> on a narrow slice of North Pakistan.

## In scope (MVP)
- **Regions**: Hunza + Skardu only (2 properties each, seeded).
- **Admin**: property + room types + menu/meals (per-day/per-meal, prepackaged
  caps) + vehicle/fleet + driver onboarding + bookings/orders/dispatch board.
- **Tourist web**: browse properties → book room → select meals (per day/meal)
  → request live taxi (Uber-style) → book one charter/activity.
- **Live dispatch**: taxi request → nearest available driver (companion app or
  simulator) → ETA + status. Food "live order" reuses dispatch.
- **Payments**: integration hook only (JazzCash/Easypaisa/Stripe stub) — no
  real settlement in MVP.
- **AI**: itinerary generator stub grounded in live catalog (RAG), edit+book.

## Out of scope (MVP, post-MVP backlog)
- Real payment settlement & refunds.
- Native iOS/Android tourist app (web-first MVP; driver app is the only native
  target, and even that can be a PWA in MVP).
- Full aircraft/ATV charter marketplace network (MVP = 1–2 vetted operators).
- Multi-region scale, i18n (Urdu later), offline-first sync.
- Official gov't arrival-data integrations.

## Phasing
- **P0 — Foundation**: repo, schema, Next.js + Cloudflare Pages deploy, auth
  (admin/tourist/driver roles), Postgres schema + seed (2 regions, 4 props).
- **P1 — Stay + Meals**: property/room booking + per-meal selection + admin
  menu/caps + food order board.
- **P2 — Live dispatch**: Durable Objects WS dispatch for taxi + driver
  companion (PWA) + surge price stub.
- **P3 — Charter/Activity**: vehicle/aircraft catalog + seat/full/crowdsource
  booking + admin ops.
- **P4 — AI itinerary**: RAG planner over live catalog.

## Success metrics (MVP)
- Tourist completes stay+meal+live-taxi+1 charter in one session (tested E2E).
- Operator moves a property from phone/paper to full digital inventory + dispatch.
- Live dispatch latency < 2s driver←→tourist on WS.
- Zero hallucinated inventory in AI planner (every block resolves to real item).

## Open decisions (need your call)
- Driver companion: React Native vs Flutter vs PWA-for-MVP?
- Auth: build vs Cloudflare Access / Auth0 / Supabase?
- Real carrier integration (PIA/AirSial) now or stub?
