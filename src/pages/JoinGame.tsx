
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Users, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Blob, BackgroundDecoration } from '@/components/DecorativeElements';

const JoinGame = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  
  useEffect(() => {
    // Vérifier si la partie existe
    const gameDataStr = sessionStorage.getItem('gameData');
    if (gameDataStr) {
      const gameData = JSON.parse(gameDataStr);
      if (gameData.gameCode === gameCode) {
        setPlayerCount(gameData.players.length);
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

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      toast({
        title: "Nom requis",
        description: "Entre ton nom pour rejoindre la partie",
        variant: "destructive"
      });
      return;
    }
    
    setIsJoining(true);
    
    // Créer le nouveau joueur
    const newPlayer = {
      id: Date.now().toString(),
      name: playerName.trim(),
      status: 'online' as const,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(playerName.trim())}&background=10b981&color=fff`
    };
    
    // Récupérer et mettre à jour les données de la partie
    const gameDataStr = sessionStorage.getItem('gameData');
    if (gameDataStr) {
      const gameData = JSON.parse(gameDataStr);
      
      // Vérifier si un joueur avec ce nom existe déjà
      const playerExists = gameData.players.some((p: any) => 
        p.name.toLowerCase() === playerName.trim().toLowerCase()
      );
      
      if (playerExists) {
        toast({
          title: "Nom déjà pris",
          description: "Un joueur avec ce nom est déjà dans la partie",
          variant: "destructive"
        });
        setIsJoining(false);
        return;
      }
      
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
        description: "Tu as rejoint la partie avec succès"
      });
      
      // Rediriger vers la salle d'attente
      setTimeout(() => {
        navigate(`/waiting-room/${gameCode}`);
      }, 1500);
    }
  };

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
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Rejoindre la partie</h1>
            <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
              <span className="font-bold">Code:</span>
              <span className="text-xl text-primary font-bold tracking-wider">{gameCode}</span>
            </div>
            
            <div className="flex items-center justify-center gap-1 mt-3 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{playerCount} joueurs dans la partie</span>
            </div>
          </div>
          
          <form onSubmit={handleJoinGame}>
            <div className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium mb-1">
                  Ton nom
                </label>
                <Input
                  id="playerName"
                  placeholder="Entre ton nom"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  disabled={isJoining || isJoined}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isJoining || isJoined}
              >
                {isJoining ? (
                  <>Connexion...</>
                ) : isJoined ? (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Connecté !
                  </>
                ) : (
                  'Rejoindre la partie'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default JoinGame;
