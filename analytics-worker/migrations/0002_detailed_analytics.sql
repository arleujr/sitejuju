-- Migração V2 para uma instalação que já possui a tabela visits.
-- É idempotente: pode ser executada mais de uma vez.
CREATE TABLE IF NOT EXISTS recipient_devices (
  recipient TEXT NOT NULL DEFAULT 'public',
  device_id TEXT NOT NULL,
  device_class TEXT NOT NULL DEFAULT 'unknown',
  browser TEXT NOT NULL DEFAULT 'unknown',
  os TEXT NOT NULL DEFAULT 'unknown',
  locale TEXT,
  client_timezone TEXT,
  city TEXT,
  region TEXT,
  country_code TEXT,
  cf_timezone TEXT,
  colo TEXT,
  first_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (recipient, device_id)
);
CREATE INDEX IF NOT EXISTS idx_recipient_devices_recipient ON recipient_devices(recipient);
CREATE INDEX IF NOT EXISTS idx_recipient_devices_last_seen ON recipient_devices(last_seen);

CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  recipient TEXT NOT NULL DEFAULT 'public',
  device_id TEXT NOT NULL,
  device_class TEXT NOT NULL DEFAULT 'unknown',
  browser TEXT NOT NULL DEFAULT 'unknown',
  os TEXT NOT NULL DEFAULT 'unknown',
  locale TEXT,
  client_timezone TEXT,
  entry_path TEXT NOT NULL DEFAULT '/',
  referrer TEXT,
  city TEXT,
  region TEXT,
  country_code TEXT,
  cf_timezone TEXT,
  colo TEXT,
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TEXT,
  active_seconds INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL DEFAULT 0,
  max_stage_index INTEGER NOT NULL DEFAULT 0,
  max_stage_id TEXT NOT NULL DEFAULT 'hero',
  max_stage_label TEXT NOT NULL DEFAULT 'Hero',
  max_stage_progress INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  vote TEXT CHECK (vote IN ('yes','no') OR vote IS NULL),
  voted_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_recipient ON sessions(recipient);
CREATE INDEX IF NOT EXISTS idx_sessions_device ON sessions(recipient,device_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_sessions_last_seen ON sessions(last_seen);
