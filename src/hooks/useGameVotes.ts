
import { useState } from 'react';
import { Player } from '@/types/onlineGame';

interface UseGameVotesProps {
  players: Player[];
}

export const useGameVotes = ({ players }: UseGameVotesProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [votingPhase, setVotingPhase] = useState(true);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameResults, setGameResults] = useState<any[]>([]);

  const handleVote = (player: Player) => {
    if (!votingPhase) return;
    setSelectedPlayer(player);
  };

  const confirmVote = (currentQuestion: string) => {
    if (!selectedPlayer || !votingPhase) return;
    
    setVotingPhase(false);
    
    const newVotes: Record<string, number> = {};
    
    players.forEach(player => {
      newVotes[player.id] = Math.floor(Math.random() * 4);
    });
    
    newVotes[selectedPlayer.id] = (newVotes[selectedPlayer.id] || 0) + 1;
    
    setVotes(newVotes);
    
    // Save the results of this question
    const questionResult = {
      questionText: currentQuestion,
      votes: Object.entries(newVotes).map(([playerId, count]) => {
        const player = players.find(p => p.id === playerId);
        return {
          playerId,
          playerName: player?.name || "Unknown",
          count
        };
      }),
      winner: {
        playerId: selectedPlayer.id,
        playerName: selectedPlayer.name
      }
    };
    
    setGameResults(prev => [...prev, questionResult]);
    
    setTimeout(() => {
      setShowConfetti(true);
    }, 2000);
  };

  const getWinningPlayer = (): Player | null => {
    if (Object.keys(votes).length === 0) return null;
    
    const playerIdWithMaxVotes = Object.entries(votes)
      .reduce((max, [playerId, voteCount]) => {
        return voteCount > votes[max] ? playerId : max;
      }, Object.keys(votes)[0]);
    
    return players.find(p => p.id === playerIdWithMaxVotes) || null;
  };

  const resetVotingState = () => {
    setVotingPhase(true);
    setSelectedPlayer(null);
    setVotes({});
    setShowConfetti(false);
  };

  return {
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
  };
};
