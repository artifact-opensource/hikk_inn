# HikkInn — Feature Expansion: Multi-platform, AI, Billing, Push, Agentic

**Date:** 2026-07-17 · **Scope:** Webapp-first, then Android/iOS; multi-provider AI;
billing both sides; push; seasonal theming; agentic admin.

## 1. Platform strategy (webapp first → mobile)
- **Now (P0–P3):** Next.js webapp (this repo) is the product.
- **Later (P5):** React Native + Expo apps for Android & iOS.
- **Shared:** both consume the same API routes + Cloudflare Durable Object
  dispatch (`workers/dispatch.js`). No logic fork — the webapp's server
  components and the mobile app hit identical endpoints.
- Driver companion ships as **PWA first** (installable, offline, push) then a
  native Expo shell wraps the same code.

## 2. AI provider abstraction (`lib/ai/provider.ts`)
- **Default: OpenRouter.** Pluggable: OpenAI, Anthropic, Gemini,
  OpenAI-compatible (any /v1/chat/completions), Ollama (local, no key).
- Single `chat()` entry point; provider chosen by env `AI_PROVIDER` or runtime.
- Used by: AI itinerary planner (P4) + agentic admin assistant (§6).

## 3. Billing — both sides (`lib/billing.ts`)
- **Tourist** pays: stay + meals + rides + charters + activities. Gateways:
  JazzCash, Easypaisa (PKR), Stripe (cards/intl).
- **Operator** receives payouts = gross − 12% platform commission. Operators
  also pay a SaaS plan (Starter free / Growth 15k / Scale 45k PKR/mo).
- Real charge/payout integration is P3+; modeled + simulated now.

## 4. Push notifications (`lib/push.ts`, `public/sw.js`, `manifest.webmanifest`)
- Web Push (VAPID) scaffold. Subscriber stored client-side; delivered via
  Workers endpoint later.
- Types: booking_confirmed, driver_assigned, driver_eta, order_ready,
  payout_cleared, trip_reminder, seasonal_promo.
- Reused by mobile via Expo Notifications (same payload shape).

## 5. Seasonal theming + artwork (`lib/theme.ts`, `components/ThemeHero.tsx`)
- Auto-detects season from date (spring/summer/autumn/winter, N-Pakistan
  weighted). Manual override. CSS vars swap palette; hero art swaps SVG→PNG.
- 4 hand-built SVG landscapes rendered to `public/art/season-*.png`.

## 6. Agentic admin (`lib/agent/db.ts`, `lib/ai/rag.ts`, `lib/agent/runtime.ts`, `components/AgentChat.tsx`, `components/PackageBuilder.tsx`)
- **IndexedDB** durable store (tasks/bookings/orders/audit) — offline-capable,
  PWA-friendly.
- **AI runtime** parses natural-language admin commands → schedule / cancel /
  update / query, executes against IndexedDB + thin server API.
- UI panel in operator console. Full E2E ops automation (P3+ wires to Postgres
  + real dispatch).

## Build status
- All new modules compile under `next build` (Next 14). Web Push + agentic UI
  are live (demo-mode against IndexedDB). Billing is modeled, not yet charged.
