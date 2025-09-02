import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayGame } from '@/hooks/usePlayGame';
import { useRealtimeRounds } from '@/hooks/useRealtimeRounds';
import { Player } from '@/types/quickGame';
import GameContainer from '@/components/game/GameContainer';
import GameResult from '@/components/game/GameResult';

const PlayGame = () => {
  const navigate = useNavigate();
  const { gameCode } = useParams();
  const [localPlayer, setLocalPlayer] = useState<Player | null>(null); 
  const {
    gameData,
    gameId,
    currentQuestionIndex,
    gameOver,
    currentPlayer: hookPlayer,
    gameCode: gameCodeFromHook,
    nextQuestion,
    isLoading
  } = usePlayGame();

  const { currentQuestionIndex: syncedIndex, goToNextQuestion } = useRealtimeRounds(gameCode, currentQuestionIndex);
  const displayIndex = syncedIndex ?? currentQuestionIndex;

  // Lecture de sessionStorage si le hook ne renvoie pas encore le joueur
  useEffect(() => {
    if (!hookPlayer) {
      const playerStr = sessionStorage.getItem('playerData');
      if (playerStr) {
        const parsedPlayer = JSON.parse(playerStr);
        setLocalPlayer(parsedPlayer);
      }
    }
  }, [hookPlayer]);

  const currentPlayer = hookPlayer || localPlayer;

  // Débogage
  console.log("gameData", gameData);
  console.log("currentPlayer", currentPlayer);

  if (isLoading || !gameData || !currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du jeu...</p>
      </div>
    );
  }
  
  if (gameOver) {
    return <GameResult gameCode={gameCode} gameData={gameData} gameResults={[]} />;
  }
  
  const currentQuestion = gameData.questions[displayIndex];

  return (
    <GameContainer
      gameCode={gameCode}
      gameId={gameId}
      players={gameData.players}
      currentPlayer={currentPlayer}
      currentQuestion={currentQuestion}
      currentQuestionIndex={displayIndex}
      totalQuestions={gameData.questions.length}
      aiGenerated={gameData.aiGenerated}
      onNextQuestion={() => { nextQuestion(); }}
    />
  );
};

export default PlayGame;
