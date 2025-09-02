
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Player } from '@/types/quickGame';
import { useGameState } from '@/hooks/useGameState';
import { usePartyQuestions } from '@/hooks/usePartyQuestions';
import { useRealtimeGameSync } from '@/hooks/useRealtimeGameSync';
import { supabase } from '@/integrations/supabase/client';

interface GameData {
  gameCode: string;
  players: Player[];
  questions: string[];
  aiGenerated?: boolean;
}

interface QuestionResult {
  questionText: string;
  votes: { playerId: string; playerName: string; count: number }[];
  winner: { playerId: string; playerName: string };
}

export const usePlayGame = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Utiliser les nouveaux hooks Supabase
  const { gameData: realtimeGameData, isLoading: gameLoading } = useRealtimeGameSync(gameCode || null);
  const { gameState, updateGameState } = useGameState(realtimeGameData?.id || null);
  const { questions } = usePartyQuestions(realtimeGameData?.id || null);
  
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameResults, setGameResults] = useState<QuestionResult[]>([]);
  
  // Utiliser l'index de question depuis game_state
  const currentQuestionIndex = gameState?.current_question_index || 0;
  const gameOver = gameState?.current_phase === 'finished';
  
  useEffect(() => {
    const playerDataStr = sessionStorage.getItem('playerData');
    if (playerDataStr) {
      const playerData = JSON.parse(playerDataStr);
      setCurrentPlayer({
        ...playerData,
        status: 'onroom' as const
      });
    }

    // Vérifier si le joueur fait partie de cette partie
    if (realtimeGameData && playerDataStr) {
      const playerData = JSON.parse(playerDataStr);
      const playerExists = realtimeGameData.players.some((p: Player) => p.id === playerData.id);
      if (!playerExists) {
        toast({
          title: "Erreur",
          description: "Vous ne faites pas partie de cette partie",
          variant: "destructive"
        });
        navigate('/');
      }
    }
  }, [realtimeGameData, navigate, toast]);

  const nextQuestion = async (questionResult?: QuestionResult) => {
    if (!gameState || !realtimeGameData) return;
    
    // Ajouter le résultat de la question actuelle s'il est fourni
    if (questionResult) {
      setGameResults(prev => [...prev, questionResult]);
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      // Passer à la question suivante
      await updateGameState({
        current_question_index: currentQuestionIndex + 1,
        current_phase: 'voting',
        phase_start_time: new Date().toISOString()
      });
    } else {
      // Fin de partie
      await updateGameState({
        current_phase: 'finished'
      });
      
      // Marquer la partie comme terminée
      await supabase
        .from('parties')
        .update({ statut: 'finished' })
        .eq('id', realtimeGameData.id);

      const gameHistory = JSON.parse(sessionStorage.getItem('gameHistory') || '[]');
      const finalResults = questionResult ? [...gameResults, questionResult] : gameResults;
      
      const newGameHistory = [
        ...gameHistory,
        {
          gameId: gameCode,
          date: new Date().toISOString(),
          gameType: "friendly",
          playerCount: realtimeGameData.players.length,
          questions: finalResults,
          totalQuestions: questions.length
        }
      ];
      sessionStorage.setItem('gameHistory', JSON.stringify(newGameHistory));
      sessionStorage.setItem('finalGameResults', JSON.stringify(finalResults));
    }
  };

  return {
    gameData: realtimeGameData ? {
      gameCode: realtimeGameData.code,
      players: realtimeGameData.players,
      questions: questions.map(q => q.question_text),
      aiGenerated: true
    } : null,
    gameId: realtimeGameData?.id,
    currentQuestionIndex,
    gameOver,
    currentPlayer,
    gameCode,
    gameResults,
    nextQuestion,
    isLoading: gameLoading
  };
};
