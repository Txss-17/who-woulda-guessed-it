
import { Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GameType, typeLabels } from '@/types/onlineGame';
import PlayerAvatar from '@/components/PlayerAvatar';

interface MatchmakingOptionsProps {
  onStartMatchmaking: (type: GameType) => void;
}

const MatchmakingOptions = ({ onStartMatchmaking }: MatchmakingOptionsProps) => {
  const gameTypes: GameType[] = ['classic', 'love', 'friendly', 'crazy', 'party'];
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Trouve rapidement une partie</h2>
      
      <p className="text-muted-foreground mb-6">
        Le matchmaking te permet de trouver rapidement d'autres joueurs pour une partie.
        Choisis le type de questions que tu préfères:
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {gameTypes.map((type) => (
          <Button
            key={type}
            variant="outline"
            className="flex flex-col h-auto py-6 gap-2"
            onClick={() => onStartMatchmaking(type)}
          >
            <Star className="h-6 w-6 mb-1" />
            {typeLabels[type]}
          </Button>
        ))}
      </div>
      
      <div className="bg-secondary/30 p-4 rounded-lg">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Joueurs en ligne
        </h3>
        
        <div className="flex flex-wrap gap-2">
          <PlayerAvatar name="Alex" size="sm" />
          <PlayerAvatar name="Jordan" size="sm" />
          <PlayerAvatar name="Taylor" size="sm" />
          <PlayerAvatar name="Sam" size="sm" />
          <PlayerAvatar name="Robin" size="sm" />
          <PlayerAvatar name="Casey" size="sm" />
          <PlayerAvatar name="Riley" size="sm" />
        </div>
      </div>
    </Card>
  );
};

export default MatchmakingOptions;
