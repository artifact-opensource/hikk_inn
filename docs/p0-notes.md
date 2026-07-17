# P0 — Foundation: Build Notes

**Status:** ✅ Scaffolded · **Gate:** deployable skeleton + `next build` passes
**Date:** 2026-07-17

## What was built
- Next.js **14.2.35** app (App Router, TypeScript) at repo root — runs on this
  kernel where Next 16 bus-faults (see Spike B). Pinned to 14 for the build gate.
- `app/layout.tsx` + `app/globals.css` — root shell + design tokens.
- `app/page.tsx` — role-based landing (Tourist / Operator / Driver).
- `app/tourist|operator|driver/page.tsx` — placeholder role pages (real features
  land in P1–P3).
- `lib/auth.ts` — role model + path→role resolver (real auth provider = open
  decision).
- `lib/schema.ts` — Postgres schema (SQL string, provider-agnostic).
- `lib/seed.ts` — seed: 2 regions (Hunza, Skardu), 4 properties, menus, 3 drivers.
- `wrangler.toml` + `wrangler.jsonc` — Cloudflare Pages + Durable Object
  `DispatchCoordinator` binding shape (Spike A logic ports here in P2).

## Build verification (closes Spike B open item)
- `npm run build` must pass. Next 14 compiles on this host; Next 16 does not
  (native bus error on Kali 6.17 kernel). CI should build with
  `@cloudflare/next-on-pages` for the Pages target.

## Open decisions still pending
- Auth provider (Cloudflare Access / Auth0 / Supabase).
- Postgres hosting (Hyperdrive vs managed PG).
- Driver app framework (RN / Flutter / PWA).
- Real carrier API integration.

## Next (P1)
Stay + Meals: property browse/booking, per-meal selection, admin menu + caps,
food order board. Wire `lib/schema.ts` + `lib/seed.ts` to a real Postgres.
