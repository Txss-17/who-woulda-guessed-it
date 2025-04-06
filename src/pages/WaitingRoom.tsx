
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PlayerAvatar from '@/components/PlayerAvatar';
import { useToast } from '@/components/ui/toast';
import { Clock, Users } from 'lucide-react';

interface Player {
  id: number;
  name: string;
}

const WaitingRoom = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isWaiting, setIsWaiting] = useState(true);

  useEffect(() => {
    // Récupérer les données du joueur actuel
    const playerDataStr = sessionStorage.getItem('playerData');
    if (!playerDataStr) {
      toast({
        title: "Erreur",
        description: "Données du joueur non trouvées",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    const playerData = JSON.parse(playerDataStr);
    setCurrentPlayer(playerData);
    
    // Simuler l'ajout de joueurs à intervalles réguliers
    const fakePlayerNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie'];
    setPlayers([{ id: playerData.id, name: playerData.name }]);
    
    let addedPlayers = 1;
    const interval = setInterval(() => {
      if (addedPlayers < 5) {
        const newPlayer = {
          id: Date.now() + addedPlayers,
          name: fakePlayerNames[addedPlayers - 1]
        };
        setPlayers(prev => [...prev, newPlayer]);
        addedPlayers++;
      } else {
        clearInterval(interval);
        
        // Simuler le démarrage du jeu après quelques secondes
        setTimeout(() => {
          setIsWaiting(false);
          
          setTimeout(() => {
            // Stocker les données du jeu pour la page de jeu
            sessionStorage.setItem('gameData', JSON.stringify({
              gameCode,
              players: [...players, { id: Date.now() + 5, name: fakePlayerNames[4] }],
              questions: [
                "...dormir au boulot?",
                "...oublier l'anniversaire de son/sa partenaire?",
                "...devenir célèbre sur TikTok?",
                "...dépenser tout son argent en une journée?",
                "...adopter 10 chats?"
              ]
            }));
            
            navigate(`/play/${gameCode}`);
          }, 1500);
        }, 3000);
      }
    }, 1500);
    
    return () => clearInterval(interval);
  }, [gameCode, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-8 px-4">
      <div className="container mx-auto max-w-md">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Salle d'attente</h1>
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full mb-6">
            <span className="font-bold">Code:</span>
            <span className="text-xl text-primary font-bold tracking-wider">{gameCode}</span>
          </div>
          
          <div className="mb-8">
            {isWaiting ? (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5 animate-spin-slow" />
                <span>En attente du démarrage de la partie...</span>
              </div>
            ) : (
              <div className="text-primary font-medium animate-pulse">
                La partie va commencer...
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-center gap-1 mb-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">Joueurs ({players.length})</h2>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 justify-items-center">
              {players.map(player => (
                <div
                  key={player.id}
                  className={`flex flex-col items-center ${player.id === currentPlayer?.id ? 'text-primary font-medium' : ''}`}
                >
                  <PlayerAvatar
                    name={player.name}
                    size="md"
                    highlighted={player.id === currentPlayer?.id}
                  />
                  <span className="mt-2 text-sm truncate w-full text-center">
                    {player.name}
                    {player.id === currentPlayer?.id ? ' (toi)' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => {
              if (confirm("Quitter la salle d'attente ?")) {
                navigate('/');
              }
            }}
          >
            Quitter
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default WaitingRoom;
