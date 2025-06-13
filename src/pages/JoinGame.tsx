
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Users, UserCheck, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Blob, BackgroundDecoration } from '@/components/DecorativeElements';

const JoinGame = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [gameExists, setGameExists] = useState(false);
  
  useEffect(() => {
    // Vérifier si la partie existe
    const gameDataStr = sessionStorage.getItem('gameData');
    if (gameDataStr) {
      const gameData = JSON.parse(gameDataStr);
      if (gameData.gameCode === gameCode) {
        setGameExists(true);
        setPlayerCount(gameData.players.length);
        
        // Rejoindre automatiquement la partie
        joinGameAutomatically(gameData);
      } else {
        toast({
          title: "Code de partie invalide",
          description: "Cette partie n'existe pas",
          variant: "destructive"
        });
        navigate('/');
      }
    } else {
      toast({
        title: "Code de partie invalide",
        description: "Cette partie n'existe pas",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [gameCode, navigate, toast]);

  const joinGameAutomatically = (gameData: any) => {
    setIsJoining(true);
    
    // Générer automatiquement un nom de joueur
    const playerNumber = gameData.players.length + 1;
    const generatedName = `Joueur ${playerNumber}`;
    
    // Créer le nouveau joueur
    const newPlayer = {
      id: Date.now().toString(),
      name: generatedName,
      status: 'online' as const,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(generatedName)}&background=10b981&color=fff`
    };
    
    setTimeout(() => {
      // Ajouter le nouveau joueur
      const updatedGameData = {
        ...gameData,
        players: [...gameData.players, newPlayer]
      };
      
      sessionStorage.setItem('gameData', JSON.stringify(updatedGameData));
      sessionStorage.setItem('playerData', JSON.stringify(newPlayer));
      
      setIsJoining(false);
      setIsJoined(true);
      
      toast({
        title: "Partie rejointe !",
        description: `Tu as rejoint la partie en tant que ${generatedName}`
      });
      
      // Rediriger vers la salle d'attente
      setTimeout(() => {
        navigate(`/waiting-room/${gameCode}`);
      }, 1500);
    }, 1000);
  };

  if (!gameExists) {
    return null;
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
                  Attribution automatique d'un nom de joueur...
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
                  Redirection vers la salle d'attente...
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

export default JoinGame;
