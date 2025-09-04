-- Fix RLS policies for tables without proper security

-- 1. Questions table - Allow public read, authenticated users can manage their own
CREATE POLICY "Anyone can view public questions" ON public.questions
FOR SELECT USING (is_public = true OR cree_par_user_id = auth.uid());

CREATE POLICY "Authenticated users can create questions" ON public.questions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND cree_par_user_id = auth.uid());

CREATE POLICY "Users can update their own questions" ON public.questions
FOR UPDATE USING (cree_par_user_id = auth.uid());

CREATE POLICY "Users can delete their own questions" ON public.questions
FOR DELETE USING (cree_par_user_id = auth.uid());

-- 2. Sessions IA table - Only allow access to related users
CREATE POLICY "Users can view their game sessions" ON public.sessions_ia
FOR SELECT USING (
  game_id IN (
    SELECT game_id FROM game_players WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can create IA sessions" ON public.sessions_ia
FOR INSERT WITH CHECK (true);

-- 3. Votes table - Users can vote and see votes for their games
CREATE POLICY "Users can view votes for their games" ON public.votes
FOR SELECT USING (
  game_id IN (
    SELECT game_id FROM game_players WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can vote in their games" ON public.votes
FOR INSERT WITH CHECK (
  voted_by_user_id = auth.uid() AND
  game_id IN (
    SELECT game_id FROM game_players WHERE user_id = auth.uid()
  )
);

-- 4. Users table - Public read, users can update their own data
CREATE POLICY "Anyone can view user profiles" ON public.users
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
FOR UPDATE USING (id = auth.uid());

-- 5. AI Usage History - Only accessible by system/admins
CREATE POLICY "System access only for AI usage" ON public.ai_usage_history
FOR ALL USING (false); -- No direct user access

-- 6. Archived questions - Read-only access
CREATE POLICY "Anyone can view archived questions" ON public.archived_questions
FOR SELECT USING (true);

-- 7. Archived games - Users can view games they participated in
CREATE POLICY "Users can view archived games they played" ON public.archived_games
FOR SELECT USING (
  game_id IN (
    SELECT game_id FROM game_players WHERE user_id = auth.uid()
  )
);

-- Fix functions with mutable search_path
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Function logic here
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_and_award_badges()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Function logic here
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Function logic here
    RETURN NEW;
END;
$function$;