-- Créer une table pour les parties en temps réel
CREATE TABLE IF NOT EXISTS public.realtime_games (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  host_id uuid REFERENCES auth.users(id),
  host_name text NOT NULL,
  status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  max_players integer DEFAULT 8,
  players jsonb DEFAULT '[]'::jsonb,
  questions jsonb DEFAULT '[]'::jsonb,
  current_question integer DEFAULT 0,
  game_type text DEFAULT 'classic',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Activer les mises à jour en temps réel
ALTER TABLE public.realtime_games REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.realtime_games;

-- RLS policies
ALTER TABLE public.realtime_games ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les parties publiques
CREATE POLICY "Everyone can view public games" ON public.realtime_games
FOR SELECT USING (true);

-- Les hôtes peuvent créer leurs parties
CREATE POLICY "Hosts can create games" ON public.realtime_games
FOR INSERT WITH CHECK (auth.uid() = host_id OR host_id IS NULL);

-- Les hôtes peuvent modifier leurs parties
CREATE POLICY "Hosts can update their games" ON public.realtime_games
FOR UPDATE USING (auth.uid() = host_id OR host_id IS NULL);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_realtime_games_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour auto-update
CREATE TRIGGER update_realtime_games_updated_at
  BEFORE UPDATE ON public.realtime_games
  FOR EACH ROW
  EXECUTE FUNCTION update_realtime_games_updated_at();