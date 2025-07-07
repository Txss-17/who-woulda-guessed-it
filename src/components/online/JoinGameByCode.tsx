import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, Hash, Loader2, QrCode, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
    
    try {
      // Vérifier que la partie existe dans Supabase
      const { data, error } = await supabase
        .from('realtime_games')
        .select('code, status')
        .eq('code', trimmedCode)
        .eq('status', 'waiting')
        .single();

      if (error || !data) {
        toast({
          title: "Partie non trouvée",
          description: "Aucune partie en attente avec ce code",
          variant: "destructive"
        });
        setIsJoining(false);
        return;
      }

      toast({
        title: "Partie trouvée !",
        description: "Redirection vers la partie..."
      });
      
      // Rediriger vers la page de jointure
      setTimeout(() => {
        navigate(`/join/${trimmedCode}`);
      }, 500);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vérifier la partie",
        variant: "destructive"
      });
      setIsJoining(false);
    }
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
