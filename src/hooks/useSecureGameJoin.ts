
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { validateGameCode, joinGameRateLimiter, logSecurityEvent } from '@/utils/security';
import { useToast } from '@/hooks/use-toast';

export const useSecureGameJoin = () => {
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();

  const joinGameSecurely = async (gameCode: string, password?: string) => {
    try {
      setIsJoining(true);

      // Rate limiting check
      const userIdentifier = `${Date.now()}-${Math.random()}`;
      if (!joinGameRateLimiter.isAllowed(userIdentifier)) {
        await logSecurityEvent('rate_limit_exceeded', { action: 'join_game', gameCode });
        toast({
          title: "Trop de tentatives",
          description: "Veuillez attendre avant de réessayer",
          variant: "destructive"
        });
        return { success: false, error: 'Rate limit exceeded' };
      }

      // Input validation
      if (!validateGameCode(gameCode)) {
        await logSecurityEvent('invalid_game_code', { gameCode });
        toast({
          title: "Code invalide",
          description: "Le code de partie doit contenir 6-8 caractères alphanumériques",
          variant: "destructive"
        });
        return { success: false, error: 'Invalid game code format' };
      }

      // Verify user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        await logSecurityEvent('unauthorized_join_attempt', { gameCode });
        toast({
          title: "Non autorisé",
          description: "Vous devez être connecté pour rejoindre une partie",
          variant: "destructive"
        });
        return { success: false, error: 'User not authenticated' };
      }

      // Check if party exists and is accessible
      const { data: party, error: partyError } = await supabase
        .from('parties')
        .select('*')
        .eq('code_invitation', gameCode)
        .single();

      if (partyError || !party) {
        await logSecurityEvent('party_not_found', { gameCode, userId: user.id });
        toast({
          title: "Partie introuvable",
          description: "Cette partie n'existe pas ou n'est plus disponible",
          variant: "destructive"
        });
        return { success: false, error: 'Party not found' };
      }

      // Check party status
      if (party.statut !== 'waiting') {
        await logSecurityEvent('invalid_party_status', { 
          gameCode, 
          status: party.statut, 
          userId: user.id 
        });
        toast({
          title: "Partie non disponible",
          description: "Cette partie n'accepte plus de nouveaux joueurs",
          variant: "destructive"
        });
        return { success: false, error: 'Party not accepting players' };
      }

      // Check password if required
      if (party.password_protected && party.party_password !== password) {
        await logSecurityEvent('invalid_password', { gameCode, userId: user.id });
        toast({
          title: "Mot de passe incorrect",
          description: "Le mot de passe fourni est incorrect",
          variant: "destructive"
        });
        return { success: false, error: 'Invalid password' };
      }

      // Check if user is already in the party
      const { data: existingPlayer } = await supabase
        .from('game_players')
        .select('id')
        .eq('game_id', party.id)
        .eq('user_id', user.id)
        .single();

      if (existingPlayer) {
        await logSecurityEvent('already_in_party', { gameCode, userId: user.id });
        toast({
          title: "Déjà dans la partie",
          description: "Vous participez déjà à cette partie",
          variant: "destructive"
        });
        return { success: false, error: 'Already in party' };
      }

      // Check party capacity
      const { count: playerCount } = await supabase
        .from('game_players')
        .select('*', { count: 'exact', head: true })
        .eq('game_id', party.id);

      if (playerCount && playerCount >= party.max_players) {
        await logSecurityEvent('party_full', { gameCode, userId: user.id });
        toast({
          title: "Partie complète",
          description: "Cette partie a atteint sa capacité maximale",
          variant: "destructive"
        });
        return { success: false, error: 'Party full' };
      }

      // Join the party
      const { error: joinError } = await supabase
        .from('game_players')
        .insert({
          game_id: party.id,
          user_id: user.id
        });

      if (joinError) {
        await logSecurityEvent('join_error', { 
          gameCode, 
          userId: user.id, 
          error: joinError.message 
        });
        toast({
          title: "Erreur",
          description: "Impossible de rejoindre la partie",
          variant: "destructive"
        });
        return { success: false, error: joinError.message };
      }

      await logSecurityEvent('successful_join', { gameCode, userId: user.id });
      toast({
        title: "Partie rejointe !",
        description: "Vous avez rejoint la partie avec succès"
      });

      return { success: true, party };

    } catch (error) {
      await logSecurityEvent('join_exception', { 
        gameCode, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      toast({
        title: "Erreur inattendue",
        description: "Une erreur s'est produite lors de la tentative de rejoindre la partie",
        variant: "destructive"
      });
      return { success: false, error: 'Unexpected error' };
    } finally {
      setIsJoining(false);
    }
  };

  return {
    joinGameSecurely,
    isJoining
  };
};
