export type Region = 'Hunza' | 'Skardu' | 'Naran' | 'Swat' | 'Chitral' | 'Kumrat' | 'Gilgit' | 'Astore';

export type PropertyType = 'guest_house' | 'hotel' | 'resort';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type VehicleClass = 'car' | 'suv' | 'atv' | 'van' | 'cessna' | 'helicopter';
export type Availability = 'offline' | 'available' | 'busy';

// Drizzle/SQL schema sketch — P0 seed target. The actual migration runs in P1
// against PostgreSQL (Cloudflare Hyperdrive or managed PG). Kept as plain SQL
// here so it is provider-agnostic and reviewable.

export const schemaSQL = `
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY,
  role          TEXT NOT NULL CHECK (role IN ('tourist','operator','driver')),
  name          TEXT,
  region        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS properties (
  id            UUID PRIMARY KEY,
  owner_id      UUID NOT NULL REFERENCES users(id),
  type          TEXT NOT NULL CHECK (type IN ('guest_house','hotel','resort')),
  name          TEXT NOT NULL,
  region        TEXT NOT NULL,
  lat           DOUBLE PRECISION,
  lng           DOUBLE PRECISION,
  amenities     JSONB NOT NULL DEFAULT '[]',
  season_open   DATE,
  status        TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS room_types (
  id            UUID PRIMARY KEY,
  property_id   UUID NOT NULL REFERENCES properties(id),
  name          TEXT NOT NULL,
  capacity      INT NOT NULL,
  base_price_pkr INT NOT NULL,
  inventory     INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS menu_items (
  id            UUID PRIMARY KEY,
  property_id   UUID NOT NULL REFERENCES properties(id),
  meal_type     TEXT NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  name          TEXT NOT NULL,
  price_pkr     INT NOT NULL,
  prepackaged   BOOLEAN NOT NULL DEFAULT false,
  daily_cap     INT
);

CREATE TABLE IF NOT EXISTS vehicles (
  id            UUID PRIMARY KEY,
  operator_id   UUID NOT NULL REFERENCES users(id),
  class         TEXT NOT NULL CHECK (class IN ('car','suv','atv','van','cessna','helicopter')),
  name          TEXT NOT NULL,
  capacity      INT NOT NULL,
  base_price_pkr INT NOT NULL,
  region        TEXT
);

CREATE TABLE IF NOT EXISTS drivers (
  id            UUID PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES users(id),
  vehicle_id    UUID REFERENCES vehicles(id),
  region        TEXT,
  lat           DOUBLE PRECISION,
  lng           DOUBLE PRECISION,
  availability  TEXT NOT NULL DEFAULT 'offline' CHECK (availability IN ('offline','available','busy')),
  rating        NUMERIC(2,1) DEFAULT 5.0
);

CREATE TABLE IF NOT EXISTS bookings (
  id            UUID PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES users(id),
  property_id   UUID NOT NULL REFERENCES properties(id),
  room_type_id  UUID NOT NULL REFERENCES room_types(id),
  check_in      DATE NOT NULL,
  check_out     DATE NOT NULL,
  guests        INT NOT NULL,
  total_pkr     INT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'confirmed'
);

CREATE TABLE IF NOT EXISTS food_orders (
  id            UUID PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES users(id),
  property_id   UUID NOT NULL REFERENCES properties(id),
  items         JSONB NOT NULL,
  status        TEXT NOT NULL DEFAULT 'queued'
);

CREATE TABLE IF NOT EXISTS ride_orders (
  id            UUID PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES users(id),
  vehicle_class TEXT,
  pickup_lat    DOUBLE PRECISION,
  pickup_lng    DOUBLE PRECISION,
  driver_id     UUID REFERENCES drivers(id),
  status        TEXT NOT NULL DEFAULT 'searching',
  eta_min       INT,
  price_pkr     INT
);
`;
