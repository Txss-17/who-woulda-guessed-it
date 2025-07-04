
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Player } from '@/types/onlineGame';

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
  
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameResults, setGameResults] = useState<QuestionResult[]>([]);
  
  useEffect(() => {
    const playerDataStr = sessionStorage.getItem('playerData');
    if (playerDataStr) {
      const playerData = JSON.parse(playerDataStr);
      setCurrentPlayer({
        ...playerData,
        status: 'online'
      });
    }

    const storedGameData = sessionStorage.getItem('gameData');
    if (storedGameData) {
      const data = JSON.parse(storedGameData);
      const playerExists = data.players.some((p: Player) => p.id === JSON.parse(playerDataStr || '{}').id);
      if (playerExists) {
        setGameData(data);
      } else {
        toast({
          title: "Erreur",
          description: "Vous ne faites pas partie de cette partie",
          variant: "destructive"
        });
        navigate('/');
      }
    } else {
      toast({
        title: "Erreur",
        description: "Données de jeu non trouvées",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [navigate, toast]);

  const nextQuestion = (questionResult?: QuestionResult) => {
    if (!gameData) return;
    
    // Ajouter le résultat de la question actuelle s'il est fourni
    if (questionResult) {
      setGameResults(prev => [...prev, questionResult]);
    }
    
    if (currentQuestionIndex < gameData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Fin de partie
      setGameOver(true);
      
      // Sauvegarder l'historique de la partie avec tous les résultats
      const gameHistory = JSON.parse(sessionStorage.getItem('gameHistory') || '[]');
      const finalResults = questionResult ? [...gameResults, questionResult] : gameResults;
      
      const newGameHistory = [
        ...gameHistory,
        {
          gameId: gameCode,
          date: new Date().toISOString(),
          gameType: "friendly",
          playerCount: gameData.players.length,
          questions: finalResults,
          totalQuestions: gameData.questions.length
        }
      ];
      sessionStorage.setItem('gameHistory', JSON.stringify(newGameHistory));
      sessionStorage.setItem('finalGameResults', JSON.stringify(finalResults));
    }
  };

  return {
    gameData,
    currentQuestionIndex,
    gameOver,
    currentPlayer,
    gameCode,
    gameResults,
    nextQuestion
  };
};
