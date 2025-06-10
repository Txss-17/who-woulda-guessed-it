
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GameType, typeLabels } from '@/types/onlineGame';
import { Search, X, Sparkles, Zap } from 'lucide-react';

interface MatchmakingCardProps {
  type: GameType;
  countdown: number;
  onCancel: () => void;
}

const MatchmakingCard = ({ type, countdown, onCancel }: MatchmakingCardProps) => {
  const progress = ((10 - countdown) / 10) * 100;
  
  return (
    <Card className="mx-auto max-w-md bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 shadow-xl animate-fade-in">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <div className="relative">
            <Search className="h-6 w-6 text-primary animate-spin-slow" />
            <Sparkles className="h-3 w-3 text-accent absolute -top-1 -right-1 animate-pulse" />
          </div>
          Recherche en cours...
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-medium">Type: {typeLabels[type]}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Progression</span>
              <span className="font-mono font-bold text-primary">{countdown}s</span>
            </div>
            <Progress 
              value={progress} 
              className="h-3 bg-secondary/50" 
            />
          </div>
        </div>
        
        <div className="bg-white/30 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-sm text-muted-foreground">
            Recherche d'autres joueurs...
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="w-full hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all"
        >
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
      </CardContent>
    </Card>
  );
};

export default MatchmakingCard;
