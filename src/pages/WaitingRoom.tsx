
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PlayerAvatar from '@/components/PlayerAvatar';
import { useToast } from '@/hooks/use-toast';
import { Clock, Users, MessageSquare, Play } from 'lucide-react';
import MessagingDialog from '@/components/messaging/MessagingDialog';
import { Player, UserStatus } from '@/types/onlineGame';

const WaitingRoom = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  
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
    const currentPlayerWithStatus: Player = {
      ...playerData,
      status: 'online' as UserStatus,
    };
    setCurrentPlayer(currentPlayerWithStatus);
    
    // Récupérer les données de la partie
    const gameDataStr = sessionStorage.getItem('gameData');
    if (gameDataStr) {
      const gameData = JSON.parse(gameDataStr);
      if (gameData.gameCode === gameCode) {
        // Vérifier si le joueur actuel fait partie de la partie
        const playerExists = gameData.players.some((p: Player) => p.id === currentPlayerWithStatus.id);
        
        if (playerExists) {
          setPlayers(gameData.players);
          // Vérifier si c'est l'hôte (premier joueur)
          setIsHost(gameData.players[0]?.id === currentPlayerWithStatus.id);
        } else {
          toast({
            title: "Erreur",
            description: "Tu ne fais pas partie de cette partie",
            variant: "destructive"
          });
          navigate('/');
        }
      } else {
        toast({
          title: "Code invalide",
          description: "Cette partie n'existe pas",
          variant: "destructive"
        });
        navigate('/');
      }
    } else {
      toast({
        title: "Erreur",
        description: "Données de partie non trouvées",
        variant: "destructive"
      });
      navigate('/');
    }
    
    // Simuler la mise à jour en temps réel des joueurs
    const interval = setInterval(() => {
      const gameDataStr = sessionStorage.getItem('gameData');
      if (gameDataStr) {
        const gameData = JSON.parse(gameDataStr);
        if (gameData.gameCode === gameCode) {
          setPlayers(gameData.players || []);
        }
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [gameCode, navigate, toast]);

  const startGame = () => {
    if (players.length < 2) {
      toast({
        title: "Pas assez de joueurs",
        description: "Il faut au moins 2 joueurs pour commencer",
        variant: "destructive"
      });
      return;
    }
    
    navigate(`/play/${gameCode}`);
  };

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
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span>En attente de joueurs...</span>
            </div>
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
                    status={player.status}
                  />
                  <span className="mt-2 text-sm truncate w-full text-center">
                    {player.name}
                    {player.id === currentPlayer?.id ? ' (toi)' : ''}
                    {players[0]?.id === player.id ? ' (hôte)' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            {isHost && (
              <Button
                onClick={startGame}
                disabled={players.length < 2}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Démarrer la partie
              </Button>
            )}
            
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
            
            <Button
              variant="secondary"
              onClick={() => setIsMessagingOpen(true)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>
          </div>
        </Card>
      </div>
      
      {currentPlayer && (
        <MessagingDialog
          open={isMessagingOpen}
          onOpenChange={setIsMessagingOpen}
          gameId={gameCode}
          currentUserId={currentPlayer.id}
          currentUserName={currentPlayer.name}
          players={players}
        />
      )}
    </div>
  );
};

export default WaitingRoom;
