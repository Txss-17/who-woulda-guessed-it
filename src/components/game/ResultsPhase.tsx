
import { Player } from '@/types/onlineGame';
import PlayerAvatar from '@/components/PlayerAvatar';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ResultsPhaseProps {
  players: Player[];
  votes: Record<string, number>;
  currentQuestion: string;
  winningPlayer: Player | null;
  nextQuestion: () => void;
}

const ResultsPhase = ({ 
  players, 
  votes, 
  currentQuestion, 
  winningPlayer, 
  nextQuestion 
}: ResultsPhaseProps) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md animate-reveal">
      <h3 className="text-lg font-medium mb-6 text-center">Résultats</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {players.map(player => (
          <div 
            key={player.id}
            className={`
              flex flex-col items-center p-3 rounded-lg
              ${winningPlayer?.id === player.id ? 'bg-primary/20 border-2 border-primary animate-pulse-slow' : ''}
            `}
          >
            <PlayerAvatar
              name={player.name}
              image={player.avatar}
              size="md"
              highlighted={winningPlayer?.id === player.id}
              count={votes[player.id] || 0}
              status={player.status}
            />
            <span className="mt-2 font-medium text-sm">{player.name}</span>
          </div>
        ))}
      </div>
      
      {winningPlayer && (
        <div className="text-center mb-6">
          <p className="text-xl font-bold">
            {winningPlayer.name} est le plus susceptible de {currentQuestion.toLowerCase()}
          </p>
        </div>
      )}
      
      <div className="flex justify-center">
        <Button 
          onClick={nextQuestion}
          className="gap-2"
        >
          Question suivante
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ResultsPhase;
