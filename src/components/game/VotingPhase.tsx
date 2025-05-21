
import { Player } from '@/types/onlineGame';
import PlayerAvatar from '@/components/PlayerAvatar';
import { Button } from '@/components/ui/button';

interface VotingPhaseProps {
  players: Player[];
  selectedPlayer: Player | null;
  handleVote: (player: Player) => void;
  confirmVote: () => void;
}

const VotingPhase = ({ players, selectedPlayer, handleVote, confirmVote }: VotingPhaseProps) => {
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
          disabled={!selectedPlayer}
        >
          Confirmer mon vote
        </Button>
      </div>
    </div>
  );
};

export default VotingPhase;
