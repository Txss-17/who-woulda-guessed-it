
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Party, PartySettings, PartyType } from '@/types/party';
import { toast } from 'sonner';

export const useParty = () => {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(false);

  const createParty = async (
    gameType: string,
    partyType: PartyType,
    settings: PartySettings,
    userId: string
  ) => {
    try {
      setLoading(true);
      
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data, error } = await supabase
        .from('parties')
        .insert({
          code_invitation: inviteCode,
          type_jeu: gameType,
          mode: 'standard',
          statut: 'waiting',
          party_type: partyType,
          host_user_id: userId,
          max_players: settings.maxPlayers,
          time_per_turn: settings.timePerTurn,
          number_of_rounds: settings.numberOfRounds,
          anonymous_voting: settings.anonymousVoting,
          allow_join_after_start: settings.allowJoinAfterStart,
          anti_cheat_enabled: settings.antiCheatEnabled,
          password_protected: settings.passwordProtected,
          party_password: settings.partyPassword,
          settings: settings
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Partie créée avec succès !');
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la partie:', error);
      toast.error('Erreur lors de la création de la partie');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicParties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('parties')
        .select('*')
        .eq('party_type', 'public')
        .eq('statut', 'waiting')
        .order('date_creation', { ascending: false });

      if (error) throw error;
      setParties(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des parties:', error);
      toast.error('Erreur lors de la récupération des parties');
    } finally {
      setLoading(false);
    }
  };

  const joinParty = async (partyId: number, userId: string, password?: string) => {
    try {
      setLoading(true);
      
      // Vérifier si la partie existe et est disponible
      const { data: party, error: partyError } = await supabase
        .from('parties')
        .select('*')
        .eq('id', partyId)
        .single();

      if (partyError) throw partyError;

      // Vérifier le mot de passe si nécessaire
      if (party.password_protected && party.party_password !== password) {
        throw new Error('Mot de passe incorrect');
      }

      // Ajouter le joueur à la partie
      const { error: playerError } = await supabase
        .from('game_players')
        .insert({
          game_id: partyId,
          user_id: userId
        });

      if (playerError) throw playerError;

      toast.success('Partie rejointe avec succès !');
      return party;
    } catch (error) {
      console.error('Erreur lors de la jointure de la partie:', error);
      toast.error('Erreur lors de la jointure de la partie');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    parties,
    loading,
    createParty,
    fetchPublicParties,
    joinParty
  };
};
