# HikkInn — Agentic AI Architecture (RAG-grounded, both sides)

**Date:** 2026-07-17 · extends `docs/feature-expansion.md`

## Overview
The agentic layer runs on a **grounded RAG** foundation: every agent answer is
retrieved from the platform knowledge base (catalog, policies, docs) and cited
by chunk id — the model may not answer from parametric memory alone. Tools let
the agent act autonomously (bookings, billing, reminders).

## Components
- `lib/ai/rag.ts` — knowledge base + retrieval. Local deterministic embedding
  (cosine over hashed bag-of-words) for offline/demo; **Vectorize-shaped**
  interface — swap `retrieve()` body for `env.CATALOG_INDEX.query(...)` in prod.
- `lib/agent/runtime.ts` — v2 agent: RAG-grounded prompt + JSON tool-calling.
  `agentTurn(side, text)` returns answer + cites + tool; `execTool()` runs it.
- `lib/booking.ts` — booking management (CRUD) over IndexedDB; P3 syncs to
  Postgres `bookings/food_orders/ride_orders`.
- `lib/billing.ts` — both-side billing (tourist pays; operator payout −12%).
- `components/AgentChat.tsx` — chat for **admin** and **tourist** + BookingManager + BillingPanel.
- `components/PackageBuilder.tsx` — tourist **manual package builder**.

## Admin side (fully agentic)
AI chat with context + tools for: booking create/cancel/update, invoice draft,
payout compute, reminder set. Plus Booking Management (cancel/seamless edit) and
Billing · Accounting · Invoicing panel. Push opt-in.

## Tourist side
AI Travel Assistant (chat, grounded) + manual Package Builder (stay × nights,
meals, charter/ride — live total). "Send to AI / Book" hands the package to the
agent. Total manual control OR full AI support.

## Grounding invariant (enforced)
`agentTurn` always returns `cites: string[]` from retrieved chunks. UI renders
citations. This prevents hallucinated catalog data.

## Demo mode notes
- RAG retrieval is local (no Vectorize creds needed to run).
- Bookings/billing live in IndexedDB; real Postgres + charge rails = P3.
- Agent tool-calls execute locally; prod swaps `execTool` to API/Postgres.
