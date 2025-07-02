import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Crown, 
  Star, 
  Share2, 
  RotateCcw, 
  Home, 
  Users,
  TrendingUp,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Blob, BackgroundDecoration } from '@/components/DecorativeElements';
import Confetti from '@/components/Confetti';

interface GameStats {
  totalPlayers: number;
  totalVotes: number;
  mostVotedPlayer: string;
  gameCode: string;
  gameType: string;
  duration: string;
}

const GameEnd = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [playerStats, setPlayerStats] = useState<any[]>([]);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Récupérer les données de fin de partie
    const gameDataStr = sessionStorage.getItem('gameData');
    const gameResultsStr = sessionStorage.getItem('gameResults');
    
    if (gameDataStr) {
      try {
        const gameData = JSON.parse(gameDataStr);
        const gameResults = gameResultsStr ? JSON.parse(gameResultsStr) : null;
        
        // Calculer les statistiques de la partie
        const stats: GameStats = {
          totalPlayers: gameData.players?.length || 0,
          totalVotes: gameResults?.totalVotes || 0,
          mostVotedPlayer: gameResults?.mostVotedPlayer || gameData.players?.[0]?.name || 'Inconnu',
          gameCode: gameData.gameCode || gameCode || 'UNKNOWN',
          gameType: gameData.aiGenerated ? 'IA générées' : 'Questions prédéfinies',
          duration: gameResults?.duration || '5 min'
        };
        
        setGameStats(stats);
        
        // Calculer les statistiques des joueurs
        const playersWithStats = gameData.players?.map((player: any, index: number) => ({
          ...player,
          votes: gameResults?.playerVotes?.[player.id] || Math.floor(Math.random() * 10),
          rank: index + 1,
          isWinner: index === 0
        })) || [];
        
        setPlayerStats(playersWithStats);
        
        // Masquer les confettis après 5 secondes
        setTimeout(() => setShowConfetti(false), 5000);
        
      } catch (error) {
        console.error('Erreur lors du chargement des résultats:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les résultats de la partie",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Partie introuvable",
        description: "Les données de la partie ne sont pas disponibles",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [gameCode, navigate, toast]);

  const shareResults = () => {
    if (!gameStats) return;
    
    const shareText = `🎉 Partie terminée ! ${gameStats.mostVotedPlayer} a été le plus voté avec ${playerStats[0]?.votes || 0} votes ! #WhoMostLikely`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Who Most Likely? - Résultats',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Résultats copiés !",
        description: "Les résultats ont été copiés dans le presse-papiers"
      });
    }
  };

  const playAgain = () => {
    // Nettoyer les données de la partie précédente mais garder les joueurs
    const gameDataStr = sessionStorage.getItem('gameData');
    if (gameDataStr) {
      const gameData = JSON.parse(gameDataStr);
      const newGameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const newGameData = {
        ...gameData,
        gameCode: newGameCode
      };
      
      sessionStorage.setItem('gameData', JSON.stringify(newGameData));
      sessionStorage.removeItem('gameResults');
      
      navigate(`/waiting-room/${newGameCode}`);
    } else {
      navigate('/quick-game');
    }
  };

  if (!gameStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <Card className="p-6">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin mx-auto mb-4 rounded-full border-2 border-primary border-t-transparent" />
            <p>Chargement des résultats...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-6 px-4 overflow-hidden">
      {showConfetti && <Confetti active={showConfetti} />}
      
      <Blob color="primary" position="top-left" size="lg" className="-mt-32 -ml-32 opacity-30" />
      <Blob color="accent" position="bottom-right" size="lg" className="-mb-32 -mr-32 opacity-25" />
      <BackgroundDecoration variant="primary" position="top-right" className="opacity-15" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Partie terminée !
            </h1>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <span className="font-bold">Code:</span>
            <span className="text-xl text-primary font-bold tracking-wider">{gameStats.gameCode}</span>
          </div>
        </div>

        {/* Winner Section */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              <CardTitle className="text-2xl text-yellow-700">Joueur le plus voté</CardTitle>
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              🎉 {gameStats.mostVotedPlayer} 🎉
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              {playerStats[0]?.votes || 0} votes reçus
            </Badge>
          </CardHeader>
        </Card>

        {/* Game Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{gameStats.totalPlayers}</div>
                <div className="text-sm text-muted-foreground">Joueurs</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold">{gameStats.totalVotes}</div>
                <div className="text-sm text-muted-foreground">Votes totaux</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{gameStats.duration}</div>
                <div className="text-sm text-muted-foreground">Durée</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-sm font-bold">{gameStats.gameType}</div>
                <div className="text-sm text-muted-foreground">Type de questions</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Rankings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Classement final
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {playerStats.map((player, index) => (
                <div 
                  key={player.id}
                  className={`
                    flex items-center justify-between p-4 rounded-lg
                    ${index === 0 ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200 border' : 
                      index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-200 border' :
                      index === 2 ? 'bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-200 border' :
                      'bg-secondary/30'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold
                      ${index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-500 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-secondary text-secondary-foreground'}
                    `}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{player.name}</span>
                    {index === 0 && <Crown className="h-5 w-5 text-yellow-500" />}
                  </div>
                  <Badge variant={index < 3 ? "default" : "secondary"}>
                    {player.votes} votes
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={playAgain} className="gap-2" size="lg">
            <RotateCcw className="h-4 w-4" />
            Rejouer
          </Button>
          
          <Button onClick={shareResults} variant="outline" className="gap-2" size="lg">
            <Share2 className="h-4 w-4" />
            Partager les résultats
          </Button>
          
          <Button onClick={() => navigate('/')} variant="ghost" className="gap-2" size="lg">
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameEnd;