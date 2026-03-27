CREATE TABLE IF NOT EXISTS meta_oauth_states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state_token TEXT NOT NULL UNIQUE,
  clerk_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '15 minutes',
  used BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_meta_oauth_states_token ON meta_oauth_states(state_token);
