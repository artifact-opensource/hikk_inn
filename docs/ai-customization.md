# HikkInn — AI Travel Customization

Personalized itinerary generation grounded in **live HikkInn inventory** (not
hallucinated options).

## Pattern: RAG over the catalog
- **Retrieval-Augmented Generation**: the LLM first retrieves from HikkInn's
  specified data (rooms, meal caps, driver ETAs, charter slots, activities),
  then responds — keeping recommendations grounded in *real, bookable* supply.
- Prevents the classic failure of generic travel AI: suggesting places that
  aren't available or don't exist in-region.

## Build blocks (Cloudflare-native, Jul 2026)
- **Workers AI** — LLM inference on serverless GPUs.
- **Vectorize** — vector DB for semantic retrieval over the catalog
  (the RAG store).
- **Durable Objects** — per-traveler conversational state.

## User flow
1. Traveler describes intent: "4 days Hunza, paragliding + local food + a heli
   sightseeing hop, moderate budget."
2. Planner retrieves live inventory via Vectorize (availability, prices, ETAs).
3. LLM assembles a day-by-day **Itinerary** (stay + meals + transport +
   activities), each block a real bookable item.
4. Traveler edits in chat; books directly from the plan.

## Guardrails
- Every suggested item must resolve to a real catalog entity + live price.
- Surface confidence / "based on current availability" disclaimers.
- Keep human-overridable; never auto-charge.

## Gaps (Jul 2026 research)
- Named 2025–2026 "AI travel agent" product benchmarks/accuracy were not
  verifiable from loaded sources — build HikkInn's own eval on real bookings.
