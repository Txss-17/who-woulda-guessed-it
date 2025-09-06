import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Share2, Copy, QrCode, ChevronLeft, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import ShareGameDialog from '@/components/quick-game/ShareGameDialog';
import { Blob, BackgroundDecoration } from '@/components/DecorativeElements';
import { useRealtimeGameSync } from '@/hooks/useRealtimeGameSync';

const CreateGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [hostName, setHostName] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [code] = useState<string>(() => {
    const fromQuery = new URLSearchParams(location.search).get('code');
    return (fromQuery || Math.random().toString(36).substring(2, 8).toUpperCase());
  });

  const { gameData, createGame } = useRealtimeGameSync(code);
  const gameCreated = !!gameData;

  const gameUrl = `${window.location.origin}/join/${code}`;

  useEffect(() => {
    if (gameData) {
      const hostPlayer = gameData.players[0];
      if (hostPlayer) {
        setHostName(hostPlayer.name);
      }
    }
  }, [gameData]);

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
      const pending = sessionStorage.getItem('pendingQuestions');
      const questions = pending ? JSON.parse(pending) : [
        "Qui est le plus susceptible de dormir au boulot?",
        "Qui est le plus susceptible d'oublier l'anniversaire de son/sa partenaire?",
        "Qui est le plus susceptible de devenir célèbre sur TikTok?",
        "Qui est le plus susceptible de dépenser tout son argent en une journée?",
        "Qui est le plus susceptible d'adopter 10 chats?"
      ];

      // Générer l'ID du joueur hôte avant la création
      const hostPlayerId = crypto.randomUUID();
      
      // Créer la partie avec Supabase (inclut maintenant l'ajout de l'hôte)
      const game = await createGame(code, hostName.trim(), questions, hostPlayerId);
      
      if (!game) {
        throw new Error('Impossible de créer la partie');
      }

      console.log('Partie créée avec hôte ajouté:', hostName.trim());

      // Créer les données du joueur hôte pour la session avec l'ID synchronisé
      const hostPlayer = {
        id: hostPlayerId, // Même ID que dans la base de données
        name: hostName.trim(),
        status: 'online' as const,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(hostName.trim())}&background=6366f1&color=fff`
      };

      // Stocker les données du joueur hôte
      sessionStorage.setItem('playerData', JSON.stringify(hostPlayer));
      sessionStorage.removeItem('pendingQuestions');
      
      toast({
        title: "Partie créée !",
        description: "Partage le code avec tes amis pour qu'ils rejoignent"
      });

      // Rediriger vers la salle d'attente
      navigate(`/waiting-room/${code}`);

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
    navigator.clipboard.writeText(code || '');
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
              Partage le QR code ou le lien avec tes amis
            </p>
          </div>

          {showQR ? (
            <div className="mb-6">
              <QRCodeDisplay gameCode={code || ''} />
              <div className="flex justify-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowQR(false)}
                  className="gap-2"
                >
                  Masquer QR Code
                </Button>
              </div>
            </div>
          ) : (
            <Card className="p-6 shadow-lg relative overflow-hidden mb-6">
              <BackgroundDecoration variant="minimal" position="bottom-right" className="opacity-10" />
              
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full mb-4">
                  <span className="font-bold">Code:</span>
                     <span className="text-2xl text-primary font-bold tracking-wider">{code}</span>
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
                   <Button onClick={() => setIsShareOpen(true)} variant="ghost" size="sm">
                     <Share2 className="h-4 w-4 mr-1" /> Partager
                   </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="flex gap-2 justify-center">
            <Button 
              onClick={() => navigate(`/waiting-room/${code}`)}
              className="gap-2"
            >
              Aller en salle d'attente
            </Button>
          </div>
        </div>

        <ShareGameDialog
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
          gameCode={code || ''}
          gameData={gameData || { gameCode: code, players: [], questions: [] }}
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
               <span className="text-xl text-primary font-bold tracking-wider">{code}</span>
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
