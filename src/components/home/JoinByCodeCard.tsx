
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, Hash, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JoinByCodeCard = () => {
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
    
    // Simuler la vérification du code avec un effet de recherche plus stylé
    setTimeout(() => {
      // Vérifier d'abord si c'est une partie rapide dans le sessionStorage
      const storedGameData = sessionStorage.getItem('gameData');
      if (storedGameData) {
        try {
          const data = JSON.parse(storedGameData);
          if (data.gameCode === trimmedCode) {
            setIsJoining(false);
            toast({
              title: "🎉 Partie rapide trouvée !",
              description: "Redirection vers la partie...",
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
      
      // Créer une fausse partie en ligne pour la démo avec plus de données
      const fakeOnlineGame = {
        gameCode: trimmedCode,
        players: [
          {
            id: 'host-1',
            name: 'Hôte de la partie',
            status: 'online',
            avatar: `https://ui-avatars.com/api/?name=Hôte&background=a855f7&color=fff`
          },
          {
            id: 'player-2',
            name: 'Alice',
            status: 'online',
            avatar: `https://ui-avatars.com/api/?name=Alice&background=ec4899&color=fff`
          },
          {
            id: 'player-3',
            name: 'Bob',
            status: 'online',
            avatar: `https://ui-avatars.com/api/?name=Bob&background=3b82f6&color=fff`
          }
        ],
        type: 'friendly',
        status: 'waiting',
        aiGenerated: true,
        partyName: "Soirée entre amis 🎉",
        questions: [
          "Qui est le plus susceptible de devenir célèbre ?",
          "Qui est le plus susceptible d'oublier son anniversaire ?",
          "Qui est le plus susceptible de voyager seul autour du monde ?",
          "Qui est le plus susceptible de devenir millionnaire ?",
          "Qui est le plus susceptible de changer complètement de carrière ?"
        ]
      };
      
      // Stocker la partie temporairement
      sessionStorage.setItem('gameData', JSON.stringify(fakeOnlineGame));
      
      setIsJoining(false);
      toast({
        title: "🚀 Partie trouvée !",
        description: `Rejoindre "${fakeOnlineGame.partyName}"...`,
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
      const quickGameMatch = text.match(/\/join-quick\/([A-Z0-9]{4,8})/i);
      const onlineGameMatch = text.match(/\/join\/([A-Z0-9]{4,8})/i);
      
      if (quickGameMatch) {
        setGameCode(quickGameMatch[1].toUpperCase());
        toast({
          title: "📋 Code collé !",
          description: "Code de partie rapide détecté",
        });
      } else if (onlineGameMatch) {
        setGameCode(onlineGameMatch[1].toUpperCase());
        toast({
          title: "📋 Code collé !",
          description: "Code de partie en ligne détecté",
        });
      } else if (/^[A-Z0-9]{4,8}$/i.test(text.trim())) {
        setGameCode(text.trim().toUpperCase());
        toast({
          title: "📋 Code collé !",
          description: "Code de partie détecté",
        });
      } else {
        toast({
          title: "❌ Format invalide",
          description: "Le lien ou code copié n'est pas valide",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible d'accéder au presse-papiers",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white via-purple-50 to-pink-50 border-purple-200 shadow-lg relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-16 h-16 bg-purple-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-pink-300 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-yellow-300 rounded-full animate-pulse animation-delay-2000"></div>
      </div>
      
      <CardHeader className="text-center relative z-10">
        <CardTitle className="flex items-center justify-center gap-2 text-purple-700">
          <div className="relative">
            <Hash className="h-6 w-6 text-purple-600" />
            <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1 animate-twinkle" />
          </div>
          Rejoindre avec un code
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Entre le code de la partie ou colle un lien d'invitation
        </p>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <form onSubmit={handleJoinByCode} className="space-y-6">
          <div className="flex gap-3">
            <Input
              placeholder="ABCD1234 ou lien d'invitation"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              className="flex-1 text-center font-mono text-lg tracking-wider transition-all duration-200 focus:scale-105 focus:ring-4 focus:ring-purple-200 border-purple-200 focus:border-purple-400"
              disabled={isJoining}
              maxLength={8}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handlePasteFromClipboard}
              disabled={isJoining}
              className="shrink-0 hover:scale-110 transition-transform border-purple-200 hover:border-purple-400 hover:bg-purple-50"
            >
              <Link className="h-4 w-4 text-purple-600" />
            </Button>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 py-6 text-lg font-medium"
            disabled={isJoining || !gameCode.trim()}
          >
            {isJoining ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Recherche de la partie...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Rejoindre la partie
              </>
            )}
          </Button>
        </form>
        
        {/* Exemples de codes */}
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border border-purple-100">
          <p className="text-xs text-gray-600 mb-2 font-medium">Exemples de codes :</p>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setGameCode('DEMO123')}
              className="px-3 py-1 bg-white rounded-full text-xs font-mono text-purple-600 hover:bg-purple-100 transition-colors border border-purple-200"
            >
              DEMO123
            </button>
            <button 
              onClick={() => setGameCode('FUN2024')}
              className="px-3 py-1 bg-white rounded-full text-xs font-mono text-purple-600 hover:bg-purple-100 transition-colors border border-purple-200"
            >
              FUN2024
            </button>
            <button 
              onClick={() => setGameCode('PARTY99')}
              className="px-3 py-1 bg-white rounded-full text-xs font-mono text-purple-600 hover:bg-purple-100 transition-colors border border-purple-200"
            >
              PARTY99
            </button>
          </div>
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </Card>
  );
};

export default JoinByCodeCard;
