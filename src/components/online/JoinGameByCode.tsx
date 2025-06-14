import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, Hash, Loader2, QrCode, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JoinGameByCode = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameCode, setGameCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gameCode.trim()) {
      toast({
        title: "Code requis",
        description: "Veuillez entrer un code de partie",
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    
    const trimmedCode = gameCode.trim().toUpperCase();
    
    // Simuler la vérification du code
    setTimeout(() => {
      // Vérifier d'abord si c'est une partie rapide dans le sessionStorage
      const storedGameData = sessionStorage.getItem('gameData');
      if (storedGameData) {
        try {
          const data = JSON.parse(storedGameData);
          if (data.gameCode === trimmedCode) {
            setIsJoining(false);
            toast({
              title: "Partie rapide trouvée !",
              description: "Redirection vers la partie..."
            });
            setTimeout(() => {
              navigate(`/join-quick/${trimmedCode}`);
            }, 500);
            return;
          }
        } catch (error) {
          console.log('Erreur lors de la vérification du sessionStorage:', error);
        }
      }
      
      // Créer une fausse partie en ligne pour la démo
      const fakeOnlineGame = {
        gameCode: trimmedCode,
        players: [
          {
            id: 'host-1',
            name: 'Hôte de la partie',
            status: 'online',
            avatar: `https://ui-avatars.com/api/?name=Hôte&background=10b981&color=fff`
          }
        ],
        type: 'friendly',
        status: 'waiting',
        aiGenerated: true,
        questions: [
          "Qui est le plus susceptible de devenir célèbre ?",
          "Qui est le plus susceptible d'oublier son anniversaire ?",
          "Qui est le plus susceptible de voyager seul ?",
          "Qui est le plus susceptible de devenir millionnaire ?",
          "Qui est le plus susceptible de changer de carrière ?"
        ]
      };
      
      // Stocker la partie temporairement
      sessionStorage.setItem('gameData', JSON.stringify(fakeOnlineGame));
      
      setIsJoining(false);
      toast({
        title: "Partie trouvée !",
        description: "Redirection vers la partie..."
      });
      
      setTimeout(() => {
        navigate(`/join/${trimmedCode}`);
      }, 500);
    }, 1500);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      
      // Extraire le code de partie depuis un lien ou utiliser le texte directement
      const codeMatch = text.match(/\/join\/([A-Z0-9]{4,8})/i) || text.match(/\/join-quick\/([A-Z0-9]{4,8})/i);
      if (codeMatch) {
        setGameCode(codeMatch[1].toUpperCase());
        toast({
          title: "Code collé !",
          description: "Code extrait du lien"
        });
      } else if (/^[A-Z0-9]{4,8}$/i.test(text.trim())) {
        setGameCode(text.trim().toUpperCase());
        toast({
          title: "Code collé !",
          description: "Code de partie détecté"
        });
      } else {
        toast({
          title: "Format invalide",
          description: "Le lien ou code copié n'est pas valide",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au presse-papiers",
        variant: "destructive"
      });
    }
  };

  const handleQRScan = () => {
    // Pour l'instant, on affiche un message informatif
    // Dans une vraie app, on ouvrirait la caméra pour scanner
    toast({
      title: "Scanner QR Code",
      description: "Fonctionnalité de scan QR disponible bientôt ! Pour l'instant, colle le lien ou entre le code manuellement.",
    });
  };

  return (
    <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20 hover:shadow-lg transition-all duration-300">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Hash className="h-5 w-5 text-accent animate-pulse" />
          Rejoindre avec un code
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Entre le code, colle un lien ou scanne un QR code
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleJoinByCode} className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="ABCD1234 ou lien d'invitation"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              className="flex-1 text-center font-mono text-lg tracking-wider transition-all duration-200 focus:scale-105"
              disabled={isJoining}
              maxLength={8}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handlePasteFromClipboard}
              disabled={isJoining}
              className="shrink-0 hover:scale-110 transition-transform"
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleQRScan}
              disabled={isJoining}
              className="shrink-0 hover:scale-110 transition-transform"
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            type="submit" 
            className="w-full transition-all duration-200 hover:scale-105"
            disabled={isJoining || !gameCode.trim()}
          >
            {isJoining ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Recherche de la partie...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Rejoindre la partie
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleQRScan}
            className="gap-2 text-primary hover:bg-primary/10"
          >
            <QrCode className="h-4 w-4" />
            Scanner un QR code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinGameByCode;
