-- Create table to persist votes by temporary players (linked to game_players rows)
CREATE TABLE IF NOT EXISTS public.round_votes (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT NOT NULL,
  question_index INTEGER NOT NULL,
  question_text TEXT,
  voter_player_id BIGINT NOT NULL,
  target_player_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security and permissive basic policies for unauthenticated quick games
ALTER TABLE public.round_votes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert votes (quick games without auth)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'round_votes' AND policyname = 'Anyone can insert round votes'
  ) THEN
    CREATE POLICY "Anyone can insert round votes"
    ON public.round_votes
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

-- Allow anyone to view votes (for results display)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'round_votes' AND policyname = 'Anyone can view round votes'
  ) THEN
    CREATE POLICY "Anyone can view round votes"
    ON public.round_votes
    FOR SELECT
    USING (true);
  END IF;
END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_round_votes_game ON public.round_votes(game_id);
CREATE INDEX IF NOT EXISTS idx_round_votes_game_question ON public.round_votes(game_id, question_index);
