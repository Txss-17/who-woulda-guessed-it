-- 1) Empêcher les doubles votes pour une même question par le même joueur
ALTER TABLE public.round_votes
ADD CONSTRAINT IF NOT EXISTS round_votes_one_vote_per_player_per_question
UNIQUE (game_id, question_index, voter_player_id);

-- 2) Index pour agrégations fréquemment utilisées (compte des cibles par question)
CREATE INDEX IF NOT EXISTS idx_round_votes_agg
ON public.round_votes (game_id, question_index, target_player_id);

-- 3) Index secondaire utile pour diagnostics/tri récents
CREATE INDEX IF NOT EXISTS idx_round_votes_created_at
ON public.round_votes (game_id, created_at);
