
import { usePlayGame } from '@/hooks/usePlayGame';
import GameContainer from '@/components/game/GameContainer';
import GameResult from '@/components/game/GameResult';

const PlayGame = () => {
  const {
    gameData,
    currentQuestionIndex,
    gameOver,
    currentPlayer,
    gameCode,
    nextQuestion
  } = usePlayGame();

  if (!gameData || !currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du jeu...</p>
      </div>
    );
  }
  
  if (gameOver) {
    return <GameResult gameCode={gameCode} gameData={gameData} gameResults={[]} />;
  }
  
  const currentQuestion = gameData.questions[currentQuestionIndex];

  return (
    <GameContainer
      gameCode={gameCode}
      players={gameData.players}
      currentPlayer={currentPlayer}
      currentQuestion={currentQuestion}
      currentQuestionIndex={currentQuestionIndex}
      totalQuestions={gameData.questions.length}
      aiGenerated={gameData.aiGenerated}
      onNextQuestion={() => nextQuestion()}
    />
  );
};

export default PlayGame;
