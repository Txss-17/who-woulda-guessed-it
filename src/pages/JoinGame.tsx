
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Users, UserCheck, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Blob, BackgroundDecoration } from '@/components/DecorativeElements';
import { useGameSync } from '@/hooks/useGameSync';

const JoinGame = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isJoining, setIsJoining] = useState(false);
  const [gameData, setGameData] = useState<any>(null);
  
  const { gameData: syncedGameData, joinGame } = useGameSync(gameCode || null);
  
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

    // Vérifier si une partie existe avec ce code
    if (syncedGameData) {
      setGameData({
        gameCode: syncedGameData.gameCode,
        name: `Partie ${syncedGameData.gameCode}`,
        playerCount: syncedGameData.players.length,
        maxPlayers: 8,
        status: 'waiting'
      });
      
      // Rejoindre automatiquement la partie
      handleGameJoin();
    } else {
      // Simuler la recherche de partie pour la démo
      setTimeout(() => {
        const fakeGameData = {
          gameCode: gameCode,
          name: `Partie ${gameCode}`,
          playerCount: 1,
          maxPlayers: 8,
          status: 'waiting'
        };
        setGameData(fakeGameData);
        handleGameJoin();
      }, 1500);
    }
  }, [gameCode, syncedGameData, navigate, toast]);

  const handleGameJoin = async () => {
    if (isJoining) return;
    
    setIsJoining(true);
    
    try {
      // Créer un joueur temporaire INVITÉ (pas connecté à un compte)
      const guestName = `Invité_${Date.now().toString().slice(-4)}`;
      const temporaryPlayer = {
        id: `guest_${Date.now().toString()}`, // ID unique pour l'invité
        name: guestName,
        status: 'online' as const,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(guestName)}&background=10b981&color=fff`,
        isGuest: true // Marquer comme invité
      };

      // Sauvegarder SEULEMENT les données du joueur invité local
      sessionStorage.setItem('currentPlayerData', JSON.stringify(temporaryPlayer));

      // Utiliser la fonction joinGame pour ajouter le joueur à la partie synchronisée
      if (joinGame) {
        joinGame(temporaryPlayer);
      }

      toast({
        title: "Partie rejointe !",
        description: `Bienvenue ${guestName} !`
      });

      // Rediriger DIRECTEMENT vers la salle d'attente (pas la page de configuration du nom)
      setTimeout(() => {
        navigate(`/waiting-room/${gameCode}`);
      }, 1500);

    } catch (error) {
      setIsJoining(false);
      toast({
        title: "Erreur",
        description: "Impossible de rejoindre la partie",
        variant: "destructive"
      });
      navigate('/');
    }
  };

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-6 px-4 flex items-center justify-center">
        <Card className="p-6">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Recherche de la partie...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-secondary/30 py-6 px-4 overflow-hidden">
      <Blob color="primary" position="top-left" size="md" className="opacity-40" />
      <Blob color="accent" position="bottom-right" size="md" className="opacity-40" />
      <BackgroundDecoration variant="minimal" position="bottom-left" className="opacity-30" />
      
      <div className="container mx-auto max-w-md relative z-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        
        <Card className="p-6 shadow-lg relative overflow-hidden">
          <BackgroundDecoration variant="minimal" position="bottom-right" className="opacity-10" />
          
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Rejoindre la partie</h1>
              <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                <span className="font-bold">Code:</span>
                <span className="text-xl text-primary font-bold tracking-wider">{gameCode}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Partie trouvée</span>
            </div>

            <div className="bg-secondary/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2">{gameData.name}</h3>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{gameData.playerCount}/{gameData.maxPlayers} joueurs</span>
                </div>
              </div>
            </div>

            {isJoining ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <UserCheck className="h-5 w-5" />
                  <span className="font-medium">Rejoindre en tant qu'invité...</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Redirection vers la salle d'attente...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Clock className="h-5 w-5 animate-spin" />
                  <span>Préparation de la partie...</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JoinGame;
