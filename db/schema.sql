-- HikkInn P0 schema (Postgres). Minimal but real.
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role        TEXT NOT NULL CHECK (role IN ('tourist','operator','driver')),
  email       TEXT UNIQUE,
  name        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS properties (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID REFERENCES users(id),
  type        TEXT NOT NULL CHECK (type IN ('guest_house','hotel','resort')),
  name        TEXT NOT NULL,
  region      TEXT NOT NULL,
  lat         DOUBLE PRECISION,
  lng         DOUBLE PRECISION,
  status      TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS room_types (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id  UUID REFERENCES properties(id),
  name         TEXT NOT NULL,
  capacity     INT,
  base_price   NUMERIC(10,2),
  inventory    INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS menu_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id  UUID REFERENCES properties(id),
  meal_type    TEXT CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  name         TEXT NOT NULL,
  price        NUMERIC(10,2),
  prepackaged  BOOLEAN DEFAULT false,
  daily_cap    INT
);

CREATE TABLE IF NOT EXISTS vehicles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id  UUID REFERENCES users(id),
  class        TEXT CHECK (class IN ('car','suv','atv','van','cessna','helicopter')),
  name         TEXT,
  rate_model   TEXT,
  base_price   NUMERIC(10,2),
  region       TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),
  property_id  UUID REFERENCES properties(id),
  check_in     DATE,
  check_out    DATE,
  total        NUMERIC(10,2),
  status       TEXT DEFAULT 'pending'
);
