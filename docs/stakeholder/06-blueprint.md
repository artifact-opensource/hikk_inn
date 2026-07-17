# HikkInn — Blueprint (Phased Build Plan)

**Prepared:** July 2026 · **Audience:** Delivery team, PMO, sponsors
**Goal:** manual → automated, AI-assisted, web-hosted two-sided hospitality
platform for North Pakistan. MVP = Hunza + Skardu, one-session trip completion.

---

## 0. Guiding blueprint (one line)

> A tourist books **stay + per-meal plan + live taxi + one charter** in a single
> session; an operator runs it all from one console.

## 1. Phase map

```
P0 Foundation ──► P1 Stay+Meals ──► P2 Live Dispatch ──► P3 Charter/Activity ──► P4 AI Itinerary
   (weeks 1-3)        (4-6)             (7-9)                (10-12)              (13-15)
```

Each phase ends at a **gate** with a demo + spike/metric check.

## 2. Phase detail

### P0 — Foundation (gate: deployable skeleton)
- Repo, CI, Next.js + Cloudflare Pages pipeline (resolve Spike B build issue).
- Auth roles: tourist / operator / driver.
- Postgres schema + seed (2 regions, 4 properties, sample menus/fleet).
- Design system + wireframes (this package's assets).

### P1 — Stay + Meals (gate: book a room + meal plan)
- Property/room browsing + reservation.
- Per-day/per-meal selection; prepackaged plans; admin menu + daily caps.
- Food order board (queued → cooking → ready).

### P2 — Live Dispatch (gate: real matched ride <2s)
- Durable Object dispatch (from Spike A logic).
- Driver companion app (PWA or RN/Flutter) — GPS, availability, accept.
- Surge stub; admin dispatch board; food "order now" reuses dispatch.

### P3 — Charter / Activity (gate: book a seat + full charter)
- Vehicle/aircraft catalog (ATV, Cessna, Helicopter).
- Seat / full / crowdsource-fill booking (Blade model).
- Operator vetting (licence, insurance, safety cert).

### P4 — AI Itinerary (gate: 100% grounded plans)
- Workers AI + Vectorize RAG over live catalog.
- Conversational planner → editable → bookable itinerary.
- Grounding invariant in CI (no hallucinated items).

## 3. MVP exit criteria (definition of done)

- [ ] Tourist completes stay+meal+live-taxi+1 charter in one E2E session (tested).
- [ ] Operator moves a property phone/paper → full digital + dispatch.
- [ ] Live dispatch latency <2s driver↔tourist on WS.
- [ ] AI planner grounded-rate = 100%.
- [ ] Zero PII leakage in pen test.

## 4. Resourcing (indicative)

| Role | P0–P2 | P3–P4 |
|---|---|---|
| Frontend (Next.js) | 1–2 | 1–2 |
| Backend / Workers / DO | 1–2 | 1 |
| Mobile (driver app) | 1 (P2) | — |
| AI/ML | — | 1 (P4) |
| DevOps / Cloudflare | 0.5 | 0.5 |
| Supply onboarding (field) | 1 (P1+) | 1 |
| PM / QA | 1 | 1 |

## 5. Critical path & dependencies

- **P2 depends on P0 deploy pipeline working** (Spike B open item — must close
  in P0 with a Cloudflare Pages build verification in CI).
- **P4 depends on P1–P3 catalog being live** (RAG needs real data).
- **Supply onboarding runs from P1** — never blocks build but gates adoption.

## 6. What we explicitly defer (post-MVP)

Real payment settlement · native iOS/Android tourist app · full charter network
· multi-region scale · Urdu i18n · offline-first sync · gov't data integrations.

---
*Scope: `docs/mvp-scope.md` · Spikes: `docs/spike-plan.md`, `spike/*/RESULT.md`.*
