# HikkInn — Spike Plan

Purpose: de-risk the 3 hardest technical bets before committing to full build.
Each spike is throwaway / time-boxed; outcome = GO / NO-GO + learned constraints.

## Spike A — Live dispatch via Durable Objects (WebSocket Hibernation)
- **Risk**: real-time multi-client coordination (tourist + driver + admin) at
  edge with DO is the core novel part; if it doesn't behave, the whole "live"
  premise fails.
- **Build**: a minimal Worker + Durable Object. Tourist WS connects, posts
  pickup; driver WS connects, posts position + availability; DO matches
  nearest, pushes ETA to both; admin WS sees board. Simulated clients.
- **Exit criteria (GO)**: 2+ concurrent WS clients per DO; message round-trip
  <2s; hibernation survives idle; deployable to `wrangler dev` + preview.
- **Tooling**: `wrangler` (check installed), Cloudflare account not required for
  `wrangler dev` local.

## Spike B — Next.js + Cloudflare Pages deploy smoke test
- **Risk**: framework/deploy mismatch; Pages Functions + DO bindings config.
- **Build**: `create-next-app`, minimal page, `wrangler pages deploy` (or
  `pages dev`), confirm DO binding works from a Route Handler.
- **Exit (GO)**: `npm run build` succeeds, deploy to preview, page renders, an
  API route can talk to a DO.

## Spike C — RAG itinerary stub (Workers AI + Vectorize shape)
- **Risk**: grounding LLM in live catalog; cost/latency; hallucination control.
- **Build**: seed a small Vectorize-like index (or in-memory for spike) of
  catalog items; a Worker AI call retrieves + generates a day plan; assert every
  output item maps to a seed entity.
- **Exit (GO)**: plan output references only seeded items; latency acceptable
  (<5s); graceful when catalog empty.

## Notes
- Spikes run locally; no GitHub push (per user).
- If `wrangler`/Cloudflare creds missing, Spike A/B degrade to local
  `wrangler dev` + a Node WS server equivalent to prove the pattern.
