-- Créer la table party_questions pour stocker les questions spécifiques à chaque partie
CREATE TABLE public.party_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id BIGINT NOT NULL,
  question_text TEXT NOT NULL,
  question_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (party_id) REFERENCES public.parties(id) ON DELETE CASCADE,
  UNIQUE(party_id, question_index)
);

-- Créer la table game_state pour gérer l'état en cours des parties
CREATE TABLE public.game_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id BIGINT NOT NULL UNIQUE,
  current_question_index INTEGER NOT NULL DEFAULT 0,
  current_phase TEXT NOT NULL DEFAULT 'waiting',
  phase_start_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  total_questions INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (party_id) REFERENCES public.parties(id) ON DELETE CASCADE
);

-- Ajouter des index pour les performances (seulement les nouveaux)
CREATE INDEX idx_party_questions_party_id ON public.party_questions(party_id);
CREATE INDEX idx_party_questions_index ON public.party_questions(party_id, question_index);
CREATE INDEX idx_game_state_party_id ON public.game_state(party_id);

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.party_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_state ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour party_questions
CREATE POLICY "Anyone can view party questions" 
ON public.party_questions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert party questions" 
ON public.party_questions 
FOR INSERT 
WITH CHECK (true);

-- Politiques RLS pour game_state
CREATE POLICY "Anyone can view game state" 
ON public.game_state 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update game state" 
ON public.game_state 
FOR ALL 
USING (true);

-- Activer la réplication temps réel sur les tables critiques
ALTER TABLE public.party_questions REPLICA IDENTITY FULL;
ALTER TABLE public.game_state REPLICA IDENTITY FULL;
ALTER TABLE public.round_votes REPLICA IDENTITY FULL;
ALTER TABLE public.parties REPLICA IDENTITY FULL;
ALTER TABLE public.game_players REPLICA IDENTITY FULL;

-- Ajouter les tables à la publication realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.party_questions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_state;
ALTER PUBLICATION supabase_realtime ADD TABLE public.round_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.parties;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_players;

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.update_game_state_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement updated_at sur game_state
CREATE TRIGGER update_game_state_updated_at
  BEFORE UPDATE ON public.game_state
  FOR EACH ROW
  EXECUTE FUNCTION public.update_game_state_updated_at();