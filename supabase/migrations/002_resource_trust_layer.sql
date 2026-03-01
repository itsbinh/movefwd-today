DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_status_enum') THEN
    CREATE TYPE availability_status_enum AS ENUM ('unknown', 'open', 'limited', 'full', 'waitlist');
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS resource_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL UNIQUE REFERENCES resources(id) ON DELETE CASCADE,
  availability_status availability_status_enum NOT NULL DEFAULT 'unknown',
  last_confirmed_at TIMESTAMP WITH TIME ZONE,
  confirmation_source TEXT,
  confidence_score NUMERIC(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resource_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL UNIQUE REFERENCES resources(id) ON DELETE CASCADE,
  verification_badge TEXT NOT NULL DEFAULT 'unverified'
    CHECK (verification_badge IN ('verified_partner', 'verified_api', 'community', 'unverified')),
  data_source_label TEXT NOT NULL DEFAULT 'Local partner directory',
  freshness_state TEXT NOT NULL DEFAULT 'unknown'
    CHECK (freshness_state IN ('fresh', 'aging', 'stale', 'unknown')),
  verified_by TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE resource_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Availability rows viewable by everyone" ON resource_availability
  FOR SELECT USING (true);

CREATE POLICY "Availability rows editable by authenticated users" ON resource_availability
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Verification rows viewable by everyone" ON resource_verifications
  FOR SELECT USING (true);

CREATE POLICY "Verification rows editable by authenticated users" ON resource_verifications
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_resource_availability_resource_id
  ON resource_availability (resource_id);

CREATE INDEX IF NOT EXISTS idx_resource_availability_status
  ON resource_availability (availability_status);

CREATE INDEX IF NOT EXISTS idx_resource_verifications_resource_id
  ON resource_verifications (resource_id);

CREATE INDEX IF NOT EXISTS idx_resource_verifications_freshness
  ON resource_verifications (freshness_state);

INSERT INTO resource_availability (
  resource_id,
  availability_status,
  last_confirmed_at,
  confirmation_source,
  confidence_score
)
SELECT
  r.id,
  CASE WHEN r.verified THEN 'open'::availability_status_enum ELSE 'unknown'::availability_status_enum END,
  r.updated_at,
  'local',
  CASE WHEN r.verified THEN 0.95 ELSE 0.50 END
FROM resources r
ON CONFLICT (resource_id) DO UPDATE SET
  availability_status = EXCLUDED.availability_status,
  last_confirmed_at = EXCLUDED.last_confirmed_at,
  confirmation_source = EXCLUDED.confirmation_source,
  confidence_score = EXCLUDED.confidence_score,
  updated_at = NOW();

INSERT INTO resource_verifications (
  resource_id,
  verification_badge,
  data_source_label,
  freshness_state,
  verified_at
)
SELECT
  r.id,
  CASE WHEN r.verified THEN 'verified_partner' ELSE 'unverified' END,
  'Local partner directory',
  CASE
    WHEN r.updated_at >= NOW() - INTERVAL '24 hours' THEN 'fresh'
    WHEN r.updated_at >= NOW() - INTERVAL '72 hours' THEN 'aging'
    ELSE 'stale'
  END,
  CASE WHEN r.verified THEN r.updated_at ELSE NULL END
FROM resources r
ON CONFLICT (resource_id) DO UPDATE SET
  verification_badge = EXCLUDED.verification_badge,
  data_source_label = EXCLUDED.data_source_label,
  freshness_state = EXCLUDED.freshness_state,
  verified_at = EXCLUDED.verified_at,
  updated_at = NOW();
