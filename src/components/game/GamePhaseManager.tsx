
import { Player } from '@/types/onlineGame';
import { useGameVotes } from '@/hooks/useGameVotes';
import VotingPhase from '@/components/game/VotingPhase';
import ResultsPhase from '@/components/game/ResultsPhase';
import ChallengePhase from '@/components/game/ChallengePhase';

interface GamePhaseManagerProps {
  players: Player[];
  currentQuestion: string;
  currentPlayer: Player;
  onNextQuestion: () => void;
}

const GamePhaseManager = ({ 
  players, 
  currentQuestion, 
  currentPlayer, 
  onNextQuestion 
}: GamePhaseManagerProps) => {
  const {
    selectedPlayer,
    gamePhase,
    votes,
    gameResults,
    handleVote,
    confirmVote,
    getWinningPlayer,
    startChallengePhase,
    completeChallengePhase,
    resetVotingState
  } = useGameVotes({ players });

  const handleConfirmVote = () => {
    confirmVote(currentQuestion);
  };

  const handleResultsNext = () => {
    startChallengePhase();
  };

  const handleChallengeComplete = () => {
    completeChallengePhase();
    resetVotingState();
    onNextQuestion();
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
