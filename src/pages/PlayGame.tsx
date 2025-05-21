
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Confetti from '@/components/Confetti';
import QuestionCard from '@/components/QuestionCard';
import MessagingDialog from '@/components/messaging/MessagingDialog';
import { Player } from '@/types/onlineGame';
import { useGameVotes } from '@/hooks/useGameVotes';
import GameHeader from '@/components/game/GameHeader';
import VotingPhase from '@/components/game/VotingPhase';
import ResultsPhase from '@/components/game/ResultsPhase';
import GameResult from '@/components/game/GameResult';

interface GameData {
  gameCode: string;
  players: Player[];
  questions: string[];
  aiGenerated?: boolean;
}

const PlayGame = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  
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
      setGameData(JSON.parse(storedGameData));
    } else {
      toast({
        title: "Erreur",
        description: "Données de jeu non trouvées",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [navigate, toast]);
  
  const {
    selectedPlayer,
    votingPhase,
    votes,
    showConfetti,
    gameResults,
    handleVote,
    confirmVote,
    getWinningPlayer,
    resetVotingState,
    setGameResults
  } = useGameVotes({ players: gameData?.players || [] });
  
  const nextQuestion = () => {
    if (!gameData) return;
    
    if (currentQuestionIndex < gameData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetVotingState();
    } else {
      setGameOver(true);
      
      // Save game results to session storage for history viewing
      const gameHistory = JSON.parse(sessionStorage.getItem('gameHistory') || '[]');
      const newGameHistory = [
        ...gameHistory,
        {
          gameId: gameCode,
          date: new Date().toISOString(),
          gameType: "friendly",
          playerCount: gameData.players.length,
          questions: gameResults
        }
      ];
      sessionStorage.setItem('gameHistory', JSON.stringify(newGameHistory));
    }
  };
  
  const handleConfirmVote = () => {
    if (!gameData) return;
    confirmVote(gameData.questions[currentQuestionIndex]);
  };
  
  const winningPlayer = getWinningPlayer();
  
  if (!gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du jeu...</p>
      </div>
    );
  }
  
  if (gameOver) {
    return <GameResult gameCode={gameCode} gameData={gameData} gameResults={gameResults} />;
  }
  
  const currentQuestion = gameData.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-4 px-4">
      <Confetti active={showConfetti} />
      
      <div className="container mx-auto max-w-3xl">
        <GameHeader 
          playersCount={gameData.players.length}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={gameData.questions.length}
          onOpenMessaging={() => setIsMessagingOpen(true)}
        />
        
        <div className="mb-8">
          <QuestionCard 
            question={currentQuestion} 
            isAIGenerated={gameData.aiGenerated}
          />
        </div>
        
        {votingPhase ? (
          <VotingPhase 
            players={gameData.players}
            selectedPlayer={selectedPlayer}
            handleVote={handleVote}
            confirmVote={handleConfirmVote}
          />
        ) : (
          <ResultsPhase 
            players={gameData.players}
            votes={votes}
            currentQuestion={currentQuestion}
            winningPlayer={winningPlayer}
            nextQuestion={nextQuestion}
          />
        )}
      </div>
      
      {currentPlayer && (
        <MessagingDialog
          open={isMessagingOpen}
          onOpenChange={setIsMessagingOpen}
          gameId={gameCode}
          currentUserId={currentPlayer.id}
          currentUserName={currentPlayer.name}
          players={gameData.players}
        />
      )}
    </div>
  );
};

export default PlayGame;
