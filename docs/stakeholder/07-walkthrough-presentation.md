# HikkInn — Stakeholder Walkthrough & Project Presentation

**Prepared:** July 2026 · **Audience:** Investors, awarding client, steering committee
**How to use:** This is the narrative deck-in-prose. Each section maps to a slide.
Wireframes/diagrams are real renders in `docs/assets/` — embed them in the
slide deck. Keep this as the single source of truth; the deck is generated from it.

---

## Slide 1 — Title
**HikkInn** · AI-powered hospitality & travel platform for North Pakistan.
*Upgrading manual systems → automated, web-hosted, combined services.*

## Slide 2 — The problem
Northern Pakistan is a booming destination (e.g. **529 Airbnb stays in Skardu,
475 in Hunza** as of Jul 2026) but runs on **phone/agent/walk-in** systems:
- No centralized digital inventory (stays + meals + transport + activities).
- Weather-dependent flights with no live rebooking.
- Adventure products (paragliding, heli, ATV) have a discovery/trust gap.
- Weak OTA penetration for traditional hotels = white space.

## Slide 3 — The wedge (two-sided platform)
- **Admin/Operator:** manage property, rooms, menus (per-meal, prepackaged),
  fleet, drivers, dispatch board — all digital.
- **Tourist:** one session → **stay + eat + move + fly**. Live taxi (Uber-style),
  charter (ATV/Cessna/Heli), activities, AI itinerary.

## Slide 4 — Tourist experience (wireframe)
![Tourist app](assets/wf-tourist.png)
*Stay selection · per-day/per-meal plan · LIVE taxi with ETA · charter/activities
· one-tap booking · AI itinerary builder.*

## Slide 5 — Operator console (wireframe)
![Admin console](assets/wf-admin.png)
*Live KPIs · inventory · kitchen & dispatch board · fleet/driver status. Moves a
property from paper/phone to full digital operations.*

## Slide 6 — Driver companion (wireframe)
![Driver app](assets/wf-driver.png)
*Availability toggle · nearby requests · accept · earnings. The live supply side
of dispatch.*

## Slide 7 — Architecture (diagram)
![Architecture](assets/diagram-architecture.png)
*Next.js + Cloudflare Pages/Workers + Durable Objects (real-time) + Postgres +
Vectorize (AI). Edge-hosted, asset-light, low fixed infra.*

## Slide 8 — Live dispatch (diagram + proof)
![Dispatch flow](assets/diagram-dispatch.png)
*Nearest-available matching, ETA, surge — via Durable Object WebSocket.
**Validated:** Spike A = 11 logic assertions + 5 WS round-trip checks, match <2s.*

## Slide 9 — Market & business
- Fragmented, growing, underserved; first mover digitizes long-tail + live services.
- Revenue: take-rate on stays (10–15%), meals (8–12%), transport (10–15% + surge
  share), charter (12–18%), activities, sponsored placement.
- **Caution:** Airlift (PK q-commerce) failed 2022 on unit economics — HikkInn
  uses prepackaged batch fulfillment, not made-to-order, to protect margin.
- *TAM/SAM/SOM illustrative pending primary data (see business-analytics.md).*

## Slide 10 — Demographics
- **Domestic (volume):** Lahore/Karachi/Islamabad families, summer-peak, PKR,
  Urdu UI, group booking.
- **International (value):** Chinese + European trekkers/expeditioners, higher
  spend, charter & premium upsell.
- **Suppliers:** local low-digital-literacy operators → mobile-first onboarding.
- *Precise age/spend stats: [NV] → primary research plan included.*

## Slide 11 — Risks & how we dial them in
- Tech risks RETIRED via spikes (dispatch, AI grounding). Next build verified in CI.
- Market risks: acquire primary data; agent-assisted onboarding; off-season products.
- Must-dial-in: surge policy, ETA accuracy (routing), driver density, meal SLAs,
  charter safety vetting. Full register in `05-risk-management.md`.

## Slide 12 — Blueprint & roadmap
- P0 Foundation → P1 Stay+Meals → P2 Live Dispatch → P3 Charter/Activity →
  P4 AI Itinerary (≈15 weeks to MVP).
- MVP gate: one-session trip completion, <2s dispatch, 100% grounded AI.

## Slide 13 — Ask / next step
- Approve MVP scope (Hunza + Skardu) and phase gates.
- Green-light primary market-data acquisition (GB/KPK Tourism + PTDC).
- Confirm open decisions: driver app framework, auth, carrier integration.

---

## Presentation notes (for the speaker)
- Lead with the wedge: "one app, one session — stay, eat, move, fly."
- Show the three wireframes as the emotional hook (this is buildable, not vapor).
- Be honest on [NV] data — investors respect the rigor more than fake precision.
- Close on de-risked tech (spikes passed) + clear phase gates.

## Companion files (this repo)
- `01-market-research.md` · `02-demographic-research.md` · `03-business-analytics.md`
- `04-architecture.md` · `05-risk-management.md` · `06-blueprint.md`
- `docs/assets/*.png` (wireframes + diagrams)
- `docs/research/*` (Jul 2026 raw research) · `spike/*/RESULT.md` (evidence)
