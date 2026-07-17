# HikkInn — Admin Side Specification

The admin side is used by **property operators** (guest house / hotel / resort
owners and their staff) and, at platform level, by **HikkInn ops**.

## Operator admin (property owner)

### Property management
- Create/edit property profile: type, region, location (map pin), photos,
  amenities, season window, active/inactive.
- Multi-property accounts (chains / management companies).

### Inventory
- **Rooms**: room types, capacity, base price, count, seasonal price overrides.
- **Menu / Meals**: define meal items (breakfast/lunch/dinner/snack), mark
  prepackaged, set per-day availability and **daily caps** (finite inventory
  windows). Live menu pushed to tourist app.
- **Activities**: list adventure products (paragliding, skydiving, rafting,
  treks, heli tours) with price, duration, slot capacity, safety certs.

### Fleet & drivers
- Register vehicles (car/SUV/ATV/Cessna/Helicopter) with rate model.
- Onboard drivers → issues companion-app credentials; view live driver
  availability/positions.
- Charter configuration: seat price, full-charter price, crowdsource-fill rules.

### Operations dashboard
- Bookings list (stay) with filters, status changes, cancellations/refunds.
- **Food order board**: incoming per-meal orders (scheduled + live), kitchen
  queue, fulfillment status.
- **Dispatch board**: live ride requests in vicinity, assign/auto-match
  drivers, track ETA.
- Payouts & statements, ratings/reviews moderation.

## Platform admin (HikkInn)
- Operator onboarding & verification (licence, safety certs).
- Region & pricing-policy config, surge rules.
- Catalog moderation, dispute resolution.
- Analytics: demand by region/season, supply gaps.

## Non-goals (v1)
- No direct payment gateway build beyond integration hooks (use a PKR rail like
  JazzCash/Easypaisa/Stripe as integration).
- Driver companion app is a separate mobile target, not admin web.
