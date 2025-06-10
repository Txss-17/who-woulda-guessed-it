
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, Hash } from 'lucide-react';
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
    
    // Simuler la vérification du code
    setTimeout(() => {
      setIsJoining(false);
      
      // Simuler la redirection vers la partie
      toast({
        title: "Code valide !",
        description: "Redirection vers la partie..."
      });
      
      setTimeout(() => {
        navigate(`/join/${gameCode.toUpperCase()}`);
      }, 1000);
    }, 1000);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      
      // Extraire le code de partie depuis un lien ou utiliser le texte directement
      const codeMatch = text.match(/\/join\/([A-Z0-9]{4,8})/i) || text.match(/\/join-quick\/([A-Z0-9]{4,8})/i);
      if (codeMatch) {
        setGameCode(codeMatch[1].toUpperCase());
      } else if (/^[A-Z0-9]{4,8}$/i.test(text.trim())) {
        setGameCode(text.trim().toUpperCase());
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

  return (
    <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Hash className="h-5 w-5 text-accent animate-pulse" />
          Rejoindre avec un code
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Entre le code de la partie ou colle un lien d'invitation
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleJoinByCode} className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="CODE123 ou lien d'invitation"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              className="flex-1 text-center font-mono text-lg tracking-wider"
              disabled={isJoining}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handlePasteFromClipboard}
              disabled={isJoining}
              className="shrink-0"
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isJoining || !gameCode.trim()}
          >
            {isJoining ? 'Connexion...' : 'Rejoindre la partie'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JoinGameByCode;
