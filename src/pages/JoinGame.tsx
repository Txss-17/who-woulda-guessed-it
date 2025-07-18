
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Users, UserCheck, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Blob, BackgroundDecoration } from '@/components/DecorativeElements';
import { useRealtimeGameSync } from '@/hooks/useRealtimeGameSync';

const JoinGame = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isJoined, setIsJoined] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [askName, setAskName] = useState(false);
  const [displayGameData, setDisplayGameData] = useState(null);

  const { gameData, addPlayerToGame, isLoading } = useRealtimeGameSync(gameCode || null);

  useEffect(() => {
    if (!gameCode) {
      toast({
        title: "Code manquant",
        description: "Code de partie non fourni",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    if (isLoading) return;

    if (gameData) {
      setDisplayGameData({
        gameCode: gameData.code,
        name: `Partie de ${gameData.host_name}`,
        playerCount: gameData.players.length,
        maxPlayers: gameData.max_players,
        status: 'waiting'
      });

      // Vérifier s'il existe un joueur en session
      const storedPlayer = sessionStorage.getItem('playerData');
      if (storedPlayer) {
        setCurrentPlayer(JSON.parse(storedPlayer));
        handleGameJoin(JSON.parse(storedPlayer));
      } else {
        setAskName(true); // Afficher le formulaire de saisie du nom
      }
    } else {
      toast({
        title: "Partie non trouvée",
        description: "La partie avec ce code n'existe pas",
        variant: "destructive"
      });
      navigate('/');
    }
    // eslint-disable-next-line
  }, [gameCode, gameData, isLoading, navigate, toast]);

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    const temporaryPlayer = {
      id: Date.now().toString(),
      name: playerNameInput,
      status: 'online',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(playerNameInput)}&background=10b981&color=fff`
    };
    sessionStorage.setItem('playerData', JSON.stringify(temporaryPlayer));
    setCurrentPlayer(temporaryPlayer);
    setAskName(false);
    await handleGameJoin(temporaryPlayer);
  };

  const handleGameJoin = async (player) => {
    try {
      if (!gameData) return;

      const success = await addPlayerToGame(player);

      if (!success) {
        throw new Error('Impossible de rejoindre la partie');
      }

      setIsJoined(true);

      toast({
        title: "Partie rejointe !",
        description: "Redirection vers la salle d'attente..."
      });

      setTimeout(() => {
        navigate(`/waiting-room/${gameCode}`);
      }, 1500);

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejoindre la partie",
        variant: "destructive"
      });
      navigate('/');
    }
  };

  if (!displayGameData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-6 px-4 flex items-center justify-center">
        <Card className="p-6">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Vérification de la partie...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (askName) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-6 px-4 flex items-center justify-center">
        <Card className="p-6">
          <form onSubmit={handleNameSubmit}>
            <label>Choisis ton nom :</label>
            <input
              type="text"
              value={playerNameInput}
              onChange={e => setPlayerNameInput(e.target.value)}
              placeholder="Ton nom de joueur"
              required
            />
            <button type="submit">Valider</button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    // ... ton rendu principal comme dans ta version
    // (reprends ton code pour l'affichage de la partie trouvée et du bouton de retour)
  );
}

export default JoinGame;
