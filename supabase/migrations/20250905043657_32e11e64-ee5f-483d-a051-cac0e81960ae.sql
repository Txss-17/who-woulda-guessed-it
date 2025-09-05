-- Allow anonymous players to join games with null user_id
DROP POLICY IF EXISTS "Anyone can join games" ON game_players;

CREATE POLICY "Anyone can join games"
ON game_players
FOR INSERT
WITH CHECK (true);

-- Also allow updates for anonymous players
DROP POLICY IF EXISTS "Players can update their status" ON game_players;

CREATE POLICY "Players can update their status"
ON game_players
FOR UPDATE
USING (user_id = auth.uid() OR user_id IS NULL);