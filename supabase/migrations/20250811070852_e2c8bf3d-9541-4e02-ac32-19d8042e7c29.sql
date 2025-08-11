-- Add unique constraint if missing (Postgres-compatible)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE t.relname = 'round_votes'
      AND n.nspname = 'public'
      AND c.conname = 'round_votes_one_vote_per_player_per_question'
  ) THEN
    ALTER TABLE public.round_votes
    ADD CONSTRAINT round_votes_one_vote_per_player_per_question
    UNIQUE (game_id, question_index, voter_player_id);
  END IF;
END
$$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_round_votes_agg
  ON public.round_votes (game_id, question_index, target_player_id);

CREATE INDEX IF NOT EXISTS idx_round_votes_created_at
  ON public.round_votes (game_id, created_at);
