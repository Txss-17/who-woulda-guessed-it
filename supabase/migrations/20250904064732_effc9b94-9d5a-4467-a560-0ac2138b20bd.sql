-- Fix the last remaining function with mutable search_path
CREATE OR REPLACE FUNCTION public.check_and_award_badges(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    badge_record RECORD;
    user_stat INTEGER;
BEGIN
    FOR badge_record IN SELECT * FROM badges LOOP
        IF NOT EXISTS (SELECT 1 FROM user_badges WHERE user_id = user_uuid AND badge_id = badge_record.id) THEN
            SELECT COALESCE(stat_value, 0) INTO user_stat
            FROM user_statistics 
            WHERE user_id = user_uuid 
            AND stat_type = badge_record.condition_type 
            AND period = 'all_time';
            
            IF user_stat >= badge_record.condition_value THEN
                INSERT INTO user_badges (user_id, badge_id) VALUES (user_uuid, badge_record.id);
            END IF;
        END IF;
    END LOOP;
END;
$function$;