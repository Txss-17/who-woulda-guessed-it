
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Share2, Copy, QrCode, ChevronLeft, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import ShareGameDialog from '@/components/quick-game/ShareGameDialog';
import { Blob, BackgroundDecoration } from '@/components/DecorativeElements';

const CreateGame = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [hostName, setHostName] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [gameCreated, setGameCreated] = useState(false);

  const gameUrl = `${window.location.origin}/join/${gameCode}`;

  useEffect(() => {
    // Vérifier si une partie existe déjà avec ce code
    const existingGameData = sessionStorage.getItem('gameData');
    if (existingGameData) {
      const gameData = JSON.parse(existingGameData);
      if (gameData.gameCode === gameCode) {
        setGameCreated(true);
        // Récupérer le nom de l'hôte
        const hostPlayer = gameData.players[0];
        if (hostPlayer) {
          setHostName(hostPlayer.name);
        }
      }
    }
  }, [gameCode]);

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hostName.trim()) {
      toast({
        title: "Nom requis",
        description: "Entre ton nom pour créer la partie",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      // Créer les données de l'hôte
      const hostPlayer = {
        id: Date.now().toString(),
        name: hostName.trim(),
        status: 'online' as const,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(hostName.trim())}&background=6366f1&color=fff`
      };

      // Créer les données de la partie avec l'hôte déjà inclus
      const gameData = {
        gameCode,
        players: [hostPlayer],
        questions: [
          "Qui est le plus susceptible de dormir au boulot?",
          "Qui est le plus susceptible d'oublier l'anniversaire de son/sa partenaire?",
          "Qui est le plus susceptible de devenir célèbre sur TikTok?",
          "Qui est le plus susceptible de dépenser tout son argent en une journée?",
          "Qui est le plus susceptible d'adopter 10 chats?"
        ],
        aiGenerated: false
      };

      // Sauvegarder les données de la partie
      sessionStorage.setItem('gameData', JSON.stringify(gameData));
      
      // Sauvegarder les données du joueur (hôte)
      sessionStorage.setItem('playerData', JSON.stringify(hostPlayer));

      setGameCreated(true);
      
      toast({
        title: "Partie créée !",
        description: "Partage le code avec tes amis pour qu'ils rejoignent"
      });

      // Rediriger vers la salle d'attente après un court délai
      setTimeout(() => {
        navigate(`/waiting-room/${gameCode}`);
      }, 2000);

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la partie. Réessaie.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyGameCode = () => {
    navigator.clipboard.writeText(gameCode || '');
    toast({
      title: "Code copié !",
      description: "Le code de la partie a été copié dans le presse-papiers"
    });
  };

  const copyGameLink = () => {
    navigator.clipboard.writeText(gameUrl);
    toast({
      title: "Lien copié !",
      description: "Le lien de la partie a été copié dans le presse-papiers"
    });
  };

  if (gameCreated) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-background to-secondary/30 py-6 px-4 overflow-hidden">
        <Blob color="primary" position="top-left" size="md" className="opacity-40" />
        <Blob color="accent" position="bottom-right" size="md" className="opacity-40" />
        
        <div className="container mx-auto max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Partie créée !</h1>
            <p className="text-muted-foreground">
              Partage le code ou le lien avec tes amis
            </p>
          </div>

          <Card className="p-6 shadow-lg relative overflow-hidden mb-6">
            <BackgroundDecoration variant="minimal" position="bottom-right" className="opacity-10" />
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full mb-4">
                <span className="font-bold">Code:</span>
                <span className="text-2xl text-primary font-bold tracking-wider">{gameCode}</span>
              </div>
              
              <div className="flex gap-2 justify-center mb-4">
                <Button onClick={copyGameCode} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" /> Copier le code
                </Button>
                <Button onClick={copyGameLink} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" /> Copier le lien
                </Button>
              </div>

              <div className="flex gap-2 justify-center">
                <Button onClick={() => setShowQR(!showQR)} variant="ghost" size="sm">
                  <QrCode className="h-4 w-4 mr-1" /> 
                  {showQR ? 'Masquer QR' : 'Afficher QR'}
                </Button>
                <Button onClick={() => setIsShareOpen(true)} variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-1" /> Partager
                </Button>
              </div>
            </div>

            {showQR && (
              <div className="flex justify-center mb-4">
                <QRCodeDisplay value={gameUrl} />
              </div>
            )}
          </Card>

          <div className="flex gap-2 justify-center">
            <Button 
              onClick={() => navigate(`/waiting-room/${gameCode}`)}
              className="gap-2"
            >
              Aller en salle d'attente
            </Button>
          </div>
        </div>

        <ShareGameDialog
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          gameCode={gameCode || ''}
          gameUrl={gameUrl}
        />
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
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Créer une partie</h1>
            <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
              <span className="font-bold">Code:</span>
              <span className="text-xl text-primary font-bold tracking-wider">{gameCode}</span>
            </div>
          </div>
          
          <form onSubmit={handleCreateGame}>
            <div className="space-y-4">
              <div>
                <label htmlFor="hostName" className="block text-sm font-medium mb-1">
                  Ton nom (hôte)
                </label>
                <Input
                  id="hostName"
                  placeholder="Entre ton nom"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  disabled={isCreating}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isCreating || !hostName.trim()}
              >
                {isCreating ? 'Création...' : 'Créer la partie'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateGame;
