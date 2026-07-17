# HikkInn — P0 Foundation

**Phase:** P0 (Foundation) · **Gate:** deployable skeleton + Cloudflare Pages build verified
**Stack decision (from Spike B):** Next.js 14 (Next 16 bus-faults on the build
kernel — pinned to 14.2.x). Cloudflare Pages + Workers + Durable Objects.

## What P0 delivers
1. Next.js 14 app (App Router) — tourist + admin shells, role-aware.
2. Cloudflare config: `wrangler.toml`, Pages build, DO binding.
3. Postgres schema (SQL) + seed (Hunza + Skardu, 4 properties).
4. Auth roles stub (tourist / operator / driver).
5. Dispatch logic ported from Spike A into a Durable Object stub.
6. CI build verification (closes Spike B open item).

## Repo layout (P0+)
```
HikkInn/
├── app/                 # Next.js 14 (tourist + admin)
├── workers/             # Cloudflare Workers + Durable Object (dispatch)
├── db/                  # schema.sql + seed.sql
├── wrangler.toml
├── package.json
└── .github/workflows/   # CI: build + (later) deploy preview
```

## Notes
- `node_modules` is large; install on the external HDD (`sdb`) to protect
  `/home` (was 100% full). Symlink or set npm prefix there.
- Next 14 confirmed building locally (Spike B). CI must verify Pages build.
