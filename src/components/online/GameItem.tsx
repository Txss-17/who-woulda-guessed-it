
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { OnlineGame, typeLabels } from '@/types/onlineGame';
import { Users, Clock, Share2, Sparkles } from 'lucide-react';
import ShareOnlineGameDialog from './ShareOnlineGameDialog';

interface GameItemProps {
  game: OnlineGame;
  onJoin: (gameId: string) => void;
}

const GameItem = ({ game, onJoin }: GameItemProps) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const isFull = game.players.count >= game.players.max;
  
  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card to-card/80 border-primary/10 hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg leading-tight">{game.name}</h3>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30"
                >
                  {typeLabels[game.type]}
                </Badge>
                {game.status === 'waiting' && (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <Clock className="h-3 w-3 mr-1" />
                    En attente
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShareDialogOpen(true)}
              className="hover:bg-primary/10 hover:scale-110 transition-all"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="font-medium">
                  {game.players.count}/{game.players.max}
                </span>
              </div>
              <div className="text-xs">
                Hôte: <span className="font-medium text-foreground">{game.host}</span>
              </div>
            </div>
            
            <Button
              onClick={() => onJoin(game.id)}
              disabled={isFull}
              size="sm"
              className={`
                transition-all duration-300 
                ${isFull 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-lg hover:scale-105 bg-gradient-to-r from-primary to-accent'
                }
              `}
            >
              {isFull ? 'Complet' : 'Rejoindre'}
              {!isFull && <Sparkles className="h-3 w-3 ml-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ShareOnlineGameDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        game={game}
      />
    </>
  );
};

export default GameItem;
