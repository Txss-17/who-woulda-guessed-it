
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChevronLeft, User, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Blob, BackgroundDecoration } from '@/components/DecorativeElements';

const PlayerNameSetup = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [playerName, setPlayerName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer votre nom",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    
    // Récupérer les données du joueur et de la partie
    const playerDataStr = sessionStorage.getItem('playerData');
    const gameDataStr = sessionStorage.getItem('gameData');
    
    if (!playerDataStr || !gameDataStr) {
      toast({
        title: "Erreur",
        description: "Données non trouvées",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    const playerData = JSON.parse(playerDataStr);
    const gameData = JSON.parse(gameDataStr);
    
    // Vérifier que le nom n'est pas déjà pris
    const nameExists = gameData.players.some(
      (p: any) => p.name.toLowerCase() === playerName.trim().toLowerCase() && p.id !== playerData.id
    );
    
    if (nameExists) {
      setIsUpdating(false);
      toast({
        title: "Nom déjà pris",
        description: "Ce nom est déjà utilisé par un autre joueur",
        variant: "destructive"
      });
      return;
    }

    setTimeout(() => {
      // Mettre à jour le nom du joueur
      const updatedPlayerData = {
        ...playerData,
        name: playerName.trim()
      };
      
      // Mettre à jour la liste des joueurs dans la partie
      const updatedPlayers = gameData.players.map((p: any) => 
        p.id === playerData.id ? { ...p, name: playerName.trim() } : p
      );
      
      const updatedGameData = {
        ...gameData,
        players: updatedPlayers
      };
      
      // Sauvegarder les données mises à jour
      sessionStorage.setItem('playerData', JSON.stringify(updatedPlayerData));
      sessionStorage.setItem('gameData', JSON.stringify(updatedGameData));
      
      setIsUpdating(false);
      
      toast({
        title: "Nom défini !",
        description: `Bienvenue ${playerName.trim()}`
      });
      
      // Rediriger vers la salle d'attente
      setTimeout(() => {
        navigate(`/waiting-room/${gameCode}`);
      }, 1000);
    }, 1000);
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
          
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Définir ton nom</h1>
              <p className="text-muted-foreground">
                Choisis le nom qui apparaîtra dans la partie
              </p>
              <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full mt-4">
                <span className="font-bold">Code:</span>
                <span className="text-xl text-primary font-bold tracking-wider">{gameCode}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <User className="h-12 w-12 text-primary/60" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Ton nom..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="text-center text-lg"
                  maxLength={20}
                  disabled={isUpdating}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Maximum 20 caractères
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full gap-2"
                disabled={isUpdating || !playerName.trim()}
              >
                {isUpdating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Confirmer le nom
                  </>
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlayerNameSetup;
