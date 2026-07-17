# HikkInn — Business Analytics & Unit Economics

**Prepared:** July 2026 · **Audience:** Investors, finance, steering committee
**Important:** Official tourism *volume* and *spend* statistics are **[NV]** (see
market/demographic docs). The TAM/SAM/SOM below are **illustrative models** built
from verified supply counts + reasonable assumptions, clearly labeled. They are
decision scaffolds, not audited figures. Replace with primary-data figures when
acquired.

---

## 1. Market sizing framework

```
TAM  = All tourism spend in North Pakistan (stays + food + transport + activities)
SAM  = Spend addressable by an online two-sided platform (digitizable supply)
SOM  = Realistic 3-year capture (Hunza + Skardu + Naran + Swat, 2-sided take-rate)
```

### Illustrative model (replace with primary data)
| Layer | Basis | Illustrative annual value |
|---|---|---|
| TAM | Verified stays (1,211 Airbnb listings) × occupancy × nights × rate, + food/transport/activities | **PKR 40–60B** assumption band |
| SAM | Digitizable share (~30–40% of TAM within platform reach) | **PKR 12–24B** |
| SOM (Y3) | 8–12% SAM capture via take-rate | **PKR 1–3B GMV** |

> Take-rate assumption: **10–15%** on stays/charter, **8–12%** on transport/food
> (Uber/foodpanda-comparable). These are industry-reference bands, not measured.

## 2. Revenue streams

| Stream | Mechanism | Take / margin |
|---|---|---|
| Stay booking | Commission per reservation | 10–15% |
| Meal orders | Commission per order (prepackaged batch) | 8–12% |
| Live transport | Commission per ride (surge-adjusted) | 10–15% + surge share |
| Charter (air/ATV) | Asset-light marketplace fee (seat/full/fill) | 12–18% |
| Activity/excursion | Commission | 10–15% |
| Sponsored placement | Operator promo in tourist app | CPM/flat |

## 3. Unit economics (illustrative per transaction)

```
Example: Family stay + meals + 1 live taxi + 1 charter activity
  Stay 3 nights × Rs. 6,500        = Rs. 19,500  → HikkInn 12% = Rs. 2,340
  Meals 4 pax × 3 days × Rs. 800   = Rs. 9,600   → HikkInn 10% = Rs. 960
  Live taxi (return)               = Rs. 6,000   → HikkInn 12% = Rs. 720
  Charter activity                 = Rs. 9,000   → HikkInn 15% = Rs. 1,350
  ----------------------------------------------------------------
  Order GMV ≈ Rs. 44,100  →  HikkInn take ≈ Rs. 5,370 (≈12.2%)
```

**CAC / LTV note:** Domestic acquisition via social/WhatsApp is low-cost;
international via adventure-community channels. LTV driven by repeat seasonal
bookings — retention is the lever (one trip → next season).

## 4. Cost structure (build + run)

| Cost | Driver |
|---|---|
| Platform build | Next.js + Cloudflare (low infra cost; edge serverless) |
| AI (Workers AI + Vectorize) | Per-inference; scale with usage |
| Onboarding/supply acquisition | Field agents for low-digital-literacy operators |
| Payment rail fees | JazzCash/Easypaisa/Stripe interchange |
| Support / ops | Multi-region, seasonal staffing |
| Connectivity mitigation | Offline-tolerant engineering (one-time) |

**Why unit economics work:** Asset-light (no inventory owned), edge-hosted
(low fixed infra), marketplace take-rates comparable to proven players
(foodpanda/Airlift/Uber/Blade). Caution: Airlift (Pakistan q-commerce) **failed
2022 on unit economics/liquidity** — HikkInn must avoid over-subsidizing
delivery; prepackaged batch fulfillment (not made-to-order) protects margin.

## 5. KPIs to track from MVP

- GMV / take-rate realized vs assumed
- Supply onboarded (properties, drivers, charter operators) per region
- Live-dispatch match rate & latency (<2s target)
- Tourist one-session completion rate (stay+meal+transport+activity)
- Repeat/seasonal retention
- AI planner grounded-rate (0 hallucinated items)

## 6. Sensitivity & assumptions log

| Assumption | If wrong → | Mitigation |
|---|---|---|
| 30–40% supply digitizable | Over/under TAM | Primary-data calibration pre-Series A |
| 10–15% take-rate holds | Price war | Tiered, value-based pricing |
| Seasonal volume sustains | Cash-flow gaps in winter | Off-season products (ski, low-altitude) |
| Low CAC via social | Paid acquisition needed | Operator co-marketing |

---
*All figures illustrative pending primary research. Do not present as audited.*
