import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
        name: `Partie ${gameData.code}`,
        playerCount: gameData.players.length,
        maxPlayers: gameData.max_players,
        status: gameData.status
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

      const created = await addPlayerToGame(player);

      if (!created) {
        throw new Error('Impossible de rejoindre la partie');
      }

      // Mettre à jour la session et l'état avec l'ID DB du joueur
      sessionStorage.setItem('playerData', JSON.stringify(created));
      setCurrentPlayer(created);

      setIsJoined(true);

      toast({
        title: "Partie rejointe !",
        description: "Redirection vers la salle d'attente..."
      });

      navigate(`/waiting-room/${gameCode}`);

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
      <div className="relative min-h-screen bg-gradient-to-b from-background to-secondary/30 py-6 px-4 overflow-hidden">
        <Blob color="primary" position="top-left" size="md" className="opacity-40" />
        <Blob color="accent" position="bottom-right" size="md" className="opacity-40" />
        
        <div className="container mx-auto max-w-md relative z-10 flex flex-col justify-center min-h-screen">
          <Card className="p-6 shadow-lg relative overflow-hidden">
            <BackgroundDecoration variant="minimal" position="bottom-right" className="opacity-10" />
            
            <div className="text-center">
              <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Vérification de la partie...</h2>
              <p className="text-muted-foreground">Code: {gameCode}</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (askName) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-background to-secondary/30 py-6 px-4 overflow-hidden">
        <Blob color="primary" position="top-left" size="md" className="opacity-40" />
        <Blob color="accent" position="bottom-right" size="md" className="opacity-40" />
        
        <div className="container mx-auto max-w-md relative z-10 flex flex-col justify-center min-h-screen">
          <Card className="p-6 shadow-lg relative overflow-hidden">
            <BackgroundDecoration variant="minimal" position="bottom-right" className="opacity-10" />
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Rejoindre la partie</h1>
              <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full mb-4">
                <span className="font-bold">Code:</span>
                <span className="text-xl text-primary font-bold tracking-wider">{gameCode}</span>
              </div>
              <p className="text-muted-foreground">
                Choisis ton nom pour rejoindre la partie
              </p>
              
              {displayGameData && (
                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{displayGameData.playerCount}/{displayGameData.maxPlayers} joueurs</span>
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium mb-2">
                  Ton nom de joueur
                </label>
                <Input
                  id="playerName"
                  type="text"
                  value={playerNameInput}
                  onChange={e => setPlayerNameInput(e.target.value)}
                  placeholder="Entre ton nom"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={!playerNameInput.trim()}>
                Rejoindre la partie
              </Button>
            </form>
            
            <div className="mt-6 pt-4 border-t border-border">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="w-full gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Retour à l'accueil
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-secondary/30 py-6 px-4 overflow-hidden">
      <Blob color="primary" position="top-left" size="md" className="opacity-40" />
      <Blob color="accent" position="bottom-right" size="md" className="opacity-40" />
      
      <div className="container mx-auto max-w-md relative z-10 flex flex-col justify-center min-h-screen">
        <Card className="p-6 shadow-lg relative overflow-hidden">
          <BackgroundDecoration variant="minimal" position="bottom-right" className="opacity-10" />
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Partie rejointe !</h1>
            <p className="text-muted-foreground mb-6">
              Redirection vers la salle d'attente...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 animate-spin" />
              <span>Chargement...</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JoinGame;