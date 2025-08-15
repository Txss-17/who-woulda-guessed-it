
import { useState } from 'react';
import { Player } from '@/types/quickGame';
import Confetti from '@/components/Confetti';
import QuestionCard from '@/components/QuestionCard';
import MessagingDialog from '@/components/messaging/MessagingDialog';
import GameHeader from '@/components/game/GameHeader';
import GamePhaseManager from '@/components/game/GamePhaseManager';

interface GameContainerProps {
  gameCode: string | undefined;
  players: Player[];
  currentPlayer: Player;
  currentQuestion: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  aiGenerated?: boolean;
  onNextQuestion: () => void;
}

const GameContainer = ({
  gameCode,
  players,
  currentPlayer,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  aiGenerated,
  onNextQuestion
}: GameContainerProps) => {
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-4 px-4">
      <Confetti active={false} />
      
      <div className="container mx-auto max-w-3xl">
        <GameHeader 
          playersCount={players.length}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          onOpenMessaging={() => setIsMessagingOpen(true)}
        />
        
        <div className="mb-8">
          <QuestionCard 
            question={currentQuestion} 
            isAIGenerated={aiGenerated}
          />
        </div>
        
        <GamePhaseManager
          players={players}
          currentQuestion={currentQuestion}
          currentPlayer={currentPlayer}
          currentQuestionIndex={currentQuestionIndex}
          gameCode={gameCode}
          onNextQuestion={onNextQuestion}
        />
      </div>
      
      <MessagingDialog
        open={isMessagingOpen}
        onOpenChange={setIsMessagingOpen}
        gameId={gameCode}
        currentUserId={currentPlayer.id}
        currentUserName={currentPlayer.name}
        players={players}
      />
    </div>
  );
};

export default GameContainer;
