CREATE TABLE IF NOT EXISTS admin_password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  admin_id BIGINT NOT NULL
    REFERENCES admin_users(id)
    ON DELETE CASCADE,

  code_hash TEXT NOT NULL,

  expires_at TIMESTAMPTZ NOT NULL,

  used BOOLEAN NOT NULL DEFAULT FALSE,

  attempts SMALLINT NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  used_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS admin_password_resets_admin_index
ON admin_password_resets(admin_id, created_at DESC);

CREATE INDEX IF NOT EXISTS admin_password_resets_expiry_index
ON admin_password_resets(expires_at);

DELETE FROM admin_password_resets
WHERE expires_at < NOW() - INTERVAL '1 day';