
import { Player } from '@/types/onlineGame';
import { useGameVotes } from '@/hooks/useGameVotes';
import VotingPhase from '@/components/game/VotingPhase';
import ResultsPhase from '@/components/game/ResultsPhase';
import ChallengePhase from '@/components/game/ChallengePhase';
import { saveVote } from '@/integrations/supabase/saveVote';

interface GamePhaseManagerProps {
  players: Player[];
  currentQuestion: string;
  currentPlayer: Player;
  currentQuestionIndex: number;
  gameCode?: string;
  onNextQuestion: (questionResult?: any) => void;
}

const GamePhaseManager = ({ 
  players, 
  currentQuestion, 
  currentPlayer, 
  currentQuestionIndex,
  gameCode,
  onNextQuestion 
}: GamePhaseManagerProps) => {
  const {
    selectedPlayer,
    gamePhase,
    votes,
    handleVote,
    confirmVote,
    getWinningPlayer,
    startChallengePhase,
    completeChallengePhase,
    resetVotingState,
    getCurrentQuestionResult
  } = useGameVotes({ players });

  const handleConfirmVote = () => {
    confirmVote(currentQuestion);
    // Persist the current player's vote
    if (gameCode && selectedPlayer) {
      saveVote({
        gameCode,
        questionIndex: currentQuestionIndex,
        questionText: currentQuestion,
        voterPlayerId: currentPlayer.id,
        targetPlayerId: selectedPlayer.id,
        voterName: currentPlayer.name,
        targetName: selectedPlayer.name,
      }).catch(console.error);
    }
  };

  const handleResultsNext = () => {
    startChallengePhase();
  };

  const handleChallengeComplete = () => {
    const questionResult = getCurrentQuestionResult();
    completeChallengePhase();
    onNextQuestion(questionResult);
  };

  const winningPlayer = getWinningPlayer();

  if (gamePhase === 'voting') {
    return (
      <VotingPhase 
        players={players}
        selectedPlayer={selectedPlayer}
        handleVote={handleVote}
        confirmVote={handleConfirmVote}
      />
    );
  }

  if (gamePhase === 'results') {
    return (
      <ResultsPhase 
        players={players}
        votes={votes}
        currentQuestion={currentQuestion}
        winningPlayer={winningPlayer}
        nextQuestion={handleResultsNext}
      />
    );
  }

  if (gamePhase === 'challenge' && winningPlayer) {
    return (
      <ChallengePhase
        winner={winningPlayer}
        players={players}
        currentPlayer={currentPlayer}
        onChallengeComplete={handleChallengeComplete}
      />
    );
  }

  return null;
};

export default GamePhaseManager;
