CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS battery_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(150) NOT NULL,
  short_title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  finder_type VARCHAR(20) NOT NULL
    CHECK (finder_type IN ('vehicle', 'application')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batteries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL
    REFERENCES battery_categories(id)
    ON DELETE RESTRICT,
  brand VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  model VARCHAR(120) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_path TEXT NOT NULL DEFAULT '',
  capacity_ah NUMERIC(8, 2),
  voltage NUMERIC(8, 2),
  warranty TEXT NOT NULL DEFAULT '',
  mrp NUMERIC(12, 2),
  price NUMERIC(12, 2),
  status VARCHAR(30) NOT NULL DEFAULT 'draft'
    CHECK (
      status IN (
        'available',
        'coming-soon',
        'out-of-stock',
        'draft',
        'hidden',
        'discontinued'
      )
    ),
  published BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  source_url TEXT,
  price_checked_on DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (category_id, brand, model)
);

CREATE TABLE IF NOT EXISTS vehicle_makes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL
    REFERENCES battery_categories(id)
    ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (category_id, name)
);

CREATE TABLE IF NOT EXISTS vehicle_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make_id UUID NOT NULL
    REFERENCES vehicle_makes(id)
    ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  fuel_type VARCHAR(50) NOT NULL DEFAULT '',
  variant VARCHAR(150) NOT NULL DEFAULT '',
  year_from INTEGER,
  year_to INTEGER,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (
    make_id,
    name,
    fuel_type,
    variant,
    year_from,
    year_to
  )
);

CREATE TABLE IF NOT EXISTS battery_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battery_id UUID NOT NULL
    REFERENCES batteries(id)
    ON DELETE CASCADE,
  vehicle_model_id UUID NOT NULL
    REFERENCES vehicle_models(id)
    ON DELETE CASCADE,
  recommended BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (battery_id, vehicle_model_id)
);

CREATE TABLE IF NOT EXISTS wifi_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(150) NOT NULL,
  short_title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  supported_isp VARCHAR(100) NOT NULL DEFAULT 'Airtel',
  published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wifi_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL
    REFERENCES wifi_services(id)
    ON DELETE CASCADE,
  field_key VARCHAR(100) NOT NULL,
  label VARCHAR(200) NOT NULL,
  placeholder TEXT NOT NULL DEFAULT '',
  field_type VARCHAR(20) NOT NULL
    CHECK (field_type IN ('text', 'textarea', 'select')),
  options JSONB NOT NULL DEFAULT '[]'::JSONB,
  required BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (service_id, field_key)
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(200) NOT NULL,
  service_used VARCHAR(150) NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  admin_notes TEXT NOT NULL DEFAULT '',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_type VARCHAR(50) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(200),
  customer_phone VARCHAR(30),
  subject VARCHAR(200) NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  status VARCHAR(30) NOT NULL DEFAULT 'new'
    CHECK (
      status IN (
        'new',
        'contacted',
        'in-progress',
        'resolved',
        'closed',
        'spam'
      )
    ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value JSONB NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS batteries_category_index
  ON batteries(category_id);

CREATE INDEX IF NOT EXISTS batteries_status_index
  ON batteries(status, published);

CREATE INDEX IF NOT EXISTS vehicle_models_make_index
  ON vehicle_models(make_id);

CREATE INDEX IF NOT EXISTS compatibility_vehicle_index
  ON battery_compatibility(vehicle_model_id);

CREATE INDEX IF NOT EXISTS compatibility_battery_index
  ON battery_compatibility(battery_id);

CREATE INDEX IF NOT EXISTS reviews_status_index
  ON reviews(status, submitted_at DESC);

CREATE INDEX IF NOT EXISTS enquiries_status_index
  ON enquiries(status, created_at DESC);

CREATE INDEX IF NOT EXISTS wifi_questions_service_index
  ON wifi_questions(service_id, sort_order);