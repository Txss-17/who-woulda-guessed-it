
import { useState } from 'react';
import { Player } from '@/types/quickGame';
import PlayerAvatar from '@/components/PlayerAvatar';
import { Button } from '@/components/ui/button';
import { useRealTimeVoting } from '@/hooks/useRealTimeVoting';
import { useToast } from '@/hooks/use-toast';

interface VotingPhaseProps {
  players: Player[];
  currentPlayer: Player;
  question: string;
  gameId: number;
  questionIndex: number;
  onVoteSubmitted: () => void;
}

const VotingPhase = ({ 
  players, 
  currentPlayer, 
  question, 
  gameId, 
  questionIndex, 
  onVoteSubmitted 
}: VotingPhaseProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { toast } = useToast();
  
  const { hasVoted, submitVote, isLoading } = useRealTimeVoting(gameId, questionIndex, players);

  const handleVote = (player: Player) => {
    if (!hasVoted) {
      setSelectedPlayer(player);
    }
  };

  const confirmVote = async () => {
    if (!selectedPlayer || hasVoted) return;

    const success = await submitVote(selectedPlayer.id, question);
    if (success) {
      onVoteSubmitted();
      toast({
        title: "Vote enregistré",
        description: "Votre vote a été pris en compte !",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4 text-center">Vote pour un joueur</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {players.map(player => (
          <div 
            key={player.id}
            className={`
              flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all
              ${selectedPlayer?.id === player.id 
                ? 'bg-primary/20 border-2 border-primary' 
                : 'hover:bg-secondary'}
            `}
            onClick={() => handleVote(player)}
          >
            <PlayerAvatar
              name={player.name}
              image={player.avatar}
              size="md"
              highlighted={selectedPlayer?.id === player.id}
              status={player.status}
            />
            <span className="mt-2 font-medium text-sm">{player.name}</span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={confirmVote}
          disabled={!selectedPlayer || hasVoted || isLoading}
        >
          {hasVoted ? "Vote enregistré" : isLoading ? "Chargement..." : "Confirmer mon vote"}
        </Button>
      </div>
    </div>
  );
};

export default VotingPhase;
