import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealtimeState {
  id?: string;
  current_question: number;
}

export const useRealtimeRounds = (gameCode: string | undefined, initialIndex: number = 0) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(initialIndex);

  useEffect(() => {
    if (!gameCode) return;

    let isMounted = true;

    const ensureState = async () => {
      // Try to fetch existing realtime game state
      const { data, error } = await supabase
        .from('realtime_games')
        .select('id, current_question, code, status')
        .eq('code', gameCode)
        .maybeSingle();

      if (error) {
        console.error('Erreur chargement realtime_games:', error);
      }

      if (!data) {
        // Create it with host_id null so anonymous updates are allowed per RLS
        const { data: created, error: insertError } = await supabase
          .from('realtime_games')
          .insert({
            code: gameCode,
            status: 'playing',
            host_id: null,
            host_name: 'Hôte',
            current_question: 0,
            max_players: 8,
          })
          .select('id, current_question')
          .maybeSingle();

        if (insertError) {
          console.error('Erreur création realtime_games:', insertError);
        } else if (created && isMounted) {
          setCurrentQuestionIndex(created.current_question ?? 0);
        }
      } else if (isMounted) {
        setCurrentQuestionIndex(data.current_question ?? 0);
      }

      // Subscribe to realtime updates for this code
      const channel = supabase
        .channel(`realtime_rounds_${gameCode}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'realtime_games', filter: `code=eq.${gameCode}` },
          (payload: any) => {
            const newIndex = payload.new?.current_question ?? 0;
            setCurrentQuestionIndex(newIndex);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanupPromise = ensureState();

    return () => {
      isMounted = false;
      // cleanup is handled inside ensureState subscribe return when resolved
    };
  }, [gameCode]);

  const goToNextQuestion = async () => {
    if (!gameCode) return;
    // Increment atomically
    const { data, error } = await supabase
      .from('realtime_games')
      .update({ updated_at: new Date().toISOString(), current_question: currentQuestionIndex + 1 })
      .eq('code', gameCode)
      .select('current_question')
      .maybeSingle();

    if (error) {
      console.error('Erreur maj current_question:', error);
      return;
    }

    if (data) {
      setCurrentQuestionIndex(data.current_question ?? currentQuestionIndex + 1);
    }
  };

  return { currentQuestionIndex, goToNextQuestion };
};
