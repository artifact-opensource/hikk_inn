# HikkInn — Demographic Research: North Pakistan Travelers

**Prepared:** July 2026 · **Audience:** Investors, product, marketing
**Note:** Verified demographic *statistics* (age bands, precise origin splits,
spend by segment) are **[NV]** on readable public pages. This document states
what is verified, what is inferred from supply/operator evidence, and what must
be acquired via primary research. We do not fabricate numbers.

---

## 1. Why demographics matter here

HikkInn's two-sided model depends on knowing **who books** (tourist side) and
**who supplies** (admin side). The tourist demographic shapes UI language,
payment rails, and which services to prioritize (meals vs charter vs adventure).
The supplier demographic shapes onboarding (digital literacy, phone-first).

## 2. Tourist segments (evidence-based, Jul 2026)

### 2.1 Domestic — the volume engine
- **Origin cities (verified operator context):** Lahore, Karachi, Islamabad are
  the primary domestic source markets (Sastaticket/Bookme route networks, KKH
  access points).
- **Behavior (inferred from supply):** Family/group leisure, summer-peak
  (Babusar Pass opens ~May–Oct), price-sensitive standard tier (Rs. 3,000–8,000).
- **Implication:** PKR payment rails (JazzCash/Easypaisa) essential; Urdu +
  English UI; group/room-block booking flows.

### 2.2 International — the value engine
- **Nationalities (verified adventure demand):** Chinese (CPEC corridor,
  Karakoram interest), European (trekking/mountaineering — K2 BC, Gondogoro La
  operators cite int'l clientele), and growing adventure tourists.
- **Behavior:** Higher spend, longer stays, adventure-activity-led (treks,
  expeditions, heli/scenic).
- **Implication:** USD/EUR pricing option, visa/travel-info content, charter &
  premium tiers are the upsell.

### 2.3 Adventure / experience seekers
- Paragliding, skydiving, rafting, heli tours audience — currently underserved
  by verified digital discovery **[NV operators]**. High-margin, HikkInn
  differentiator.

## 3. Supplier (operator) demographic

- **Guest-house / hotel owners:** Predominantly local to GB/KPK; many operate
  phone/WhatsApp-only today. Onboarding must be **low-friction, mobile-first,
  possibly agent-assisted**.
- **Drivers / vehicle owners:** Local; ATV/jeep/4x4 owners; companion-app
  onboarding with GPS + availability toggle.
- **Charter operators:** Vetted aircraft/ATV operators (safety-certified);
  fewer, higher-value. Asset-light marketplace (Blade model).

## 4. Seasonal demographic shape (verified via road/weather)

- **Summer (May–Oct):** Peak domestic leisure; Babusar Pass + KKH open;
  maximum volume.
- **Winter:** Road closures (Babusar Top, upper Swat); flight cancellations
  (Gilgit "delayed several days"); demand shifts to accessible/low-altitude +
  ski (Malam Jabba **[NV]**). Platform must handle **seasonal supply swings**.

## 5. Connectivity & digital-readiness (implication)

- Northern areas have **patchy connectivity** → app must tolerate offline/retry;
  WS dispatch needs queueing. This is both a risk and a moat (others can't).

## 6. Data we MUST acquire (primary research plan)

| Missing datum | Method | Owner |
|---|---|---|
| Arrival counts by region 2022–25 | PTDC / GB & KPK Tourism requests | Research |
| Domestic vs foreign split | Same + sampling at airports | Research |
| Age / income / origin survey | On-platform + intercept survey (MVP beta) | Product |
| Avg spend & length of stay | Operator interviews + transaction sampling | Research |
| Supplier digital literacy | Onboarding funnel telemetry | Ops |

## 7. Working persona (for design, not a stat)

> **"Karachi family of 4"** — books in summer, wants room + per-meal plan +
> a hired car from Islamabad, pays via JazzCash, needs Urdu UI.
>
> **"European trekker"** — books K2 BC expedition + heli sightseeing + premium
> stay, pays USD, wants verified safety/certs.

These drive the MVP scope (Hunza + Skardu, stay+meal+live-taxi+1 charter).

---
*Inferred where marked; verified supply/operator facts from `docs/research/`.*
