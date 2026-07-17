# Spike C — AI Itinerary (RAG grounding) — RESULT: GO

**Date:** 2026-07-17
**Status:** ✅ GO — grounding invariant proven.

## What was built (`spike/c-rag/itinerary-stub.js`)
- Seed `CATALOG` of stay/meal/activity/charter/vehicle entities (surrogate for a
  Vectorize index).
- `planItinerary(region, intent)` — retrieves by region+type, builds a day plan
  where **every block carries `sourceId`** pointing back to a catalog entity.
- `verifyGrounded(plan)` — asserts every block's `sourceId` exists in CATALOG
  (the anti-hallucination invariant).

## Result
- Input: `planItinerary('Hunza', 'paragliding + local food + ATV ride')`
- Output blocks all resolved to real ids (`stay_hunza_eagle`, `act_hunza_para`,
  `trans_hunza_atv`); `Grounded check: PASS`. Self-test exits 0.

## Learnings / build notes
1. **Grounding works** — swap fake generator for Workers AI + Vectorize retrieve;
   keep `sourceId` tagging so the UI can deep-link to bookable items.
2. **Retrieval intent→type mapping needs tuning**: "local food" intent did NOT
   pull a meal (seed only had dinner/breakfast; matcher keys on keywords). In
   prod use semantic Vectorize search + intent classification, not regex.
3. **Empty-catalog path**: if retrieve returns nothing, say "no availability"
   rather than invent — invariant enforces this.

## Verdict
Risk retired. P4 can proceed; follow-up is real LLM + Vectorize wiring and
intent→retrieval tuning.
