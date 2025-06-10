
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameType, typeLabels } from '@/types/onlineGame';
import { Zap, Heart, Users, PartyPopper, Smile, Sparkles } from 'lucide-react';

interface MatchmakingOptionsProps {
  onStartMatchmaking: (type: GameType) => void;
}

const gameTypeIcons: Record<GameType, any> = {
  classic: Zap,
  love: Heart,
  friendly: Users,
  party: PartyPopper,
  crazy: Smile,
};

const gameTypeDescriptions: Record<GameType, string> = {
  classic: "Questions variées pour tous",
  love: "Questions romantiques et intimes", 
  friendly: "Questions entre amis",
  party: "Questions festives et amusantes",
  crazy: "Questions folles et décalées",
};

const MatchmakingOptions = ({ onStartMatchmaking }: MatchmakingOptionsProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            Matchmaking rapide
          </CardTitle>
          <p className="text-muted-foreground">
            Trouve automatiquement une partie selon tes préférences
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.entries(gameTypeIcons) as [GameType, any][]).map(([type, Icon]) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => onStartMatchmaking(type)}
                className="h-auto p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-card/80 hover:from-primary/10 hover:to-accent/10 border-primary/20 hover:border-primary/40"
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="relative">
                    <Icon className="h-6 w-6 text-primary" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-ping" />
                  </div>
                  <div>
                    <div className="font-medium">{typeLabels[type]}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {gameTypeDescriptions[type]}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchmakingOptions;
