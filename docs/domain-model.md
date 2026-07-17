# HikkInn — Domain Model (draft)

> Entities and relationships. Drives the database schema and API surface.

## Core entities

### Property
- `id`, `ownerId` (admin user), `type` ∈ {guest_house, hotel, resort}
- `name`, `region` (Hunza/Skardu/Swat/Naran/Chitral/Kumrat/Gilgit/Astore/...),
  `location` (lat/lng), `address`, `description`, `media[]`
- `amenities[]`, `seasonOpen`, `status` (active/inactive)

### RoomType
- `id`, `propertyId`, `name` (e.g. "Deluxe King"), `capacity`, `basePricePKR`,
  `inventoryCount`, `seasonalPricing[]`

### MealPlan / MenuItem
- `id`, `propertyId`, `mealType` ∈ {breakfast, lunch, dinner, snack}
- `name`, `description`, `pricePKR`, `prepackaged` (bool), `availableDays[]`,
  `dailyCap` (finite inventory window)
- `menu` = collection per property, pushed live to tourists

### Vehicle / Fleet
- `id`, `operatorId`, `class` ∈ {car, suv, atv, van, cessna, helicopter}
- `name`, `capacity`, `rateModel` (per_km / per_hour / per_day / charter),
  `basePricePKR`, `region`, `status`
- `driverId` (links to Driver when staffed)

### Driver
- `id`, `userId`, `vehicleId?`, `region`, `gpsLast` (lat/lng + ts),
  `availability` ∈ {offline, available, busy}, `rating`
- Companion-app controlled availability.

### Charter (aircraft/ATV)
- Specialization of Vehicle with `charterType` ∈ {seat, full, crowdsource_fill}
- `routeOrZone`, `scheduleSlots[]`, `seatPricePKR`, `fullPricePKR`

### Activity / Excursion
- `id`, `propertyId?`, `operatorId`, `type` ∈ {paragliding, skydiving,
  rafting, trek, heli_tour, ...}, `name`, `pricePKR`, `durationHrs`,
  `capacityPerSlot`, `scheduleSlots[]`, `safetyCert`

### Booking (stay)
- `id`, `userId`, `propertyId`, `roomTypeId`, `checkIn`, `checkOut`,
  `guests`, `mealSelections[]`, `totalPKR`, `status`

### FoodOrder
- `id`, `userId`, `propertyId`, `items[]` (menuItemId × qty × day/meal),
  `fulfillment` ∈ {scheduled, live}, `status`, `placedAt`

### RideOrder (live dispatch)
- `id`, `userId`, `pickup` (lat/lng), `dropoff` (lat/lng), `vehicleClass`,
  `driverId?`, `status` ∈ {searching, matched, enroute, completed},
  `pricePKR` (surge-adjusted), `etaMin`

### Itinerary (AI)
- `id`, `userId`, `days[]` (stay/meal/transport/activity blocks),
  `generatedBy` (LLM + RAG), `editHistory[]`

## Relationships
- Admin `User` → owns `Property`(s) → has `RoomType`, `MenuItem`, `Activity`.
- `Driver` ↔ `Vehicle` ↔ `RideOrder` / `Charter`.
- `User` (tourist) → `Booking` + `FoodOrder` + `RideOrder` + `Itinerary`.
- `Durable Object` per active `RideOrder` coordinates driver↔tourist WS.
