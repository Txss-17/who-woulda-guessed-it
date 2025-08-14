-- Ajouter les politiques RLS manquantes pour la table parties
-- Permettre à tout le monde de créer une partie (car c'est un jeu public)
CREATE POLICY "Anyone can create parties" 
ON public.parties 
FOR INSERT 
WITH CHECK (true);

-- Permettre à tout le monde de voir les parties publiques
CREATE POLICY "Anyone can view parties" 
ON public.parties 
FOR SELECT 
USING (true);

-- Permettre à l'hôte de modifier sa partie
CREATE POLICY "Host can update their party" 
ON public.parties 
FOR UPDATE 
USING (host_user_id = auth.uid() OR host_user_id IS NULL);

-- Ajouter les politiques RLS manquantes pour la table game_players
-- Permettre à tout le monde de rejoindre une partie
CREATE POLICY "Anyone can join games" 
ON public.game_players 
FOR INSERT 
WITH CHECK (true);

-- Permettre à tout le monde de voir les joueurs d'une partie
CREATE POLICY "Anyone can view game players" 
ON public.game_players 
FOR SELECT 
USING (true);

-- Permettre aux joueurs de modifier leur statut
CREATE POLICY "Players can update their status" 
ON public.game_players 
FOR UPDATE 
USING (user_id = auth.uid() OR user_id IS NULL);