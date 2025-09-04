-- Fix all remaining functions with mutable search_path

CREATE OR REPLACE FUNCTION public.update_game_state_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.archive_ai_question()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    INSERT INTO archived_questions (question_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_player_joining()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    game_record RECORD;
BEGIN
    -- Check if the game exists with the provided invitation code
    SELECT * INTO game_record FROM parties WHERE code_invitation = NEW.invite_code;

    IF FOUND THEN
        -- Add the player to the game
        INSERT INTO game_players (game_id, user_id, pseudo_temporaire)
        VALUES (game_record.id, NEW.user_id, NEW.pseudo_temporaire);

        -- Optionally, you can notify other players or perform additional actions here
        RAISE NOTICE 'Player % has joined the game %', NEW.user_id, game_record.id;

        RETURN NEW;
    ELSE
        RAISE EXCEPTION 'Invalid invitation code';
    END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_game_statistics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Incrémenter parties_jouées
    PERFORM update_user_stats(NEW.user_id, 'games_played');
    
    -- Vérifier les badges
    PERFORM check_and_award_badges(NEW.user_id);
    
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_ai_session()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    INSERT INTO ai_usage_history (session_id, parameters)
    VALUES (NEW.id, NEW.parametres_ia);
    
    -- Here you can add logic to trigger an automatic generation if needed
    -- For example, you might call another function or perform additional inserts

    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_stats(user_uuid uuid, stat_name text, increment_value integer DEFAULT 1)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    INSERT INTO user_statistics (user_id, stat_type, stat_value)
    VALUES (user_uuid, stat_name, increment_value)
    ON CONFLICT (user_id, stat_type, period)
    DO UPDATE SET 
        stat_value = user_statistics.stat_value + increment_value,
        updated_at = now();
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_vote_statistics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Incrémenter votes_donnés pour celui qui vote
    PERFORM update_user_stats(NEW.voted_by_user_id, 'votes_given');
    
    -- Incrémenter votes_reçus pour celui qui reçoit le vote
    PERFORM update_user_stats(NEW.voted_for_user_id, 'votes_received');
    
    -- Vérifier les badges pour les deux utilisateurs
    PERFORM check_and_award_badges(NEW.voted_by_user_id);
    PERFORM check_and_award_badges(NEW.voted_for_user_id);
    
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_vote_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    UPDATE game_players
    SET vote_status = true
    WHERE user_id = NEW.voted_by_user_id;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    RETURN upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_realtime_games_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.initialize_player_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    RAISE NOTICE 'Player % has been initialized for game %', NEW.user_id, NEW.game_id;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.archive_finished_game()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    INSERT INTO archived_games (game_id, final_statistics)
    VALUES (NEW.id, jsonb_build_object('final_score', (SELECT SUM(score) FROM game_players WHERE game_id = NEW.id)));
    RETURN NEW;
END;
$function$;