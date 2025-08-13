-- Fix: Protect profiles table and expose only safe public fields via definer function/views

-- 1) Drop existing overly permissive SELECT policies on profiles
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN 
    SELECT polname FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles;', pol.polname);
  END LOOP;
END $$;

-- 2) Ensure RLS enabled on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3) Restrictive SELECT policy: users can view only their own profile
CREATE POLICY "Profiles viewable by owner only"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Keep existing INSERT/UPDATE/DELETE owner policies (already present in the project)

-- 4) Create a SECURITY DEFINER function to expose only safe public columns
CREATE OR REPLACE FUNCTION public.profiles_public()
RETURNS TABLE (id uuid, pseudo text, avatar_url text)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT id, pseudo, avatar_url
  FROM public.profiles;
$$;
-- Constrain search path for security
ALTER FUNCTION public.profiles_public() SET search_path = public;

-- Allow API roles to execute the function
GRANT EXECUTE ON FUNCTION public.profiles_public() TO anon, authenticated;

-- 5) Public-facing view of profiles using the definer function (optional utility)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT * FROM public.profiles_public();

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 6) Public leaderboard view that safely joins pseudo/avatar_url without exposing private fields
CREATE OR REPLACE VIEW public.leaderboards_public AS
SELECT 
  l.*, 
  pp.pseudo, 
  pp.avatar_url
FROM public.leaderboards l
LEFT JOIN public.profiles_public() pp
  ON pp.id = l.user_id;

GRANT SELECT ON public.leaderboards_public TO anon, authenticated;