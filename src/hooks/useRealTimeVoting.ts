import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/types/quickGame';

interface Vote {
  id: number;
  game_id: number;
  question_index: number;
  voter_player_id: number;
  target_player_id: number;
  question_text?: string;
  created_at: string;
}

interface VoteResult {
  playerId: string;
  playerName: string;
  count: number;
}

export const useRealTimeVoting = (
  gameId: number | null,
  questionIndex: number,
  players: Player[]
) => {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les votes existants
  useEffect(() => {
    if (!gameId) {
      setIsLoading(false);
      return;
    }

    const loadVotes = async () => {
      const { data, error } = await supabase
        .from('round_votes')
        .select('*')
        .eq('game_id', gameId)
        .eq('question_index', questionIndex);

      if (error) {
        console.error('Erreur chargement votes:', error);
      } else {
        const voteCounts: Record<string, number> = {};
        (data || []).forEach((vote: Vote) => {
          const targetPlayer = players.find(p => String(p.id) === String(vote.target_player_id));
          if (targetPlayer) {
            voteCounts[targetPlayer.id] = (voteCounts[targetPlayer.id] || 0) + 1;
          }
        });
        setVotes(voteCounts);

        // Vérifier si le joueur actuel a déjà voté
        const currentPlayerId = getCurrentPlayerId();
        const playerVote = data?.find(vote => String(vote.voter_player_id) === currentPlayerId);
        setHasVoted(!!playerVote);
      }
      setIsLoading(false);
    };

    loadVotes();
  }, [gameId, questionIndex, players]);

  // Écouter les nouveaux votes en temps réel
  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel(`votes_${gameId}_${questionIndex}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'round_votes',
          filter: `game_id=eq.${gameId},question_index=eq.${questionIndex}`
        },
        (payload) => {
          const newVote = payload.new as Vote;
          const targetPlayer = players.find(p => String(p.id) === String(newVote.target_player_id));
          
          if (targetPlayer) {
            setVotes(prev => ({
              ...prev,
              [targetPlayer.id]: (prev[targetPlayer.id] || 0) + 1
            }));
          }

          // Vérifier si c'est le vote du joueur actuel
          const currentPlayerId = getCurrentPlayerId();
          if (String(newVote.voter_player_id) === currentPlayerId) {
            setHasVoted(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, questionIndex, players]);

  const getCurrentPlayerId = () => {
    const playerData = sessionStorage.getItem('playerData');
    return playerData ? JSON.parse(playerData).id : null;
  };

  const submitVote = async (targetPlayerId: string, questionText: string) => {
    if (!gameId || hasVoted) return false;

    const currentPlayerId = getCurrentPlayerId();
    if (!currentPlayerId) return false;

    const { error } = await supabase
      .from('round_votes')
      .insert({
        game_id: gameId,
        question_index: questionIndex,
        voter_player_id: parseInt(currentPlayerId),
        target_player_id: parseInt(targetPlayerId),
        question_text: questionText
      });

    if (error) {
      console.error('Erreur soumission vote:', error);
      return false;
    }

    return true;
  };

  const getResults = (): VoteResult[] => {
    return Object.entries(votes).map(([playerId, count]) => {
      const player = players.find(p => p.id === playerId);
      return {
        playerId,
        playerName: player?.name || 'Joueur inconnu',
        count
      };
    }).sort((a, b) => b.count - a.count);
  };

  const getWinner = (): VoteResult | null => {
    const results = getResults();
    if (results.length === 0) return null;
    
    const maxVotes = results[0].count;
    const winners = results.filter(r => r.count === maxVotes);
    
    // S'il y a égalité, retourner null
    if (winners.length > 1) return null;
    
    return results[0];
  };

  return {
    votes,
    hasVoted,
    isLoading,
    submitVote,
    getResults,
    getWinner
  };
};