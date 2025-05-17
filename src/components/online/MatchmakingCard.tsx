
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GameType, typeLabels } from '@/types/onlineGame';

interface MatchmakingCardProps {
  type: GameType;
  countdown: number;
  onCancel: () => void;
}

const MatchmakingCard = ({ type, countdown, onCancel }: MatchmakingCardProps) => {
  return (
    <Card className="p-8 text-center">
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <Users className="h-10 w-10 text-primary animate-pulse" />
        </div>
        <h2 className="text-xl font-bold mb-2">Recherche de joueurs en cours...</h2>
        <p className="text-muted-foreground">
          Recherche d'une partie de type {typeLabels[type]}
        </p>
      </div>
      
      <div className="mx-auto w-20 h-20 relative mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
          {countdown}
        </div>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-primary"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="38"
            cx="40"
            cy="40"
            strokeDasharray={Math.PI * 2 * 38}
            strokeDashoffset={Math.PI * 2 * 38 * (1 - countdown / 10)}
          />
        </svg>
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Annuler
        </Button>
      </div>
    </Card>
  );
};

export default MatchmakingCard;
