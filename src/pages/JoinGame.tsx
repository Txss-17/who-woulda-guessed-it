
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Users, UserCheck, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSecureGameJoin } from '@/hooks/useSecureGameJoin';
import { Blob, BackgroundDecoration } from '@/components/DecorativeElements';

const JoinGame = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { joinGameSecurely, isJoining } = useSecureGameJoin();
  
  const [isJoined, setIsJoined] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [gameData, setGameData] = useState<any>(null);
  
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

    // Attempt to join the game securely
    handleSecureJoin();
  }, [gameCode]);

  const handleSecureJoin = async () => {
    if (!gameCode) return;

    const result = await joinGameSecurely(gameCode);
    
    if (result.success && result.party) {
      setGameData(result.party);
      setIsJoined(true);
      
      // Simulate player joining
      const temporaryName = `Joueur ${Date.now().toString().slice(-4)}`;
      const newPlayer = {
        id: Date.now().toString(),
        name: temporaryName,
        status: 'online' as const,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(temporaryName)}&background=10b981&color=fff`
      };
      
      // Store player data securely
      sessionStorage.setItem('playerData', JSON.stringify(newPlayer));
      sessionStorage.setItem('gameData', JSON.stringify({
        gameCode,
        players: [newPlayer],
        questions: [],
        aiGenerated: false
      }));
      
      // Redirect to player name setup
      setTimeout(() => {
        navigate(`/player-name-setup/${gameCode}`);
      }, 1500);
    } else {
      // Error handling is done in the hook
      navigate('/');
    }
  };

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-6 px-4 flex items-center justify-center">
        <Card className="p-6">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Vérification sécurisée de la partie...</p>
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
              <span className="text-green-600">Connexion sécurisée</span>
            </div>

            {isJoining && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Clock className="h-5 w-5 animate-spin" />
                  <span>Vérification des autorisations...</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Validation sécurisée en cours...
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
                  Redirection vers la configuration du nom...
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JoinGame;
