# HikkInn — Risk Management & Issue Register

**Prepared:** July 2026 · **Audience:** Steering committee, sponsors, PMO
**Severity:** H=High, M=Medium, L=Low. **Status:** OPEN / MITIGATED / RETIRED.

---

## 1. Technical risks

| # | Risk | Sev | Likelihood | Mitigation | Status |
|---|---|---|---|---|---|
| T1 | Real-time dispatch fails at edge (DO/WS) | H | Low | Spike A validated pattern (11+5 checks). Port logic 1:1 to DO. | RETIRED (spike) |
| T2 | Next.js build crash on target/kernel | H | Med | Spike B: Next 16 bus-faulted on this Kali kernel; Next 14 builds. Pin Next 14 + verify Cloudflare Pages build in CI. | OPEN (need CI verify) |
| T3 | Patchy northern connectivity drops WS | M | High | Queue+retry WS; DO hibernation; offline-tolerant UI; SMS/WhatsApp fallback for confirmations. | MITIGATED (design) |
| T4 | AI planner hallucinates inventory | H | Med | RAG + sourceId grounding; invariant test (0 hallucinated). Spike C PASS. | RETIRED (spike) |
| T5 | Payment rail failure / fraud | M | Med | Use established rails (JazzCash/Easypaisa/Stripe); escrow-style release on fulfillment; KYC on operators. | OPEN |
| T6 | Geo-matching at scale (thousands drivers) | L | Low | MVP regions small; add geo-bucketing shards later. O(n) fine for now. | MITIGATED |
| T7 | Data privacy / traveler PII | M | Med | Minimize PII; encrypt in transit; region-aware storage; consent flows. | OPEN |

## 2. Market & business risks

| # | Risk | Sev | Mitigation | Status |
|---|---|---|---|---|
| M1 | Official market data missing ([NV]) | H | Acquire from GB/KPK Tourism + PTDC; primary survey in MVP beta. Don't size on guesses. | OPEN |
| M2 | Low digital literacy of suppliers | H | Mobile-first, agent-assisted onboarding; companion app simple; field team. | OPEN |
| M3 | Strong seasonality (winter valleys close) | M | Off-season products (ski, low-altitude); cash buffer; multi-region. | MITIGATED (plan) |
| M4 | Incumbent platforms expand (Bookme/Airbnb) | M | Wedge on live services (meals/transport/charter) they don't do; speed + local depth. | OPEN |
| M5 | Unit economics (Airlift failed 2022) | H | Prepackaged batch fulfillment (not made-to-order); avoid over-subsidy; watch take-rate. | OPEN (watch) |
| M6 | Adventure operator verification gap | M | Vetted-only charter; cert/insurance checks; trust layer is moat. | OPEN |

## 3. Operational / execution risks

| # | Risk | Sev | Mitigation | Status |
|---|---|---|---|---|
| O1 | Disk/storage capacity on dev host | M | External HDD (sdb) mounted as staging (364G free); existing data untouched. CI/build on separate host. | MITIGATED |
| O2 | Key-person / scope creep | M | Phased MVP (P0–P4); explicit in/out scope; weekly steering checkpoints. | OPEN |
| O3 | Regulatory (tourism licence, aviation) | M | Partner with licensed operators (e.g. Lic 396 Hunza Guides); legal review for charter. | OPEN |
| O4 | Multi-region rollout complexity | L | MVP = Hunza + Skardu only; template + config-driven expansion. | MITIGATED |

## 4. Issues we must "dial in" before scale

1. **Surge pricing rules** — current model is demand-ratio, capped 2.5×. Needs
   real pricing policy + regulatory comfort (surge can be politically sensitive).
2. **ETA accuracy** — straight-line now; integrate routing (OSRM) for road-based
   ETA; tune per-valley effective speed.
3. **Driver supply density** — dispatch only works with enough available
   drivers; launch with operator-owned + recruited fleet in MVP regions.
4. **Meal fulfillment SLAs** — prepackaged caps must match kitchen capacity;
   live "order now" needs kitchen acknowledgement latency defined.
5. **Charter safety & insurance** — non-negotiable vetting before any seat sale.
6. **Primary data acquisition** — close the [NV] gaps (arrivals, spend,
   demographics) before Series A sizing.

## 5. Risk dashboard (targets)

- Technical spike GO/NO-GO before each phase gate.
- Live-dispatch latency <2s (measured in MVP).
- AI grounded-rate = 100% (invariant in CI).
- Supplier onboarding time < 30 min (metric from beta).
- Cash runway covers off-season (M3–M5 buffer).

---
*See also: `docs/mvp-scope.md`, `docs/spike-plan.md`, `spike/*/RESULT.md`.*
