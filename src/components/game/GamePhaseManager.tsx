
import { Player } from '@/types/quickGame';
import { useGameVotes } from '@/hooks/useGameVotes';
import VotingPhase from '@/components/game/VotingPhase';
import ResultsPhase from '@/components/game/ResultsPhase';
import ChallengePhase from '@/components/game/ChallengePhase';
import { saveVote } from '@/integrations/supabase/saveVote';
import { useRealtimeVotes } from '@/hooks/useRealtimeVotes';

interface GamePhaseManagerProps {
  players: Player[];
  currentQuestion: string;
  currentPlayer: Player;
  currentQuestionIndex: number;
  gameCode?: string;
  gameId?: number;
  onNextQuestion: (questionResult?: any) => void;
}

const GamePhaseManager = ({ 
  players, 
  currentQuestion, 
  currentPlayer, 
  currentQuestionIndex,
  gameCode,
  gameId,
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

  const { votes: realtimeVotes, winningPlayerId: realtimeWinnerId } = useRealtimeVotes({
    gameCode,
    questionIndex: currentQuestionIndex,
    players,
  });

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

  const simulatedWinningPlayer = getWinningPlayer();
  const finalVotes = (realtimeVotes && Object.keys(realtimeVotes).length > 0) ? realtimeVotes : votes;
  const realtimeWinningPlayer = players.find(p => p.id === (realtimeWinnerId || '')) || null;
  const finalWinningPlayer = realtimeWinningPlayer || simulatedWinningPlayer;

  if (gamePhase === 'voting') {
    return (
      <VotingPhase 
        players={players}
        currentPlayer={currentPlayer}
        question={currentQuestion}
        gameId={gameId || 1}
        questionIndex={currentQuestionIndex}
        onVoteSubmitted={() => startChallengePhase()}
      />
    );
  }

  if (gamePhase === 'results') {
    return (
      <ResultsPhase 
        players={players}
        votes={finalVotes}
        currentQuestion={currentQuestion}
        winningPlayer={finalWinningPlayer}
        nextQuestion={handleResultsNext}
      />
    );
  }

  if (gamePhase === 'challenge' && finalWinningPlayer) {
    return (
      <ChallengePhase
        winner={finalWinningPlayer}
        players={players}
        currentPlayer={currentPlayer}
        onChallengeComplete={handleChallengeComplete}
      />
    );
  }

  return null;
};

export default GamePhaseManager;
