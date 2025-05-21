
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OnlineGame, typeLabels, Player } from '@/types/onlineGame';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface GameListProps {
  onSwitchToMatchmaking: () => void;
}

const GameList = ({ onSwitchToMatchmaking }: GameListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [publicGames, setPublicGames] = useState<OnlineGame[]>([]);
  
  // Simuler le chargement des parties publiques
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const fakeGames: OnlineGame[] = [
        {
          id: 'game1',
          name: 'Soirée Fun',
          players: { 
            count: 3, 
            max: 6, 
            list: [
              { id: 'p1', name: 'Alex', status: 'online' },
              { id: 'p2', name: 'Robin', status: 'online' },
              { id: 'p3', name: 'Charlie', status: 'online' }
            ]
          },
          host: 'Alex',
          type: 'classic',
          status: 'waiting'
        },
        {
          id: 'game2',
          name: 'Questions Love',
          players: { 
            count: 2, 
            max: 4,
            list: [
              { id: 'p4', name: 'Jordan', status: 'online' },
              { id: 'p5', name: 'Sam', status: 'online' }
            ]
          },
          host: 'Jordan',
          type: 'love',
          status: 'waiting'
        },
        {
          id: 'game3',
          name: 'Entre amis',
          players: { 
            count: 4, 
            max: 5,
            list: [
              { id: 'p6', name: 'Taylor', status: 'online' },
              { id: 'p7', name: 'Morgan', status: 'online' },
              { id: 'p8', name: 'Casey', status: 'online' },
              { id: 'p9', name: 'Riley', status: 'online' }
            ] 
          },
          host: 'Taylor',
          type: 'friendly',
          status: 'waiting'
        },
        {
          id: 'game4',
          name: 'Party Night',
          players: { 
            count: 5, 
            max: 8,
            list: [
              { id: 'p10', name: 'Sam', status: 'online' },
              { id: 'p11', name: 'Alex', status: 'online' },
              { id: 'p12', name: 'Jamie', status: 'online' },
              { id: 'p13', name: 'Blake', status: 'online' },
              { id: 'p14', name: 'Quinn', status: 'online' }
            ]
          },
          host: 'Sam',
          type: 'party',
          status: 'playing'
        }
      ];
      
      setPublicGames(fakeGames);
      setIsLoading(false);
    }, 1500);
  }, []);

  const joinGame = (game: OnlineGame) => {
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
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Parties disponibles</h2>
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Chargement des parties...</p>
        </div>
      ) : publicGames.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Aucune partie publique disponible.</p>
          <Button
            variant="outline"
            onClick={onSwitchToMatchmaking}
            className="mt-4"
          >
            Essayer le matchmaking
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {publicGames.map(game => (
            <div 
              key={game.id}
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
                onClick={() => joinGame(game)}
              >
                Rejoindre
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default GameList;
