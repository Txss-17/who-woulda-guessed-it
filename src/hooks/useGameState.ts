import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GameState {
  id: string;
  party_id: number;
  current_question_index: number;
  current_phase: 'waiting' | 'voting' | 'results' | 'finished';
  phase_start_time: string;
  total_questions: number;
  updated_at: string;
}

export const useGameState = (partyId: number | null) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'état initial du jeu
  useEffect(() => {
    if (!partyId) {
      setIsLoading(false);
      return;
    }

    const loadGameState = async () => {
      const { data, error } = await supabase
        .from('game_state')
        .select('*')
        .eq('party_id', partyId)
        .maybeSingle();

      if (error) {
        console.error('Erreur chargement game_state:', error);
      } else if (data) {
        setGameState(data as any);
      }
      setIsLoading(false);
    };

    loadGameState();
  }, [partyId]);

  // Écouter les changements temps réel
  useEffect(() => {
    if (!partyId) return;

    const channel = supabase
      .channel(`game_state_${partyId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'game_state',
          filter: `party_id=eq.${partyId}`
        },
        (payload) => {
          if (payload.new) {
            setGameState(payload.new as any);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partyId]);

  const updateGameState = async (updates: Partial<GameState>) => {
    if (!partyId) return;

    const { error } = await supabase
      .from('game_state')
      .update(updates)
      .eq('party_id', partyId);

    if (error) {
      console.error('Erreur mise à jour game_state:', error);
    }
  };

  const createGameState = async (totalQuestions: number) => {
    if (!partyId) return;

    const { data, error } = await supabase
      .from('game_state')
      .insert({
        party_id: partyId,
        current_question_index: 0,
        current_phase: 'waiting',
        total_questions: totalQuestions
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Erreur création game_state:', error);
    } else if (data) {
      setGameState(data as any);
    }
  };

  return {
    gameState,
    isLoading,
    updateGameState,
    createGameState
  };
};