
import { Button } from '@/components/ui/button';
import { Shield, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OnlineGame, typeLabels } from '@/types/onlineGame';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface GameItemProps {
  game: OnlineGame;
}

const GameItem = ({ game }: GameItemProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const joinGame = () => {
    if (game.status === 'playing') {
      toast({
        title: 'Partie en cours',
        description: 'Cette partie est déjà en cours',
        variant: 'destructive'
      });
      return;
    }
    
    if (game.players.count >= game.players.max) {
      toast({
        title: 'Partie complète',
        description: 'Cette partie est déjà complète',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Partie rejointe !',
      description: "Redirection vers la salle d'attente..."
    });
    
    // Simuler qu'on rejoint la partie
    sessionStorage.setItem('playerData', JSON.stringify({
      name: 'Joueur' + Math.floor(Math.random() * 1000),
      id: Date.now(),
      gameCode: game.id
    }));
    
    setTimeout(() => {
      navigate(`/waiting-room/${game.id}`);
    }, 1000);
  };
  
  return (
    <div 
      className={`
        bg-card border rounded-lg p-4 flex justify-between items-center
        ${game.status === 'playing' ? 'opacity-70' : ''}
      `}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium">{game.name}</h3>
          <Badge variant="outline" className="text-xs">
            {typeLabels[game.type]}
          </Badge>
          {game.status === 'playing' && (
            <Badge variant="secondary" className="text-xs">En cours</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Hôte: {game.host}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{game.players.count}/{game.players.max} joueurs</span>
          </div>
        </div>
      </div>
      
      <Button
        size="sm"
        disabled={game.status === 'playing' || game.players.count >= game.players.max}
        onClick={joinGame}
      >
        Rejoindre
      </Button>
    </div>
  );
};

export default GameItem;
