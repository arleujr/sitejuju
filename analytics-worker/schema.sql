CREATE TABLE IF NOT EXISTS visits (
  visit_id TEXT PRIMARY KEY,
  recipient TEXT NOT NULL DEFAULT 'public',
  device TEXT NOT NULL DEFAULT 'unknown',
  page_path TEXT NOT NULL DEFAULT '/',
  first_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  max_score INTEGER NOT NULL DEFAULT 0,
  max_stage_index INTEGER NOT NULL DEFAULT 0,
  max_stage_id TEXT NOT NULL DEFAULT 'hero',
  max_stage_label TEXT NOT NULL DEFAULT 'Hero',
  max_stage_progress INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  vote TEXT CHECK (vote IN ('yes','no') OR vote IS NULL),
  voted_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_visits_recipient ON visits(recipient);
CREATE INDEX IF NOT EXISTS idx_visits_last_seen ON visits(last_seen);
