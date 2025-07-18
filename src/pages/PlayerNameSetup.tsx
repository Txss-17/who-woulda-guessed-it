
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChevronLeft, User, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Blob, BackgroundDecoration } from '@/components/DecorativeElements';
import { useGameSync } from '@/hooks/useGameSync';

const PlayerNameSetup = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [playerName, setPlayerName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPlayerName, setCurrentPlayerName] = useState('');

  const { gameData, addPlayerToGame } = useGameSync(gameCode || null);

  useEffect(() => {
    // Vérifier que le joueur a bien rejoint une partie
    const playerDataStr = sessionStorage.getItem('playerData');
    
    if (!playerDataStr || !gameData || !gameCode) {
      toast({
        title: "Erreur",
        description: "Données de partie non trouvées",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    try {
      const playerData = JSON.parse(playerDataStr);
      
      // Vérifier que la partie correspond
      if (gameData.gameCode !== gameCode) {
        toast({
          title: "Erreur",
          description: "Code de partie incorrect",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      // Vérifier que le joueur fait partie de la partie
      const playerExists = gameData.players?.some((p: any) => p.id === playerData.id);
      if (!playerExists) {
        toast({
          title: "Erreur",
          description: "Joueur non trouvé dans la partie",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setCurrentPlayerName(playerData.name || '');
      setPlayerName(playerData.name || '');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [gameCode, gameData, navigate, toast]);

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

    if (playerName.trim().length < 2) {
      toast({
        title: "Nom trop court",
        description: "Le nom doit contenir au moins 2 caractères",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    
    try {
      // Récupérer les données du joueur
      const playerDataStr = sessionStorage.getItem('playerData');
      
      if (!playerDataStr || !gameData) {
        throw new Error('Données manquantes');
      }

      const playerData = JSON.parse(playerDataStr);
      
      // Vérifier que le nom n'est pas déjà pris
      const nameExists = gameData.players?.some(
        (p: any) => p.name.toLowerCase().trim() === playerName.trim().toLowerCase() && p.id !== playerData.id
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

      // Simulation d'une mise à jour
      setTimeout(() => {
        try {
          // Mettre à jour le nom du joueur
          const updatedPlayerData = {
            ...playerData,
            name: playerName.trim()
          };
          
          // Sauvegarder les données mises à jour du joueur
          sessionStorage.setItem('playerData', JSON.stringify(updatedPlayerData));
          
          // Ajouter/mettre à jour le joueur dans la partie synchronisée
          addPlayerToGame(updatedPlayerData);
          
          setIsUpdating(false);
          
          toast({
            title: "Nom défini !",
            description: `Bienvenue ${playerName.trim()}`
          });
          
          // Rediriger vers la salle d'attente
          setTimeout(() => {
            navigate(`/waiting-room/${gameCode}`);
          }, 2000);
        } catch (error) {
          setIsUpdating(false);
          toast({
            title: "Erreur",
            description: "Impossible de sauvegarder le nom",
            variant: "destructive"
          });
        }
      }, 2000);
    } catch (error) {
      setIsUpdating(false);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
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
                  Entre 2 et 20 caractères
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full gap-2"
                disabled={isUpdating || !playerName.trim() || playerName.trim().length < 2}
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
