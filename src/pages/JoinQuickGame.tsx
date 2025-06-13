
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Users, UserCheck, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Blob, BackgroundDecoration } from '@/components/DecorativeElements';

const JoinQuickGame = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [gameData, setGameData] = useState<any>(null);
  const [playerCount, setPlayerCount] = useState(0);
  
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

    // Vérifier si la partie existe dans le sessionStorage
    const storedGameData = sessionStorage.getItem('gameData');
    if (storedGameData) {
      try {
        const data = JSON.parse(storedGameData);
        if (data.gameCode === gameCode) {
          setGameData(data);
          setPlayerCount(data.players?.length || 0);
          
          // Rejoindre automatiquement la partie
          joinGameAutomatically(data);
        } else {
          handleInvalidGame();
        }
      } catch (error) {
        handleInvalidGame();
      }
    } else {
      handleInvalidGame();
    }
  }, [gameCode, navigate, toast]);

  const handleInvalidGame = () => {
    toast({
      title: "Partie introuvable",
      description: "Cette partie n'existe pas ou a expiré",
      variant: "destructive"
    });
    navigate('/');
  };

  const joinGameAutomatically = (gameData: any) => {
    setIsJoining(true);
    
    // Générer automatiquement un nom de joueur temporaire
    const playerNumber = (gameData.players?.length || 0) + 1;
    const temporaryName = `Joueur ${playerNumber}`;
    
    // Créer le nouveau joueur
    const newPlayer = {
      id: Date.now().toString(),
      name: temporaryName,
      status: 'online' as const,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(temporaryName)}&background=10b981&color=fff`
    };
    
    setTimeout(() => {
      try {
        const updatedGameData = {
          ...gameData,
          players: [...(gameData.players || []), newPlayer]
        };
        
        // Mettre à jour les données de la partie
        sessionStorage.setItem('gameData', JSON.stringify(updatedGameData));
        sessionStorage.setItem('playerData', JSON.stringify(newPlayer));
        
        setIsJoining(false);
        setIsJoined(true);
        setPlayerCount(updatedGameData.players.length);
        
        toast({
          title: "Partie rejointe !",
          description: "Tu peux maintenant définir ton nom"
        });
        
        // Rediriger vers la page de définition du nom
        setTimeout(() => {
          navigate(`/player-name-setup/${gameCode}`);
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
    }, 1000);
  };

  if (!gameData) {
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
              <h1 className="text-2xl font-bold mb-2">Rejoindre la partie rapide</h1>
              <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                <span className="font-bold">Code:</span>
                <span className="text-xl text-primary font-bold tracking-wider">{gameCode}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{playerCount} joueurs dans la partie</span>
            </div>

            {isJoining && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Clock className="h-5 w-5 animate-spin" />
                  <span>Connexion en cours...</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Rejoindre la partie...
                </p>
              </div>
            )}

            {isJoined && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <UserCheck className="h-5 w-5" />
                  <span className="font-medium">Connecté avec succès !</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Redirection vers la définition du nom...
                </p>
              </div>
            )}

            {!isJoining && !isJoined && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Clock className="h-5 w-5 animate-pulse" />
                  <span>Préparation de la connexion...</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JoinQuickGame;
