import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PlayerAvatar from '@/components/PlayerAvatar';
import { useToast } from '@/hooks/use-toast';
import { Clock, Users, MessageSquare, Play } from 'lucide-react';
import MessagingDialog from '@/components/messaging/MessagingDialog';
import { Player, UserStatus } from '@/types/quickGame';
import { useRealtimeQuickGameSync } from '@/hooks/useRealtimeQuickGameSync';
import { useGameSync } from '@/hooks/useGameSync';
import { updateGameData } from '@/integrations/supabase/updateGameData';

const WaitingRoom = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  const { gameData, isHost, addPlayerToGame } = useRealtimeQuickGameSync(gameCode || null);
  const players = gameData?.players || [];

  // 1. Créer le joueur si nécessaire
  useEffect(() => {
    let playerDataStr = sessionStorage.getItem('playerData');

    if (!playerDataStr) {
      const temporaryPlayer = {
        id: Date.now().toString(),
        name: `Joueur_${Date.now().toString().slice(-4)}`,
        status: 'onroom' as UserStatus,
        avatar: `https://ui-avatars.com/api/?name=Joueur&background=10b981&color=fff`
      };
      sessionStorage.setItem('playerData', JSON.stringify(temporaryPlayer));
      playerDataStr = JSON.stringify(temporaryPlayer);
    }

    const playerData = JSON.parse(playerDataStr);
    const currentPlayerWithStatus: Player = {
      ...playerData,
      status: 'onroom' as UserStatus,
    };
    setCurrentPlayer(currentPlayerWithStatus);
  }, []);

  // 2. Ajouter le joueur à la partie une fois prêt
  useEffect(() => {
    if (!currentPlayer || !gameData) return;

    const run = async () => {
      console.log('Vérification si le joueur est déjà dans la partie:', currentPlayer.name);
      const playerExists = gameData.players.some((p: Player) => 
        String(p.id) === String(currentPlayer.id) || p.name === currentPlayer.name
      );
      
      if (!playerExists) {
        console.log('Le joueur n\'est pas dans la partie, ajout en cours...');
        const created = await addPlayerToGame(currentPlayer);
        if (created) {
          console.log('Joueur ajouté avec succès:', created);
          sessionStorage.setItem('playerData', JSON.stringify(created));
          setCurrentPlayer(created);
        } else {
          console.error('Échec de l\'ajout du joueur');
        }
      } else {
        console.log('Le joueur est déjà dans la partie');
      }

      if (gameData?.status === 'playing') {
        navigate(`/play/${gameCode}`);
      }
    };

    run();
  }, [currentPlayer, gameData]);

  const startGame = async () => {
    if (players.length < 2) {
      toast({
        title: "Pas assez de joueurs",
        description: "Il faut au moins 2 joueurs pour commencer",
        variant: "destructive"
      });
      return;
    }

    await updateGameData(gameCode, { statut: 'playing' });
    navigate(`/play/${gameCode}`);
  };

  if (!gameData || !currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-8 px-4 flex items-center justify-center">
        <Card className="p-6">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Chargement de la salle d'attente...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-8 px-4">
      <div className="container mx-auto max-w-md">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Salle d'attente</h1>
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full mb-6">
            <span className="font-bold">Code:</span>
            <span className="text-xl text-primary font-bold tracking-wider">{gameData?.code}</span>
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
